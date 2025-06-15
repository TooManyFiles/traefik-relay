import re
from typing import Callable
import config
import globals
from globals import logger

def compile_router_matcher() -> Callable[[str], bool]:
    # Strip ^ and $ to re-wrap consistently
    def merge_patterns(patterns):
        stripped = [p.strip("^$") for p in patterns]
        return re.compile(r"^(" + "|".join(stripped) + r")$") if stripped else None

    allowed_regex = merge_patterns(config.allowed_router_names)
    excluded_regex = merge_patterns(config.allowed_router_names_exclude)

    def matcher(name: str) -> bool:
        if allowed_regex and not allowed_regex.match(name):
            return False
        if excluded_regex and excluded_regex.match(name):
            return False
        return True

    return matcher

globals.router_matcher = compile_router_matcher()


def entryPointsTranslation(entryPoints):
    config.ENTRYPOINT_MAPPING 
    output  = []
    for entryPoint in entryPoints:
        if entryPoint in config.ENTRYPOINT_MAPPING:
            if entryPoint == -1:
                return [], True
            if entryPoint not in output:
                output.append(config.ENTRYPOINT_MAPPING[entryPoint])
        else:
            logger.warning(f"Entry point '{entryPoint}' not found in mapping. Will not be left out.")
    return output, False