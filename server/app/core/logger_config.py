import logging
import os
from app.settings import settings

from colorlog import ColoredFormatter


def setup_logger(
    logger_name="app_logger",
    log_dir: str = "logs",
    max_bytes: int = 10485760,  # 10MB
    backup_count: int = 5,
    log_level: str = "INFO",
):
    # Create logs directory if it doesn't exist
    os.makedirs(log_dir, exist_ok=True)

    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level.upper())

    # Clear any existing handlers
    if logger.handlers:
        logger.handlers.clear()

    # Create console handler
    console_handler = logging.StreamHandler()

    # create formatter
    colored_formatter = ColoredFormatter(
        "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        reset=True,
        log_colors={
            "DEBUG": "blue",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
        secondary_log_colors={},
        style="%",
    )

    # Add formatter to ch
    console_handler.setFormatter(colored_formatter)

    # Add ch to the logger
    logger.addHandler(console_handler)

    # Set propagate to False to avoid duplicate logs
    logger.propagate = False

    return logger