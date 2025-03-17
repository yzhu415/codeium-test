#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p images

# Download the images
curl -s "https://storage.googleapis.com/codeium-public/cascade/images/1716009000_0.jpg" -o "images/hillsborough-classic.jpg"
curl -s "https://storage.googleapis.com/codeium-public/cascade/images/1716009000_1.jpg" -o "images/palo-alto-midcentury.jpg"
curl -s "https://storage.googleapis.com/codeium-public/cascade/images/1716009000_2.jpg" -o "images/city-modern.jpg"

echo "Images downloaded successfully to the images directory."
