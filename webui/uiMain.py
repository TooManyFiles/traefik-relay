
from flask import Blueprint, render_template, jsonify, request
import config as config
import get as get
import globals as globals
import utils
webUI_bp = Blueprint('webUI', __name__)
api_bp = Blueprint('webapi', __name__)

def register_blueprint(app):
    app.register_blueprint(webUI_bp, url_prefix='/webui')
    app.register_blueprint(api_bp, url_prefix='/api')
    

@webUI_bp.route('/')
def home():
    return render_template("index.html")

    
    
    
@api_bp.route('/routers', methods=['GET'])
def api_routers():
    output = {"relay": [],"deny": []}
    data = get.get_http_routers()
    for router_name, router_info in data.items():
        router_name, router_src = router_name.split('@')
        if router_src == "docker":
            entrypoints, deny = utils.entryPointsTranslation(router_info.get('entryPoints', []))
            if deny or not globals.router_matcher(router_name):
                output["deny"].append(router_name)
            else:
                output["relay"].append(router_name)            
    return jsonify(output)

    
@api_bp.route('/router-rules', methods=['GET'])
def api_router_rules():
    output = {"relay": config.allowed_router_names,"deny": config.allowed_router_names_exclude}
                
    return jsonify(output)


@api_bp.route('/router-rules', methods=['PUT'])
def api_router_rules_put():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    # Update the router rules in the config
    config.allowed_router_names = data.get("relay", [])
    config.allowed_router_names_exclude = data.get("deny", [])

    # Recompile the regex matcher
    globals.router_matcher = utils.compile_router_matcher()
    config.save_config()
    return jsonify({"message": "Router rules updated successfully"}), 200

@api_bp.route('/entrypointMapping', methods=['PUT'])
def api_entrypointMapping_put():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    # Update the entrypoint mapping in the config
    config.ENTRYPOINT_MAPPING = data
    config.save_config()
    return jsonify({"message": "Entry point mapping updated successfully"}), 200

@api_bp.route('/entrypointMapping', methods=['GET'])
def api_entrypointmapping():
    output = {
        "mapping": config.ENTRYPOINT_MAPPING,
              "local": get.get_entrypoints(),
              "remote": get.get_remote_entrypoints()
              }

    return jsonify(output)
