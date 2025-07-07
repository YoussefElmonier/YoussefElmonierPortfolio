#!/bin/bash

# Media Optimization Script for YoussefElmonierPortfolio
# This script optimizes videos and images for better performance

echo "🚀 Starting media optimization..."

# Create optimized directories
mkdir -p images/optimized
mkdir -p videos/optimized

# Function to check if ffmpeg is available
check_ffmpeg() {
    if ! command -v ffmpeg &> /dev/null; then
        echo "❌ ffmpeg not found. Please install it first:"
        echo "   brew install ffmpeg"
        exit 1
    fi
}

# Function to optimize videos
optimize_video() {
    local input="$1"
    local output="$2"
    local quality="$3"
    
    echo "📹 Optimizing video: $input"
    
    # Convert to MP4 with H.264 codec (max compatibility)
    ffmpeg -i "$input" \
        -c:v libx264 \
        -preset medium \
        -crf $quality \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y "$output"
    
    # Also create WebM version for modern browsers
    local webm_output="${output%.mp4}.webm"
    ffmpeg -i "$input" \
        -c:v libvpx-vp9 \
        -crf $quality \
        -b:v 0 \
        -c:a libopus \
        -b:a 128k \
        -y "$webm_output"
}

# Function to optimize images
optimize_image() {
    local input="$1"
    local output="$2"
    
    echo "🖼️  Optimizing image: $input"
    
    # Use sips for basic optimization (built into macOS)
    sips -Z 1200 "$input" --out "$output"
    
    # If you have ImageOptim or similar tools, you can add them here
    # For now, we'll use basic compression
}

# Check dependencies
check_ffmpeg

echo "📹 Optimizing videos..."

# Optimize main videos (higher quality for background/hero)
optimize_video "manga2.mp4" "videos/optimized/manga2.mp4" 23
optimize_video "manga222.mp4" "videos/optimized/manga222.mp4" 23
optimize_video "RECAP24.gif" "videos/optimized/RECAP24.mp4" 25

# Optimize About Me videos (lower quality for faster loading)
optimize_video "images/vid1.MP4" "videos/optimized/vid1.mp4" 28
optimize_video "images/vid2.MP4" "videos/optimized/vid2.mp4" 28
optimize_video "images/proj.mp4" "videos/optimized/proj.mp4" 28

echo "🖼️  Optimizing images..."

# Optimize large images
optimize_image "images/habeby.png" "images/optimized/habeby.jpg"
optimize_image "images/uzi.png" "images/optimized/uzi.jpg"
optimize_image "images/me1.jpg" "images/optimized/me1.jpg"
optimize_image "images/me2.JPG" "images/optimized/me2.jpg"
optimize_image "images/donia.png" "images/optimized/donia.jpg"
optimize_image "images/diana.png" "images/optimized/diana.jpg"

echo "📊 Creating file size report..."

# Generate size comparison report
echo "=== FILE SIZE COMPARISON ===" > optimization_report.txt
echo "Original vs Optimized:" >> optimization_report.txt
echo "" >> optimization_report.txt

# Video sizes
echo "VIDEOS:" >> optimization_report.txt
for file in manga2.mp4 manga222.mp4 images/vid1.MP4 images/vid2.MP4 images/proj.mp4; do
    if [ -f "$file" ]; then
        original_size=$(du -h "$file" | cut -f1)
        optimized_file="videos/optimized/$(basename "$file" | sed 's/\.MP4$/.mp4/')"
        if [ -f "$optimized_file" ]; then
            optimized_size=$(du -h "$optimized_file" | cut -f1)
            echo "$file: $original_size → $optimized_size" >> optimization_report.txt
        fi
    fi
done

echo "" >> optimization_report.txt
echo "IMAGES:" >> optimization_report.txt
for file in images/habeby.png images/uzi.png images/me1.jpg images/me2.JPG images/donia.png images/diana.png; do
    if [ -f "$file" ]; then
        original_size=$(du -h "$file" | cut -f1)
        optimized_file="images/optimized/$(basename "$file" | sed 's/\.JPG$/.jpg/')"
        if [ -f "$optimized_file" ]; then
            optimized_size=$(du -h "$optimized_file" | cut -f1)
            echo "$file: $original_size → $optimized_size" >> optimization_report.txt
        fi
    fi
done

echo "✅ Optimization complete!"
echo "📄 Check optimization_report.txt for size comparisons"
echo ""
echo "🔧 Next steps:"
echo "1. Replace original files with optimized versions"
echo "2. Update HTML to use .webm fallbacks"
echo "3. Test in Chrome, Brave, Safari, Firefox"
echo ""
echo "💡 Tips:"
echo "- Keep original files as backup"
echo "- Test video playback on different devices"
echo "- Consider using a CDN for faster delivery" 