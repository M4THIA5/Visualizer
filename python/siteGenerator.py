import pandas as pd
import json
import os
from main import get_database, fetch_data
from math import isnan

dbname = get_database()

# Charger le fichier CSV
csv_file_path = os.path.dirname(os.path.abspath(__file__))+"/sites1.csv"
# Lire tout en tant que chaîne pour éviter les erreurs de conversion
df = pd.read_csv(csv_file_path, dtype=str, sep=";")
print(df)
# Définition de la structure JSON
json_data = []

for _, row in df.iterrows():
    entry = {
        "date": row["date"] if isinstance(row["date"], str) or not isnan(row["date"])else "",
        "location": {
            "code": row["NIVGEO"] if isinstance(row["NIVGEO"], str) or not isnan(row["NIVGEO"])else "",
            "name": row["LIBGEO"] if isinstance(row["LIBGEO"], str) or not isnan(row["LIBGEO"])else ""
        },
        "operator": {
            "name": row["nom_operateur"] if isinstance(row["nom_operateur"], str) or not isnan(row["nom_operateur"])else ""
        },
        "site5G": {
            "total": int(row["nb_sites5G_total"]) if row["nb_sites5G_total"].isdigit() else 0,
            "frequencies": {
                "700_800_MHz": int(row["nb_sites5G_freq_700_800_MHz"]) if row["nb_sites5G_freq_700_800_MHz"].isdigit() else 0,
                "1800_2100_MHz": int(row["nb_sites5G_freq_1800_2100_MHz"]) if row["nb_sites5G_freq_1800_2100_MHz"].isdigit() else 0,
                "3500_MHz": int(row["nb_sites5G_freq_3500_MHz"]) if row["nb_sites5G_freq_3500_MHz"].isdigit() else 0
            }
        }
    }
    json_data.append(entry)


dbname["newsite"].insert_many(json_data)