import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re

# Load recipes from a JSON file (adjust file name if needed)
with open("recipes.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Convert JSON recipes into a DataFrame.
recipes_list = []
for rec_id, rec in data.items():
    ingredients_text = " ".join(rec.get("ingredients", []))
    recipes_list.append({
        "id": rec_id,
        "title": rec.get("title", ""),
        "instructions": rec.get("instructions", ""),
        "ingredients_text": ingredients_text,
        "picture_link": rec.get("picture_link", "")
    })
recipes = pd.DataFrame(recipes_list)

# Vectorize the ingredients text.
vectorizer = TfidfVectorizer(stop_words="english")
recipe_vectors = vectorizer.fit_transform(recipes["ingredients_text"])

def format_instructions(instr_text):
    """
    Format instructions into a list of steps.
    If newline characters are present, split on them.
    Otherwise, split on periods followed by a space.
    """
    if "\n" in instr_text:
        steps = [step.strip() for step in instr_text.split("\n") if step.strip()]
    else:
        # Split on period+space, remove empty steps.
        steps = [step.strip() for step in re.split(r'\.\s+', instr_text) if step.strip()]
    return steps

def recommend_recipes(pantry_ingredients, expiry_info, top_n=10):
    """
    Build a weighted query vector by computing each ingredient’s TF-IDF vector,
    scaled by a weight that gives extra emphasis to ingredients expiring soon.
    Then, average these vectors and compute cosine similarity against all recipes.
    
    pantry_ingredients: list of ingredient names, e.g. ["mutton", "chicken", ...]
    expiry_info: dict mapping ingredient to days until expiry, e.g. {"mutton": 2, "chicken": 10}
    top_n: number of recipes to return.
    """
    # For each ingredient, calculate a weight:
    # Weight = 1.0 + bonus, where bonus = (30 - days_left)/30 if days_left < 30 else 0.
    # This yields a weight between 1.0 and 2.0.
 
    weighted_vectors = []
    for ing in pantry_ingredients:
        days_left = expiry_info.get(ing, 30)  # default 30 if not found
        bonus = (30 - days_left) / 30.0 if days_left < 30 else 0.0
        weight = 1.0 + bonus
        vec = vectorizer.transform([ing])
        weighted_vectors.append(weight * vec)
    
    # Compute the average weighted query vector.
    if weighted_vectors:
        query_vec = sum(weighted_vectors) / len(weighted_vectors)
    else:
        query_vec = vectorizer.transform([""])
    
    similarities = cosine_similarity(query_vec, recipe_vectors).flatten()
    top_indices = np.argsort(similarities)[::-1][:top_n]
    recs = recipes.iloc[top_indices].copy()
    recs["steps"] = recs["instructions"].apply(format_instructions)
    return recs[["title", "steps", "picture_link"]].to_dict(orient="records")
