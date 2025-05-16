# Quick Query Resolver

A modern, efficient query management system built with React, TypeScript, and Node.js.

## Features

- **Fast and Responsive**: Built with performance in mind
- **Modern UI**: Clean and intuitive user interface
- **Secure**: JWT authentication and role-based access control
- **Fully Responsive**: Works on all device sizes
- **Analytics**: Track query metrics and response times
- **Rich Text Support**: Format your queries with markdown

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS with custom theming
- **Build Tool**: Vite
- **Linting/Formatting**: ESLint, Prettier
- **Version Control**: Git

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (for local development)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quick-query-resolver.git
   cd quick-query-resolver
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/quick-query
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   REACT_APP_API_URL=http://localhost:5000/api
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   # Navigate to the server directory
   cd server
   
   # Install server dependencies
   npm install
   
   # Start the server
   npm run dev
   ```
   
   The backend API server will start running on http://localhost:5000.

5. **Start the frontend development server**
   ```bash
   # Open a new terminal window and navigate to the project root
   
   # Start the React development server
   npm start
   ```
   
   The frontend application will open in your browser at http://localhost:3000.

6. **Access the application**
   Your application should now be running with the frontend at `http://localhost:3000` and the backend API at `http://localhost:5000/api`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run build:analyze` - Analyze bundle size

## Project Structure

```
src/
  ├── components/
  │   ├── Login.tsx
  │   └── QueryForm.tsx
  ├── context/
  │   └── AuthContext.tsx
  ├── App.tsx
  ├── index.tsx
  └── index.css
```

## Development

The application uses:
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Context API for state management

## License

MIT 