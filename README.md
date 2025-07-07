# AI Lead Builder

A web-based outreach workflow tool that helps users generate and manage personalized LinkedIn messages using AI.

## 🚀 Features

- **Lead Management**
  - Add and manage leads with name, role, and company details
  - Generate personalized LinkedIn messages using OpenAI
  - Track lead status (Draft / Approved / Sent)
  - View leads in both table and board layouts
  - Export leads to CSV

- **User Experience**
  - Intuitive UI built with shadcn/ui and Tailwind CSS
  - Drag-and-drop interface for managing lead status
  - Responsive design for all device sizes

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API (GPT-3.5/4)
- **Deployment**: Vercel

## 🏗 Development Documentation

### 1. Ideation

#### What is the user goal?
The primary goal is to create an efficient system for generating and managing personalized outreach messages for sales and recruitment professionals. The system should streamline the process of reaching out to potential leads by automating message generation while maintaining a personal touch.

#### What pain point are you solving?
1. **Time Consumption**: Manual composition of personalized messages is time-intensive.
2. **Inconsistency**: Maintaining consistent quality and tone across multiple messages is challenging.
3. **Tracking Difficulty**: Managing outreach status across multiple leads can become disorganized.
4. **Scalability**: Manual processes don't scale well with increasing lead volume.

### 2. Planning

#### User Flow
1. **Lead Entry**: User inputs lead details (name, role, company, LinkedIn URL)
2. **Message Generation**: System generates a personalized message using AI
3. **Review & Edit**: User reviews and can modify the generated message
4. **Status Management**: User updates lead status (Draft → Approved → Sent)
5. **Dashboard**: User can view, filter, and manage all leads

#### Features
**MVP (Minimum Viable Product):**
- Lead input form with validation
- AI-powered message generation
- Basic lead management (CRUD operations)
- Table view of all leads
- Status tracking (Draft/Approved/Sent)

**Bonus Features:**
- Board view (Trello-style)
- CSV export functionality

#### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API (GPT-3.5/4)
- **Deployment**: Vercel

### 3. Final Scope

#### Chosen Implementation
- Implemented all MVP features
- Added Board view as a bonus feature
- Included CSV export functionality
- Implemented responsive design for all screen sizes

#### Tradeoffs & Constraints
1. **Performance**: Chose client-side state management for better UX, with optimistic updates
2. **Scalability**: Designed for moderate user load; may need optimization for very large datasets
3. **AI Integration**: Limited to OpenAI's API capabilities and rate limits
4. **Browser Compatibility**: Focused on modern browsers with full ES6+ support

#### Assumptions
1. Users have basic familiarity with LinkedIn outreach
2. Internet connectivity is stable for API calls
3. Users will primarily access from desktop devices
4. The application will be used by individual professionals or small teams

### 4. Architecture Review

#### Data Storage
- **Primary Database**: Supabase (PostgreSQL)
  - `leads` table with all lead information
  - Row-level security for data protection
  - Real-time subscriptions for live updates

#### Key Components
1. **Frontend Components**
   - `LeadForm`: Handles lead creation and editing
   - `LeadsTable`: Displays leads in a sortable, filterable table
   - `LeadsBoard`: Trello-style board view with drag-and-drop
   - `MessageGenerator`: AI-powered message generation interface

2. **Backend Services**
   - API Routes for all CRUD operations
   - OpenAI integration service
   - Data validation and sanitization

3. **State Management**
   - React Context for global state
   - Optimistic UI updates
   - Loading and error states

#### API Request Handling
1. **Client-Side**
   - Requests made via `fetch` or `axios`
   - Error handling and retry logic

2. **Server-Side**
   - API routes handle request validation
   - Rate limiting for sensitive endpoints
   - Error responses with appropriate status codes

3. **External Services**
   - OpenAI API for message generation
   - Supabase for database
   - Vercel for deployment and serverless functions

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```bash
   pnpm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Online Demo

You can try out the demo [here](https://ai-lead-builder.vercel.app/).
