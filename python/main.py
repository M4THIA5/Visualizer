from pymongo import MongoClient


from python.affaireGenerator import generator_affaire
from python.appelGenerator import generator_appel
from python.siteGenerator import generator_site


def get_database():
    # Provide the mongodb url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb://neo4j:neo4pass@localhost:27017/project"
    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)
    # Create the database (or fetch the existing one)
    return client['project']


def fetch_data(name_collection = "collection"):
    dbname = get_database()
    collection_name = dbname[name_collection]
    item_details = collection_name.find()
    return item_details


def get_count(name_collection = "collection"):
    dbname = get_database()
    collection_name = dbname[name_collection]
    item_details = collection_name.count_documents({})
    return item_details



if __name__ == "__main__":
    from python.CSVtoMango import pull_csv_to_mongo
    pull_csv_to_mongo()
    generator_affaire()
    generator_appel()
    generator_site()