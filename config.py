import os
import yaml
from dotenv import load_dotenv
# Default configuration
default_config = {
    "entrypoint_mapping": {},
    "allowed_router_names": [],
    "allowed_router_names_exclude": []
}

# Load environment variables from .env file
load_dotenv()

# Traefik Configuration (from environment variables)
TRAEFIK_URL = os.getenv('TRAEFIK_URL', 'http://localhost:8080/')
NODE_NAME = os.getenv('NODE_NAME', 'default_node')
NODE_ADDRESS = os.getenv('NODE_ADDRESS', 'localhost')
REMOTE_TRAEFIK_URL = os.getenv('REMOTE_TRAEFIK_URL', '')

# Load additional configuration from config.yml
CONFIG_FILE = "/app/config/config.yml"
# Load or create config.yml
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, "r") as file:
        config_data = yaml.safe_load(file)
else:
    print(f"{CONFIG_FILE} not found. Creating default configuration.")
    config_data = default_config
    with open(CONFIG_FILE, "w") as file:
        yaml.safe_dump(config_data, file)

# Entrypoint Mapping
ENTRYPOINT_MAPPING = config_data.get("entrypoint_mapping", {})

# Allowed Router Names
allowed_router_names = config_data.get("allowed_router_names", [])
allowed_router_names_exclude = config_data.get("allowed_router_names_exclude", [])


def save_config():
    """
    Save the current runtime-modifiable configurations to config.yml.
    """
    config_data["entrypoint_mapping"] = ENTRYPOINT_MAPPING
    config_data["allowed_router_names"] = allowed_router_names
    config_data["allowed_router_names_exclude"] = allowed_router_names_exclude

    with open(CONFIG_FILE, "w") as file:
        yaml.safe_dump(config_data, file, default_flow_style=False)

    print(f"Configuration saved to {CONFIG_FILE}")