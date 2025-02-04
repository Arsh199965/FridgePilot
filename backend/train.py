import json
import pandas as pd

# Open the file with UTF-8 encoding
with open("FoodKeeper.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Locate the "Product" sheet in the JSON structure.
product_sheet = None
for sheet in data.get("sheets", []):
    if sheet.get("name") == "Product":
        product_sheet = sheet
        break

if product_sheet is None:
    raise ValueError("Product sheet not found in the JSON file.")

# Convert the sheet's data to a DataFrame.
product_rows = []
for row in product_sheet["data"]:
    row_dict = {}
    for cell in row:
        row_dict.update(cell)
    product_rows.append(row_dict)

df = pd.DataFrame(product_rows)
print("Loaded DataFrame shape:", df.shape)
print(df.head())
if 'Category_ID' in df.columns and 'Name' in df.columns:
    unique_categories = df[['Category_ID', 'Name']].drop_duplicates()
    print("Category Mapping:")
    for idx, row in unique_categories.iterrows():
        print(f"Category ID: {row['Category_ID']} => {row['Name']}")
else:
    print("Required category columns not found in the DataFrame.")
# print("DataFrame columns:", df.columns.tolist())