from . import test_functions

def main():
    uri = "mongodb://localhost:27017/"

    # users_db_name = "test_db_users"
    # projects_db_name = "test_db_projects"
    # hardware_db_name = "test_db_hardware"

    users_db_name = "myapp"
    projects_db_name = "myapp"
    hardware_db_name = "myapp"
    

    for db_name in [users_db_name, projects_db_name, hardware_db_name]:
        client, db = test_functions.connect_to_db(uri, db_name)
        try:
            # Drop the database to clean up
            client.drop_database(db_name)
            print(f"Database '{db_name}' dropped successfully.")
        except Exception as e:
            print("An error occurred while dropping the database: " + str(e))
        finally:
            client.close()


if __name__ == "__main__":
    main()