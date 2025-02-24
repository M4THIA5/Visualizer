import pandas as pd
import json
import os
from math import isnan
from main import get_database, fetch_data


dbname = get_database()
# Charger le fichier CSV
csv_file_path = os.path.dirname(os.path.abspath(__file__))+"/affaires1.csv"
# Lire tout en tant que chaîne pour éviter les erreurs de conversion
df = pd.read_csv(csv_file_path, dtype=str, sep=";")
print(df)
# Définition de la structure JSON
json_data = []

for _, row in df.iterrows():
    entry = {
        "localisation": {
            "commune": row["commune"] if isinstance(row["commune"], str) or not isnan(row["commune"]) else "",
            "code_region": row["Code Officiel Région"] if isinstance(row["Code Officiel Région"], str) or not isnan(row["Code Officiel Région"]) else "",
            "nom_departement": row["Nom Officiel Département"] if isinstance(row["Nom Officiel Département"], str) or not isnan(row["Nom Officiel Département"]) else "",
            "nom_region": row["Nom Officiel Région"] if isinstance(row["Nom Officiel Région"], str) or not isnan(row["Nom Officiel Région"]) else "",
            "lieu": row["Lieux des faits (non normalisé)"] if isinstance(row["Lieux des faits (non normalisé)"], str) or not isnan(row["Lieux des faits (non normalisé)"]) else "",
        },
        "date_debut": row["Date de début"] if isinstance(row["Date de début"], str) or not isnan(row["Date de début"]) else "",
        "date_fin": row["Date de fin"] if isinstance(row["Date de fin"], str) or not isnan(row["Date de fin"]) else "",
        "description": row["Descriptif de l'affaire"] if isinstance(row["Descriptif de l'affaire"], str) or not isnan(row["Descriptif de l'affaire"]) else "",
        "type_affaire": row["Type d'Affaire"] if isinstance(row["Type d'Affaire"], str) or not isnan(row["Type d'Affaire"]) else "",
        # "parties":[ {
        #     row["date"]
        #     },]
    }
    json_data.append(entry)

dbname["newaffaire"].insert_many(json_data)
