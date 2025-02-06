"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Trash2, CheckCircle } from "lucide-react";

interface AlertItem {
  id: string;
  name: string;
  expiryDate: string;
  daysUntilExpiry: number;
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/pantry/get-items?user_id=${userId}`
        );
        const data = await response.json();

        // Process items to create alerts
        const alertItems = data.data
          .map((item: AlertItem) => ({
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

        setAlerts(alertItems);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Expiry Alerts</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12 bg-neutral-800/50 rounded-xl border border-neutral-700/50"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">All Clear!</h3>
            <p className="text-neutral-400">
              No items are approaching expiration.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={item}
                className={`p-6 rounded-xl border transition-all ${
                  alert.daysUntilExpiry <= 0
                    ? "bg-red-950/20 border-red-700/50"
                    : alert.daysUntilExpiry <= 3
                    ? "bg-amber-950/20 border-amber-700/50"
                    : "bg-neutral-800/40 border-neutral-700/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        alert.daysUntilExpiry <= 0
                          ? "bg-red-500/10"
                          : alert.daysUntilExpiry <= 3
                          ? "bg-amber-500/10"
                          : "bg-emerald-500/10"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-6 h-6 ${
                          alert.daysUntilExpiry <= 0
                            ? "text-red-400"
                            : alert.daysUntilExpiry <= 3
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">{alert.name}</h3>
                      <p className="text-neutral-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {alert.daysUntilExpiry <= 0
                          ? "Expired!"
                          : `Expires in ${alert.daysUntilExpiry} days`}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AlertsPage;
