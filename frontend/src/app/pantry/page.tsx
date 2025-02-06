"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  Package,
} from "lucide-react";
import type { NextPage } from "next";
import EditModal from "../components/EditModal";
interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
  addedDate: string;
  notes?: string;
}


const PantryPage: NextPage = () => {
  const [items, setItems] = useState<PantryItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  // New API functions
  const addItemToBackend = async (item: PantryItem) => {
    const userId = localStorage.getItem("user_id");
    await fetch(`http://127.0.0.1:5000/pantry/add-item?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
  };

  const updateItemToBackend = async (item: PantryItem) => {
    const userId = localStorage.getItem("user_id");
    await fetch(`http://127.0.0.1:5000/pantry/update-item?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
  };

  const deleteItemFromBackend = async (id: string) => {
    const userId = localStorage.getItem("user_id");
    await fetch(
      `http://127.0.0.1:5000/pantry/delete-item?user_id=${userId}&id=${id}`,
      {
        method: "DELETE",
      }
    );
  };
  const getExpiryDate = async (name: string, category: string, addedDate: string) => {
    const response = await fetch(
      `http://127.0.0.1:5000/prediction/predict?name=${name}&category=${category}&buy_date=${addedDate}`
    );
    const data = await response.json();
    return data.predicted_expiry_date;
  }
  // Modified Handlers in PantryPage component:
  const handleAddEdit = async (item: PantryItem) => {
    let updatedItems: PantryItem[];
    if (item.expiryDate === "Auto") {
      const expiryDate = await getExpiryDate(item.name, item.category, item.addedDate);
      item.expiryDate = expiryDate;
    }
    if (editingItem) {
      updatedItems = items.map((i) => (i.id === item.id ? item : i));
      await updateItemToBackend(item);
    } else {
      updatedItems = [...items, item];
      await addItemToBackend(item);
    }
    setItems(updatedItems);
  };

  const handleDelete = async (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    await deleteItemFromBackend(id);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const getData = async () => {
      // Get the current user id (this assumes you've stored it under "user_id" after login)
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:5000/pantry/get-items?user_id=${userId}`
      );
      const data = await response.json();
      setItems(data.data);
    };
    getData();
  }, []);
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Header */}
      <header className="bg-neutral-800/50 border-b border-neutral-700">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              My Pantry
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="grains">Grains</option>
                <option value="spices">Spices</option>
              </select>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-neutral-100">
                        {item.name}
                      </h3>
                      <div className="text-sm text-neutral-400 space-y-1">
                        <p>
                          Quantity: {item.quantity} {item.unit}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} />
                          Added: {item.addedDate} | Expires: {item.expiryDate}
                        </p>
                        {item.notes && (
                          <p className="italic">&quot;{item.notes}&quot;</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-neutral-400 hover:text-neutral-100 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-xl font-medium text-neutral-300 mb-2">
                No items found
              </h3>
              <p className="text-neutral-400">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "Start by adding items to your pantry"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      <EditModal
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          window.location.reload();
        }}
        onSave={handleAddEdit}
      />
    </div>
  );
};

export default PantryPage;
