"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Calendar,
  Package,
  Save,
} from "lucide-react";
import type { NextPage } from "next";

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

interface EditModalProps {
  item: PantryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PantryItem) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<PantryItem>(
    item || {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "general",
      expiryDate: "",
      addedDate: new Date().toISOString().split("T")[0],
      notes: "",
    }
  );

  // Update form data if editing a different item
  React.useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-800 rounded-xl w-full max-w-lg border border-neutral-700 shadow-xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-100">
                {item ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="g">Grams</option>
                    <option value="l">Liters</option>
                    <option value="ml">Milliliters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">General</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="grains">Grains</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Item
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PantryPage: NextPage = () => {
  const [items, setItems] = useState<PantryItem[]>([
    {
      id: "1",
      name: "Milk",
      quantity: 2,
      unit: "l",
      category: "dairy",
      expiryDate: "2024-02-10",
      addedDate: "2024-02-01",
      notes: "Full fat milk",
    },
    {
      id: "2",
      name: "Bread",
      quantity: 1,
      unit: "pieces",
      category: "grains",
      expiryDate: "2024-02-05",
      addedDate: "2024-02-01",
      notes: "Whole wheat",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  const handleAddEdit = (item: PantryItem) => {
    let updatedItems;
    if (editingItem) {
      updatedItems = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updatedItems = [...items, item];
    }
    setItems(updatedItems);
    saveItemsToBackend(updatedItems);
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    saveItemsToBackend(updatedItems);
  };
  const saveItemsToBackend = async (itemsToSave: PantryItem[]) => {
    try {
      await fetch("http://127.0.0.1:5000/save-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToSave }),
      });
    } catch (error) {
      console.error("Error saving items:", error);
    }
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
      const response = await fetch("http://127.0.0.1:5000/get-items");
      const data = await response.json();
      setItems(data.data);
      };
      getData();
  }, []);
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Header */}
      <header className="bg-neutral-800/50 border-b border-neutral-700">
        <div className="container mx-auto px-4 py-6">
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
                        {item.notes && <p className="italic">"{item.notes}"</p>}
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
        }}
        onSave={handleAddEdit}
      />
    </div>
  );
};

export default PantryPage;
