# AI Sales Representative Application

An intelligent web-based assistant that qualifies leads through natural conversation, evaluates their potential, and schedules demos for promising prospects.

## Features

- Natural conversation interface for lead qualification
- Intelligent lead scoring and classification
- Automatic demo scheduling for qualified leads
- MongoDB integration for conversation storage
- Modern React frontend with Material UI
- TypeScript backend with Node.js

## Tech Stack

- Frontend: React + Material UI
- Backend: Node.js + TypeScript + Express
- Database: MongoDB
- AI: Rule-based scoring system (with optional LLM integration)

## Project Structure

```
al-sales-app/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Environment Configuration

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 8000)

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Lead Classification Logic

The application uses a rule-based system to classify leads into four categories:

1. Not relevant
   - Students or no budget
   - Personal projects
   - Non-commercial use cases

2. Weak lead
   - Side projects
   - Uncertain budget
   - Small teams

3. Hot lead
   - Companies actively scaling
   - Hiring developers
   - Clear budget allocation

4. Very big potential customer
   - Large companies (1000+ employees)
   - Enterprise-level requirements
   - Clear budget and timeline

## API Documentation

### Endpoints

- `POST /api/chat` - Send a message and get AI response
- `GET /api/leads` - Get all leads (admin only)
- `POST /api/leads` - Create a new lead

## Development

### Running in Development Mode

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

### Building for Production

1. Build the backend:
   ```bash
   cd server
   npm run build
   ```

2. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

## Deployment

The application can be deployed using:
- Frontend: Vercel
- Backend: AWS ECS or similar
- Database: MongoDB Atlas

## License

MIT