# Node.js + Express Backend

## Installation and Setup

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed.
- Install dependencies using npm:
  ```sh
  npm install
  ```

### Running the Application
- Start the development server:
  ```sh
  node index.js (nodemon index.js if you have nodemon installed)
  ```

## Environment Variables
For local development, create a `.env` file and define the following variables:
```env
MONGODB_URI='YOUR_MONGODB_URI'
GOOGLE_GEMINI_API_KEY='YOUR_GOOGLE_GEMINI_API_KEY'
GITHUB_CLIENT_SECRET='YOUR_GITHUB_CLIENT_SECRET'
GITHUB_CLIENT_ID='YOUR_GITHUB_CLIENT_ID'
```
> **Note:** These variables are essential for authentication and database connectivity.

## Technical Decisions

### Development Stack
- **Node.js & Express**: Chosen for their popularity and efficiency in building scalable backend applications.
- **Mongoose**: Used for quick prototyping, especially when dealing with unstructured or uncertain data schemas.
- **JavaScript**: Preferred over TypeScript in the backend for faster prototyping.

### Design Choices
- **RESTful API Design**: Ensures better readability and maintainability of endpoints.
- **Middleware Usage**: Middleware is heavily utilized to chain functions, improve manageability, and enhance reusability.

