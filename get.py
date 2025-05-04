import json
import requests
import config


def get_http_routers():
    try:
        # Send GET request to Traefik API
        response = requests.get(config.TRAEFIK_URL+"api/rawdata")

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            
            # Extract HTTP routers from the response data
            routers = data.get('routers', {})
            
            if routers:
                print("HTTP Routers:")
                for router_name, router_info in routers.items():
                    print(f"\nRouter Name: {router_name}")
                    print(json.dumps(router_info, indent=4))
                return routers
            else:
                print("No HTTP routers found.")
                return {}
        else:
            print(f"Failed to get data from Traefik API. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    return {}

def get_entrypoints():
    try:
        # Send GET request to Traefik API
        response = requests.get(config.TRAEFIK_URL+"api/entrypoints")

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            if data:
                return [entrypoint.get('name', "unnamed") for entrypoint in data]
            else:
                print("No Entry Points found.")
                return []
        else:
            print(f"Failed to get data from Traefik API. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    return {}

def get_remote_entrypoints():
    if config.REMOTE_TRAEFIK_URL == "":
        print("No remote Traefik URL configured.")
        return []
    try:
        # Send GET request to Traefik API
        response = requests.get(config.REMOTE_TRAEFIK_URL+"api/entrypoints")

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            if data:
                return [entrypoint.get('name', "unnamed") for entrypoint in data]
            else:
                print("No Entry Points found.")
                return []
        else:
            print(f"Failed to get data from Traefik API. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    return {}