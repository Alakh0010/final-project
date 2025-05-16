# Create backup of the current project
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force

# Copy all files to backup directory
Copy-Item -Path "*" -Destination $backupDir -Recurse -Force

# Create a new React app with TypeScript
npx create-react-app temp-app --template typescript

# Change to the new app directory
Set-Location temp-app

# Install additional dependencies
npm install @heroicons/react @react-spring/web axios bcryptjs dotenv framer-motion mongoose react-icons react-router-dom

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

# Start the development server
npm start
