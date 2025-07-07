#!/bin/bash

# CSS Minification Script
echo "🎨 Minifying CSS files..."

# Check if cssnano is available (via npm)
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first:"
    echo "   brew install node"
    exit 1
fi

# Minify style.css
if [ -f "css/style.css" ]; then
    echo "📝 Minifying css/style.css..."
    npx cssnano css/style.css css/style.min.css
    echo "✅ Created css/style.min.css"
else
    echo "❌ css/style.css not found"
fi

# Minify cleaned.css if it exists
if [ -f "css/cleaned.css" ]; then
    echo "📝 Minifying css/cleaned.css..."
    npx cssnano css/cleaned.css css/cleaned.min.css
    echo "✅ Created css/cleaned.min.css"
fi

echo "🎉 CSS minification complete!"
echo ""
echo "💡 To use minified CSS:"
echo "1. Update your HTML files to reference .min.css files"
echo "2. Test that all styles still work correctly"
echo "3. Consider using a build process for production" 