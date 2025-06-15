import logging

router_matcher = None

# Logger konfigurieren (ggf. anpassen)
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)

logger = logging.getLogger(__name__)