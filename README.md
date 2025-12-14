# Chat with PDFs

An AI-powered application that allows users to upload PDF documents and engage in conversational chat about their content using advanced natural language processing and vector embeddings.

## Features

- **PDF Upload & Processing**: Upload PDF files that are automatically processed into searchable vector embeddings
- **AI-Powered Chat**: Ask questions about your PDF content and receive contextual answers
- **Vector Search**: Utilizes Qdrant vector database for efficient similarity search
- **Offline Embeddings**: Uses local transformer models for privacy and cost efficiency
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Authentication**: Secure user authentication with Clerk
- **Queue-Based Processing**: Asynchronous PDF processing using Redis/BullMQ
- **RESTful API**: Well-documented API endpoints for integration

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **BullMQ** - Redis-based job queue
- **Qdrant** - Vector database for embeddings
- **Xenova Transformers** - Local embedding generation
- **Groq API** - LLM for chat responses
- **Multer** - File upload handling

### Infrastructure
- **Docker Compose** - Container orchestration
- **Valkey** - Redis-compatible data store
- **Qdrant** - Vector similarity search engine

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-with-pdfs
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

## Environment Setup

1. **Create environment files**

   Create `.env` file in the `server/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   QDRANT_URL=http://localhost:6333
   QDRANT_COLLECTION=pdf_chunks
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
   
   Create `.env` file in the `client/` directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

2. **Get API Keys**
   - **Groq API Key**: Sign up at [groq.com](https://groq.com) and get your API key
   - **Clerk Keys**: Set up a Clerk application and add the keys to your frontend environment

## Running the Application

1. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

3. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## API Endpoints

### GET /
Returns server status
```json
{
  "status": "OK",
  "message": "PDF Chat API running"
}
```

### POST /upload/pdf
Upload a PDF file for processing
- **Content-Type**: multipart/form-data
- **Body**: pdf file

**Response:**
```json
{
  "status": "queued",
  "filename": "document.pdf"
}
```

### GET /chat?message=your_question_here
Get AI response based on uploaded PDF content

**Response:**
```json
{
  "answer": "AI-generated response based on PDF context",
  "context": [...]
}
```

## Usage

1. **Upload a PDF**: Use the file upload interface to select and upload your PDF document
2. **Wait for Processing**: The system will process the PDF in the background
3. **Start Chatting**: Ask questions about the PDF content in the chat interface
4. **Get Contextual Answers**: Receive AI-powered responses based on the document's content

## Development

### Frontend Scripts
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend Scripts
```bash
cd server
npm start        # Start the server
```

### Docker Commands
```bash
docker-compose up -d          # Start services in background
docker-compose down           # Stop services
docker-compose logs           # View service logs
```

## Project Structure

```
chat-with-pdfs/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   └── components/       # React components
│   └── package.json
├── server/                    # Express.js backend
│   ├── index.js              # Main server file
│   ├── worker.js             # Background job processor
│   ├── uploads/              # Uploaded PDF storage
│   └── package.json
├── docker-compose.yml         # Infrastructure services
└── README.md                  # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq](https://groq.com) for fast LLM inference
- [Qdrant](https://qdrant.tech) for vector database
- [Xenova](https://xenova.github.io/transformers.js/) for local embeddings
- [Clerk](https://clerk.com) for authentication
