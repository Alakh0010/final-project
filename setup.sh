#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Set up environment variables
echo "Setting up environment variables..."
cat > .env << 'EOL'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quick-query
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
EOL

echo "Setup complete!"
echo "Run 'npm start' to start the development server."
