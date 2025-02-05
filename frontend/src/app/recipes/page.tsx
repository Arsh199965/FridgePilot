"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChefHat, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

interface Recipe {
  title: string;
  steps: string[];
  picture_link: string;
}

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(
    new Set()
  );

  const toggleRecipe = (index: number) => {
    const newExpanded = new Set(expandedRecipes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRecipes(newExpanded);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/recipe/get-recipes?user_id=${userId}`
        );
        const data = await response.json();
        if(data.recipes) setRecipes(data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Smart Recipe Suggestions</h1>
          <p className="text-neutral-400">
            Discover recipes based on your pantry items
          </p>
          <p className="text-neutral-400 text-[0.77rem]">
            (Priority to expiring items)
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-emerald-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {recipes
              .filter((recipe) => recipe.steps && recipe.steps.length >= 2)
              .map((recipe, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="p-6 bg-neutral-800/40 border border-neutral-700/50 rounded-xl hover:border-neutral-600/50 transition-all overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <BookOpen className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-4">
                        {recipe.title}
                      </h3>
                      <motion.div
                        className="space-y-3"
                        animate={{
                          height: expandedRecipes.has(index) ? "auto" : "250px",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {recipe.steps
                          .slice(0, expandedRecipes.has(index) ? undefined : 4)
                          .map((step, stepIndex) => (
                            <motion.div
                              key={stepIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIndex * 0.1 }}
                              className="flex gap-4 p-3 bg-neutral-800/40 rounded-lg"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">
                                {stepIndex + 1}
                              </span>
                              <p className="text-neutral-300">{step}</p>
                            </motion.div>
                          ))}
                      </motion.div>

                      <div className="mt-4 space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleRecipe(index)}
                          className="w-full py-2 bg-neutral-700/30 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-colors"
                        >
                          {expandedRecipes.has(index) ? (
                            <>
                              <ChevronUp className="w-4 h-4 inline mr-2" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 inline mr-2" />
                              View Full Recipe ({recipe.steps.length} steps)
                            </>
                          )}
                        </motion.button>

                        {expandedRecipes.has(index) && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              window.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                  recipe.title
                                )}`,
                                "_blank"
                              );
                            }}
                            className="w-full py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors"
                          >
                            View Video Tutorial
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RecipesPage;
