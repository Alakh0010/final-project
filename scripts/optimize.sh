#!/bin/bash

# Clean up node_modules and cache
echo "Cleaning up..."
rm -rf node_modules/.cache
rm -rf .next
rm -rf out

# Install production dependencies only
echo "Installing production dependencies..."
npm ci --only=production

# Build the application
echo "Building the application..."
npm run build

# Analyze bundle size
echo "Analyzing bundle size..."
npm run build:analyze

echo "Optimization complete!"
