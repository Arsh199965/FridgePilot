"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
} from "lucide-react";

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
  const[autoExpiry, setAutoExpiry] = useState(false);
  const [formData, setFormData] = useState<PantryItem>(
    item || {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "general",
      expiryDate: "Auto",
      addedDate: new Date().toISOString().split("T")[0],
      notes: "No Note Set",
    }
  );

  // Update form data if editing a different item
  React.useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "general",
      expiryDate: "Auto",
      addedDate: new Date().toISOString().split("T")[0],
      notes: "No Note Set",
    });
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
                    <option value="baked">Cooked/Baked Flour</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="seafood">Seafood</option>
                    <option value="grains">Grains</option>
                    <option value="spices">Spices</option>
                    <option value="sauces">Sauces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    disabled={autoExpiry}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="checkbox"
                    checked={autoExpiry}
                    onChange={(e) => setAutoExpiry(e.target.checked)}
                    className=" text-white accent-emerald-400"
                  />
                  <label className=" px-2 text-xs font-light text-neutral-300">
                    Automatically set expiry date{" "}
                  </label>
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
export default EditModal;