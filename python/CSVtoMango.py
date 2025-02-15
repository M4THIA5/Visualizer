import csv
import os
import pathlib
from os.path import basename

from projet.files.main import get_database, fetch_data

dir_path = pathlib.Path(pathlib.Path(__file__).parent.joinpath('files/used'))
dbname = get_database()


def pull_csv_to_mongo():
    for file in dir_path.iterdir():
        file = pathlib.Path(file)
        if file.glob('*.csv'):
            try:
                with open(file, mode='r', encoding='utf-8') as f:
                    res = list(csv.DictReader(f,delimiter=';'))  # Convertir en liste
                    name_collection = file.stem[:-1]
                    print(f"Traitement du fichier {file.name}")
                    dbname[name_collection].insert_many(res)
                    print(f"Traitement du fichier {file.name} terminé")
            except Exception as e:
                print(f"Erreur lors du traitement du fichier {file.name}: {e}")


pull_csv_to_mongo()
print(dbname.list_collection_names())
print(fetch_data("sites"))




# ['sites_Metropole', 'sites_5G_historique_comptage', 'test', 'sites_Outremer', 'collection']
