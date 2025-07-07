#!/bin/bash

echo "🎬 Optimizing videos for faster loading..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Create optimized directory
mkdir -p images/optimized

# Optimize vid1.MP4 (intro video)
echo "📹 Optimizing vid1.MP4..."
ffmpeg -i images/vid1.MP4 \
    -c:v libx264 \
    -crf 28 \
    -preset fast \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -vf "scale=1280:720" \
    images/optimized/vid1_optimized.mp4 \
    -y

# Optimize vid2.MP4 (background video)
echo "📹 Optimizing vid2.MP4..."
ffmpeg -i images/vid2.MP4 \
    -c:v libx264 \
    -crf 28 \
    -preset fast \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -vf "scale=1280:720" \
    images/optimized/vid2_optimized.mp4 \
    -y

# Create WebM versions for better compression
echo "📹 Creating WebM versions..."
ffmpeg -i images/vid1.MP4 \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -vf "scale=1280:720" \
    images/optimized/vid1_optimized.webm \
    -y

ffmpeg -i images/vid2.MP4 \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -vf "scale=1280:720" \
    images/optimized/vid2_optimized.webm \
    -y

echo "✅ Video optimization complete!"
echo ""
echo "📊 File size comparison:"
echo "Original vid1.MP4: $(du -h images/vid1.MP4 | cut -f1)"
echo "Optimized vid1: $(du -h images/optimized/vid1_optimized.mp4 | cut -f1)"
echo "Original vid2.MP4: $(du -h images/vid2.MP4 | cut -f1)"
echo "Optimized vid2: $(du -h images/optimized/vid2_optimized.mp4 | cut -f1)"
echo ""
echo "💡 To use optimized videos, update your HTML to reference:"
echo "   images/optimized/vid1_optimized.mp4"
echo "   images/optimized/vid2_optimized.mp4" 