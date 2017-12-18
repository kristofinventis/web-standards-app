#!/bin/bash

# Check for yarn
if [[ "$(which yarn)" == '' ]]; then
    echo "yarn must be installed."
    exit 0
fi

# Check for composer
if [[ "$(which composer)" == '' ]]; then
    echo "Composer must be installed."
    exit 0
fi

# Check for gulp
if [[ "$(which gulp)" == '' ]]; then
    echo "Gulp must be installed."
    exit 0
fi

# yarn
yarn install

# Composer
composer install

# Gulp
gulp build --theme styleguide
gulp build


if [[ "$(which osascript)" != '' ]]; then
    osascript -e 'tell application "Terminal"
        # Activate it.
        activate

        # Do command 1.
        set firstCommand to "gulp browsersync"
        do script firstCommand in window 0

        # Open a new tab.
        tell application "System Events" to tell process "Terminal" to keystroke "t" using command down

        # Do command 2.
        set secondCommand to "cd web && PHP -S 127.0.0.1:8000"
        do script secondCommand in window 1
    end tell'
fi
