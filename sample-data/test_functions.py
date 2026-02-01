from pymongo import MongoClient
import json
from pathlib import Path

def read_json_file(file_path):
    json_path = Path(__file__).resolve().parent / file_path
    with open(json_path, "r", encoding="utf-8") as file:
        doc_list = json.load(file)
    return doc_list


def connect_to_db(uri, db_name):
    try:
        client = MongoClient(uri)
        return client, client[db_name]
    except Exception as e:
        raise Exception(
            "An error occurred while connecting to database: " + str(e)
        )

def load_data(uri, db_name, collection_name, documents):
    client, db = connect_to_db(uri, db_name)
    collection = db[collection_name]

    try:
        collection.insert_many(documents)
        print("Data loaded successfully.")
    except Exception as e:
        raise Exception("An error occurred while loading data: " + str(e))
    finally:
        client.close()

# def main():
#     uri = "mongodb://localhost:27017/"

#     # load test data for users collection
#     db_name = "test_db_users"
#     collection_name = "users"

#     json_path = Path(__file__).resolve().parent / "sample_users.json"
#     with open(json_path, "r", encoding="utf-8") as file:
#         doc_list = json.load(file)

#     load_data(uri, db_name, collection_name, doc_list)


# if __name__ == "__main__":
#     main()

