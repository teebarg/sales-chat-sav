# AI Sales Representative Application

An intelligent web-based assistant that qualifies leads through natural conversation, evaluates their potential, and schedules demos for promising prospects.

## Features

- Natural conversation interface for lead qualification
- Intelligent lead scoring and classification
- MongoDB integration for conversation storage
- Modern React frontend with Material UI
- TypeScript backend with Node.js
- Admin dashboard for lead management
- Real-time chat history viewing
- Docker containerization for easy deployment

## Tech Stack

- Frontend: React + Material UI + TypeScript
- Backend: Node.js + TypeScript + Express
- Database: MongoDB
- AI: Rule-based scoring system (with optional LLM integration)
- Deployment: Docker + Docker Compose
- Web Server: Nginx

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
- Docker and Docker Compose (for containerized deployment)

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/teebarg/sales-chat-sav
   cd al-sales-app
   ```

2. Install dependencies:

   ```bash
   make install
   ```

3. Start development servers:

   ```bash
   make dev
   ```

### Environment Configuration

#### Backend (.env)

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 8000)
- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI conversations)

#### Frontend (.env)

- `REACT_APP_API_URL`: Backend API URL (default: <http://localhost:8000/api>)

## Docker Configuration

The application is containerized using Docker with the following services:

### Run on docker

```bash
make docker-build
make docker-up
```

### Stop docker

```bash
make docker-down
```

### Logs

```bash
make docker-logs
```

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

## AI Integration

The application uses Google's Gemini AI for natural conversation processing. If the Gemini API is unavailable or encounters an error, the system will fall back to the rule-based scoring system.

### Gemini AI Features

- Natural language understanding
- Context-aware responses
- Lead qualification through conversation
- Fallback to rule-based system if API fails

### Rule-based Fallback System

When Gemini API is unavailable, the system automatically switches to the rule-based scoring system described below.

## License

MIT
