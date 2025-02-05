"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Package,
  Bell,
  LogOut,
  Settings,
  Save,
  UserCircle,
  AlertTriangle,
} from "lucide-react";
interface AlertItem {
  id: string;
  name: string;
  expiryDate: string;
  daysUntilExpiry: number;
}
const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    itemCount: 0,
    alertCount: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alerts, setAlerts] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    const fetchName = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/others/get-name?user_id=${userId}`
        );
        const data = await response.json();
        setNewName(data.name);
        setUserData({ ...userData, name: data.name, email: userId });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };
    fetchName();

    const fetchAlerts = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/pantry/get-items?user_id=${userId}`
        );
        const data = await response.json();

        // Process items to create alerts
        setTotalItems(data.data.length);
        const alertItems = data.data
          .map((item: any) => ({
            ...item,
            daysUntilExpiry: Math.ceil(
              (new Date(item.expiryDate).getTime() - new Date().getTime()) /
                (1000 * 3600 * 24)
            ),
          }))
          .filter((item: AlertItem) => item.daysUntilExpiry <= 3)
          .sort(
            (a: AlertItem, b: AlertItem) =>
              a.daysUntilExpiry - b.daysUntilExpiry
          );

        setAlerts(alertItems.length);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User not found!");
      return;
    }
    // Create a payload with fields that have changed
    const payload: { name?: string; password?: string } = {};
    if (newName.trim() && newName !== userData.name) {
      payload.name = newName.trim();
    }
    if (newPassword.trim()) {
      payload.password = newPassword.trim();
    }
    if (Object.keys(payload).length === 0) {
      alert("No changes to save.");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/others/update-profile?user_id=${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        alert("Profile updated successfully!");
        // Optionally, refetch user data
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not found!");
        return;
      }
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/others/delete-profile?user_id=${userId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          alert("Account deleted successfully!");
          localStorage.removeItem("user_id");
          // Redirect to signup or login page
          router.push("/login");
        } else {
          const errorData = await response.json();
          alert(`Delete failed: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("An error occurred while deleting your account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="text-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
          >
            {getInitials(userData.name)}
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
          <p className="text-neutral-400">{userData.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-neutral-800/40 rounded-xl border border-neutral-700/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <Package className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{totalItems}</h3>
                <p className="text-neutral-400">Items in Pantry</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-neutral-800/40 rounded-xl border border-neutral-700/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Bell className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{alerts}</h3>
                <p className="text-neutral-400">Active Alerts</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 bg-neutral-700/50 rounded-lg border border-neutral-600/50 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 bg-neutral-700/50 rounded-lg border border-neutral-600/50 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveChanges}
              className="w-full py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Account Management */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-2 bg-neutral-700/50 rounded-lg hover:bg-neutral-600/50 transition-colors"
          >
            <LogOut className="w-5 h-5 inline mr-2" />
            Log Out
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteAccount}
            className="w-full py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
          >
            <AlertTriangle className="w-5 h-5 inline mr-2" />
            Delete Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
