#!/bin/bash

# Performance Testing Script
echo "🚀 Testing website performance..."

# Check if Python is available for simple HTTP server
if command -v python3 &> /dev/null; then
    echo "🌐 Starting local server for testing..."
    echo "📱 Open http://localhost:8000 in your browsers"
    echo "🔍 Test in: Chrome, Brave, Safari, Firefox, Edge"
    echo ""
    echo "📊 Performance checklist:"
    echo "✅ Videos load and play automatically"
    echo "✅ Fonts display immediately (no FOUT)"
    echo "✅ Page loads quickly (<3 seconds)"
    echo "✅ No console errors"
    echo "✅ Responsive on mobile/tablet"
    echo ""
    echo "🛠️  Tools to use:"
    echo "- Chrome DevTools (F12)"
    echo "- Lighthouse (Audit tab)"
    echo "- PageSpeed Insights (online)"
    echo ""
    echo "⏹️  Press Ctrl+C to stop server"
    echo ""
    
    # Start Python HTTP server
    python3 -m http.server 8000
else
    echo "❌ Python3 not found. Please install it first:"
    echo "   brew install python"
    echo ""
    echo "💡 Alternative: Use any local server or upload to hosting"
fi 