#!/bin/bash

# Pre-commit check script for Angular project
# This script runs build to catch errors before committing

echo "🔍 Running pre-commit checks..."
echo ""

# Run Angular build
echo "📦 Building Angular project..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! Safe to commit."
    exit 0
else
    echo ""
    echo "❌ Build failed! Please fix errors before committing."
    echo ""
    echo "Common issues:"
    echo "  - Missing closing tags in HTML templates"
    echo "  - TypeScript errors"
    echo "  - Missing imports"
    echo ""
    exit 1
fi
