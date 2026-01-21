#!/bin/bash

echo "🚀 Building Angular app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Deploying to Cloudflare Pages..."
    
    npx wrangler pages deploy dist/mb-frontend/browser \
        --project-name=meribas-frontend \
        --branch=main
    
    echo "✅ Deployment complete!"
else
    echo "❌ Build failed!"
    exit 1
fi
