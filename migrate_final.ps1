# Create a new React app with TypeScript and React 18
npx create-react-app temp-app --template typescript

# Change to the new app directory
Set-Location temp-app

# Install specific React 18 version
npm install react@18.2.0 react-dom@18.2.0

# Install additional dependencies with --legacy-peer-deps
npm install --legacy-peer-deps @heroicons/react @react-spring/web axios bcryptjs dotenv framer-motion mongoose react-icons react-router-dom

# Install dev dependencies
npm install --save-dev @types/react @types/react-dom @types/react-router-dom @types/node @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks prettier tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create necessary directories
New-Item -ItemType Directory -Path "src\components" -Force
New-Item -ItemType Directory -Path "src\config" -Force
New-Item -ItemType Directory -Path "src\context" -Force
New-Item -ItemType Directory -Path "src\data" -Force
New-Item -ItemType Directory -Path "src\db" -Force
New-Item -ItemType Directory -Path "src\hooks" -Force
New-Item -ItemType Directory -Path "src\pages" -Force
New-Item -ItemType Directory -Path "src\services" -Force
New-Item -ItemType Directory -Path "src\styles" -Force
New-Item -ItemType Directory -Path "src\types" -Force
New-Item -ItemType Directory -Path "src\utils" -Force

# Copy your source files
Copy-Item -Path "..\src\*" -Destination ".\src\" -Recurse -Force

# Copy configuration files
Copy-Item -Path "..\.env" -Destination ".\.env" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "..\.env.example" -Destination ".\.env.example" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "..\tsconfig.json" -Destination ".\tsconfig.json" -Force -ErrorAction SilentlyContinue

# Update package.json with correct scripts
$packageJsonPath = ".\package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$packageJson.scripts = @{
    "start" = "react-scripts start"
    "build" = "GENERATE_SOURCEMAP=false react-scripts build"
    "test" = "react-scripts test"
    "eject" = "react-scripts eject"
    "lint" = "eslint src --ext .ts,.tsx"
    "lint:fix" = "eslint src --ext .ts,.tsx --fix"
    "format" = "prettier --write src/**/*.{ts,tsx,css,json}"
}
$packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath -Encoding UTF8

# Start the development server
npm start
