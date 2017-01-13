#!/bin/bash

# Check for npm
if [[ "$(which npm)" == '' ]]; then
    echo "Npm must be installed."
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

# Npm
npm install

# Composer
composer install

# Gulp
gulp build--styleguide
gulp build
