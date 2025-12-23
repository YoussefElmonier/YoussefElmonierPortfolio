#!/bin/bash

# Minify the main stylesheet
cleancss -o css/cleaned.css css/style.css

echo "CSS minified successfully!"