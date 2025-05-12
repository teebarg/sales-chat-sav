# AI Sales Representative Application

An intelligent web-based assistant that qualifies leads through natural conversation, evaluates their potential, and schedules demos for promising prospects.

## Features

- Natural conversation interface for lead qualification
- Intelligent lead scoring and classification
- Automatic demo scheduling for qualified leads
- MongoDB integration for conversation storage
- Modern React frontend with Material UI
- TypeScript backend with Node.js
- Admin dashboard for lead management
- Real-time chat history viewing

## Tech Stack

- Frontend: React + Material UI + TypeScript
- Backend: Node.js + TypeScript + Express
- Database: MongoDB
- AI: Rule-based scoring system (with optional LLM integration)
- Deployment: Vercel (Frontend) + Render (Backend)

## Architecture

### Frontend Architecture

- React with TypeScript for type safety
- Material UI for consistent, responsive design
- React Router for navigation
- Axios for API communication
- Component-based architecture:
  - LeadForm: Initial lead capture
  - Chat: Conversation interface
  - AdminView: Lead management dashboard
  - Message: Individual chat messages

### Backend Architecture

- Express.js with TypeScript
- MongoDB with Mongoose ODM
- RESTful API design
- Modular structure:
  - Controllers: Request handling
  - Services: Business logic
  - Models: Database schemas
  - Routes: API endpoints

### Data Flow

1. User enters email in LeadForm
2. Chat interface loads with conversation history
3. Messages are processed by backend
4. Lead scoring occurs in real-time
5. Admin dashboard shows all leads and their status

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/teebarg/sales-chat-sav
   cd al-sales-app
   ```

2. Backend Setup:

   ```bash
   cd server
   npm install
   # Create .env file
   echo "MONGODB_URI=your_mongodb_connection_string
   PORT=8000" > .env
   npm run dev
   ```

3. Frontend Setup:

   ```bash
   cd frontend
   npm install
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
   npm start
   ```

## Deployment

### Backend Deployment (Render)

1. Create a Render account
2. Create a new Web Service
3. Connect your Git repository
4. Configure the service:
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: 8000

### Frontend Deployment (Vercel)

1. Create a Vercel account
2. Import your Git repository
3. Configure the project:
   - Framework Preset: Create React App
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Environment Variables:
     - `REACT_APP_API_URL`: Your deployed backend URL

### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access:
   - Create a database user
   - Set up IP whitelist
4. Get your connection string
5. Add the connection string to your backend environment variables

## Lead Classification System

### Classification Categories

1. **Not Relevant**
   - Criteria:
     - Students or no budget
     - Personal projects
     - Non-commercial use cases
   - Score: 0-25

2. **Weak Lead**
   - Criteria:
     - Side projects
     - Uncertain budget
     - Small teams (< 10 people)
   - Score: 26-50

3. **Hot Lead**
   - Criteria:
     - Companies actively scaling
     - Hiring developers
     - Clear budget allocation
     - Medium-sized teams (10-100 people)
   - Score: 51-75

4. **Very Big Potential Customer**
   - Criteria:
     - Large companies (1000+ employees)
     - Enterprise-level requirements
     - Clear budget and timeline
     - Multiple departments involved
   - Score: 76-100

### Scoring Factors

1. **Company Size**
   - 1-10 employees: +10 points
   - 11-100 employees: +20 points
   - 101-1000 employees: +30 points
   - 1000+ employees: +40 points

2. **Budget**
   - No budget: +0 points
   - Small budget (< $10k): +10 points
   - Medium budget ($10k-$50k): +20 points
   - Large budget (> $50k): +30 points

3. **Timeline**
   - No timeline: +0 points
   - Long-term (> 6 months): +10 points
   - Medium-term (3-6 months): +15 points
   - Short-term (< 3 months): +20 points

4. **Project Scope**
   - Personal project: +0 points
   - Small project: +10 points
   - Department-wide: +20 points
   - Company-wide: +30 points

## API Documentation

### Endpoints

- `POST /api/chat`
  - Send a message and get AI response
  - Body: `{ email: string, message: string }`
  - Response: `{ response: string, relevanceTag: string }`

- `GET /api/leads`
  - Get all leads (admin only)
  - Response: Array of lead objects

- `GET /api/leads/:email`
  - Get specific lead details
  - Response: Lead object with chat history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
