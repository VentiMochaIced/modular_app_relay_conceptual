# Koralai Host Application - v0.2.0 (Hybrid)
# Project: Koralai
# Purpose: This app is now a minimal host container.
# It is designed to load a local React/Web UI (e.g., index.html)
# which will provide the full browser interface.

import sys
import json
import os
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout)
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl, Qt

# --- Configuration ---
# LOG (MIN-IMPROVEMENT): Simplified config.
# The window title and size are still relevant, but the homepage
# will be replaced by a local file path.
CONFIG = {
    "default_homepage": "https://www.google.com", # Kept as a fallback
    "window_title": "Koralai | Host v0.2",
    "initial_width": 1280,
    "initial_height": 720,
    "settings_file": "koralai_settings.json",
    
    # LOG (MAX-IMPROVEMENT): Define the entry point for the React UI.
    # This is the "mask" that hides the Python app.
    "react_entry_point": "index.html" 
}

# --- Main Application Window ---
class MainWindow(QMainWindow): # LOG: Renamed to be more general
    """
    The main host window.
    LOG (MAX-IMPROVEMENT): This window no longer contains toolbars or tabs.
    It is now just a simple container for a single QWebEngineView,
    which will render the React-based UI.
    """

    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        self.setWindowTitle(CONFIG["window_title"])
        self.setGeometry(100, 100, CONFIG["initial_width"], CONFIG["initial_height"])

        # Load user profile/settings
        self.settings = self.load_settings()
        self.homepage = self.settings.get("homepage", CONFIG["default_homepage"])

        # --- UI Component (Simplified) ---
        
        # LOG (MAX-IMPROVEMENT): All native PyQt6 UI (tabs, toolbars, statusbar)
        # has been removed to "mask" the Python output.
        # We create one single web view.
        self.web_view = QWebEngineView()
        self.setCentralWidget(self.web_view)

        # --- Initial State ---
        # LOG (MAX-IMPROVEMENT): This is the core of the hybrid app.
        # We load the local index.html file that contains the React app.
        local_ui_path = os.path.abspath(CONFIG["react_entry_point"])
        
        if os.path.exists(local_ui_path):
            self.web_view.setUrl(QUrl.fromLocalFile(local_ui_path))
            print(f"DIAGNOSTIC: Loading local UI from: {local_ui_path}")
        else:
            # Fallback if the React app isn't built
            print(f"DIAG-ERROR: {CONFIG['react_entry_point']} not found.")
            print(f"DIAGNOSTIC: Loading fallback homepage: {self.homepage}")
            self.web_view.setUrl(QUrl(self.homepage))

        # LOG (MIN-IMPROVEMENT): Removed all complex stylesheets
        # as the styling is now 100% controlled by the React app.
        self.setStyleSheet("background-color: #222;")


    # LOG (MAX-IMPROVEMENT): All UI functions have been removed:
    # - setup_toolbar()
    # - add_new_tab()
    # - close_tab()
    # - navigate_home()
    # - navigate_to_url()
    # - update_url_bar()
    # - update_address_bar_on_tab_change()
    #
    # WHY: The React app (Koralai-Core.jsx) is now responsible
    # for all UI, navigation, and state management.

    # --- User Profile / Settings Management ---
    # LOG (MIN-IMPROVEMENT): This settings load is still relevant,
    # as the Python host can pass these settings *into* the React app
    # upon initialization.

    def load_settings(self):
        """
        Implements the 'root'/'user login' function by loading a settings file.
        This provides a dynamic initial compile state based on user preference.
        """
        # Diagnostic check: Does the settings file exist?
        if os.path.exists(CONFIG["settings_file"]):
            try:
                with open(CONFIG["settings_file"], 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                # Error propagation: If file is corrupt, log it and return default.
                print(f"DIAGNOSTIC: Could not parse {CONFIG['settings_file']}. Using defaults.")
                return {} # Return empty dict to use defaults
        else:
            # First time run: create default settings file
            self.save_settings({"homepage": CONFIG["default_homepage"]})
            return {"homepage": CONFIG["default_homepage"]}

    def save_settings(self, settings_dict):
        """ Saves the current settings to the JSON file. """
        try:
            with open(CONFIG["settings_file"], 'w') as f:
                json.dump(settings_dict, f, indent=4)
        except IOError as e:
            print(f"DIAG-ERROR: Could not save settings to {CONFIG['settings_file']}. Error: {e}")

# --- Application Bootstrap ---
if __name__ == '__main__':
    # Create the application instance
    app = QApplication(sys.argv)
    app.setApplicationName("KoralaiHost") # LOG: Renamed app name

    # Create and show the main window
    window = MainWindow()
    window.show()

    # LOG (MAX-IMPROVEMENT): The next step would be to implement
    # PyQtWebChannel to allow the React UI (JavaScript) to
    # communicate back to this Python file (e.g., to request a new
    # native tab, or to ask Python to save a file).

    # Start the event loop
    sys.exit(app.exec())

