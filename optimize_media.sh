#!/bin/bash

# This script optimizes images and videos for web performance.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
IMAGE_SOURCE_DIR="images"
IMAGE_DEST_DIR="images/optimized"
VIDEO_SOURCE_DIR="."
VIDEO_DEST_DIR="videos/optimized"

# --- Dependency Check & Installation ---
echo "Checking for dependencies..."

# Check for Node.js and npm
if ! command -v npm &> /dev/null; then
    echo "npm could not be found. Please install Node.js and npm."
    exit 1
fi

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg could not be found. Please install ffmpeg. (e.g., 'brew install ffmpeg')"
    exit 1
fi

# Install imagemin-cli and plugins if they are not already installed
if ! npm list imagemin-cli &>/dev/null || ! npm list imagemin-webp &>/dev/null; then
    echo "Installing imagemin-cli and imagemin-webp..."
    npm install imagemin-cli imagemin-webp
fi

echo "Dependencies are satisfied."

# --- Optimization ---

# Create destination directories if they don't exist
mkdir -p "$IMAGE_DEST_DIR"
mkdir -p "$VIDEO_DEST_DIR"

# Optimize Images
echo "Optimizing images and converting to WebP..."
# Use find to avoid issues with spaces in filenames and to exclude the destination directory
find "$IMAGE_SOURCE_DIR" -maxdepth 1 -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -print0 | while IFS= read -r -d $'\0' file; do
    echo "Processing image: $file"
    npx imagemin "$file" --plugin=webp --out-dir="$IMAGE_DEST_DIR"
    # Also copy and optimize the original file type
    npx imagemin "$file" --out-dir="$IMAGE_DEST_DIR"
done

# Optimize Videos
echo "Optimizing videos and converting to WebM..."

# Videos in root
find "$VIDEO_SOURCE_DIR" -maxdepth 1 -type f \( -name "*.mp4" -o -name "*.mov" \) -print0 | while IFS= read -r -d $'\0' file; do
    filename=$(basename -- "$file")
    filename_noext="${filename%.*}"
    echo "Processing video: $file"
    # Optimize MP4
    ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset veryslow "$VIDEO_DEST_DIR/$filename_noext.mp4" -y
    # Convert to WebM
    ffmpeg -i "$file" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -threads 8 "$VIDEO_DEST_DIR/$filename_noext.webm" -y
done

# Videos in images/ directory (like vid1.MP4, vid2.MP4)
find "$IMAGE_SOURCE_DIR" -maxdepth 1 -type f \( -name "*.mp4" -o -name "*.MP4" -o -name "*.mov" \) -print0 | while IFS= read -r -d $'\0' file; do
    filename=$(basename -- "$file")
    filename_noext="${filename%.*}"
    echo "Processing video from images/: $file"
    # Optimize MP4
    ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset veryslow "$VIDEO_DEST_DIR/$filename_noext.mp4" -y
    # Convert to WebM
    ffmpeg -i "$file" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -threads 8 "$VIDEO_DEST_DIR/$filename_noext.webm" -y
done

echo "\nOptimization complete!"
echo "Optimized images are in: $IMAGE_DEST_DIR"
echo "Optimized videos are in: $VIDEO_DEST_DIR"
echo "\nNext steps:"
echo "1. Update your HTML files (<img src=...>, <video source=...>) to point to the new files in the optimized directories."
echo "2. Use the <picture> element to serve WebP images with a fallback to JPG/PNG for older browsers."