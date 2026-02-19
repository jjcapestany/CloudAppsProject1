from pymongo import MongoClient
import json
from pathlib import Path
import test_functions

from api.auth.utils import hash_password

def main():
    uri = "mongodb://localhost:27017/"

    # load test data for users collection
    # users_db_name = "test_db_users"
    # projects_db_name = "test_db_projects"
    # hardware_db_name = "test_db_hardware"

    users_db_name = "myapp"
    projects_db_name = "myapp"
    hardware_db_name = "myapp"


    users_collection_name = "users"
    projects_collection_name = "projects"
    hardware_collection_name = "hardware"

    doc_list = test_functions.read_json_file("sample_users.json")
    for doc in doc_list:
        doc['password_hash'] = hash_password(doc.pop('password_human_readable', None)) 
    test_functions.load_data(uri, users_db_name, users_collection_name, doc_list)

    doc_list = test_functions.read_json_file("sample_projects.json")
    test_functions.load_data(uri, projects_db_name, projects_collection_name, doc_list)

    doc_list = test_functions.read_json_file("sample_hw_sets.json")
    test_functions.load_data(uri, hardware_db_name, hardware_collection_name, doc_list)


if __name__ == "__main__":
    main()
