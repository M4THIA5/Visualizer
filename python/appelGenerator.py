import pathlib
import pandas as pd
from math import isnan

def generator_appel():
    from main import get_database
    dbname = get_database()
    csv_file_path = pathlib.Path(pathlib.Path(__file__).parent.joinpath('files/used')) / "appels1.csv"
    df = pd.read_csv(csv_file_path, dtype=str, sep=";")
    json_data = []
    for _, row in df.iterrows():
        entry = {
            "operator": {
                "name": row["nom_op"] if isinstance(row["nom_op"], str) or not isnan(row["nom_op"]) else "",
                "code": row["code_op" if isinstance(row["code_op"], str) or not isnan(row["code_op"]) else ""]
            },
            "localisation": {
                "x": row["x"] if isinstance(row["x"], str) or not isnan(row["x"]) else "",
                "y": row["y"] if isinstance(row["y"], str) or not isnan(row["y"]) else "",
                "latitude": row["latitude"] if isinstance(row["latitude"], str) or not isnan(row["latitude"]) else "",
                "longitude": row["longitude"] if isinstance(row["longitude"], str) or not isnan(
                    row["longitude"]) else "",
                "region": row["nom_reg"] if isinstance(row["nom_reg"], str) or not isnan(row["nom_reg"]) else "",
                "departement": row["nom_dep"] if isinstance(row["nom_dep"], str) or not isnan(row["nom_dep"]) else "",
            },
            "date": row["date_ouverturecommerciale_5g"] if isinstance(row["date_ouverturecommerciale_5g"],
                                                                      str) or not isnan(
                row["date_ouverturecommerciale_5g"]) else "",
            "specfications": {
                "700_MHz": int(row["site_5g_700_m_hz"]) + int(row["site_2g"]) if row["site_5g_700_m_hz"].isdigit() and
                                                                                 row["site_2g"].isdigit() else 0,
                "800_MHz": int(row["site_5g_800_m_hz"]) + int(row["site_3g"]) if row["site_5g_800_m_hz"].isdigit() and
                                                                                 row["site_3g"].isdigit() else 0,
                "1800_MHz": int(row["site_5g_1800_m_hz"]) + int(row["site_4g"]) if row[
                                                                                       "site_5g_1800_m_hz"].isdigit() and
                                                                                   row["site_4g"].isdigit() else 0,
                "2100_MHz": int(row["site_5g_2100_m_hz"]) + int(row["site_5g"]) if row[
                                                                                       "site_5g_2100_m_hz"].isdigit() and
                                                                                   row["site_5g"].isdigit() else 0,
                "3500_MHz": int(row["site_5g_3500_m_hz"]) + int(row["mes_4g_trim"]) if row[
                                                                                           "site_5g_3500_m_hz"].isdigit() and
                                                                                       row[
                                                                                           "mes_4g_trim"].isdigit() else 0,
            }
        }
        json_data.append(entry)
    dbname["newappel"].insert_many(json_data)
