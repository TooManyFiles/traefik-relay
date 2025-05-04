import requests
import json
from flask import Flask, Response, redirect
import yaml
import get
import config
import utils

import webui.uiMain as webui
# Create a Flask application
app = Flask(__name__)


def buildYML(routers):
    services = {
        config.NODE_NAME+"-relay": {
            "loadBalancer": {
                "servers": [
                    {
                        "url": config.NODE_ADDRESS
                    }
                ]
            }
        }
    }

    data = {
        'name': 'Traefik',
        'version': '2.0',
        'routers': {
            'http': routers
        },
        'services': services
    }
    yaml_content = yaml.dump(data, default_flow_style=False)
    return yaml_content

# Route to serve YAML content


@app.route('/traefik/dynamic.yml', methods=['GET'])
def serve_yaml():
    routers = {}
    data = get.get_http_routers()
    for router_name, router_info in data.items():
        router_name, router_src = router_name.split('@')
        if router_src == "docker":
            entrypoints, deny = utils.entryPointsTranslation(router_info.get('entryPoints', []))
            if deny:
                continue
            data = {
                "rule": router_info.get('rule', ''),
                "service": config.NODE_NAME+"-relay",
                "entryPoints": entrypoints,
            }
            routers[router_name] = data

    # Return YAML content as a response with 'application/x-yaml' MIME type
    return Response(buildYML(routers) , mimetype='application/x-yaml')




def shouldRelay(router_name):
    return globals.router_matcher(router_name)
# Redirect from / to /webui
@app.route('/')
def redirect_to_webui():
    return redirect('/webui', code=302)
# Run the Flask application
if __name__ == '__main__':
    webui.register_blueprint(app)
    app.run(debug=True, host='0.0.0.0', port=5000)
