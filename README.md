# Novus Platform - Insurance Quote Management System

A comprehensive Next.js application that ports the NOVUS backend API layer into a single, cohesive platform for managing insurance quotes with Markel and C&F integrations.

## 🚀 Architecture

This project combines:
- **Frontend**: Next.js 14 with App Router, React 18, TailwindCSS
- **Backend**: Next.js API Routes 
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **External APIs**: Markel International, C&F Insurance
- **UI Components**: shadcn/ui with Radix UI primitives

## 📋 Features

### API Integration Layer
- **Token Caching**: Automatic token management for insurer APIs
- **Markel Integration**: Full submission, quote, bind, and issue workflow  
- **C&F Integration**: Complete quote lifecycle management
- **Error Handling**: Comprehensive logging and retry mechanisms

### Quote Management
- **CRUD Operations**: Complete quote lifecycle management
- **Draft Auto-save**: Real-time draft saving every 30 seconds
- **Status Tracking**: Kanban-style workflow management
- **Comparison Tool**: Side-by-side quote comparison with highlighting

### Kanban Operation Board
- **Drag & Drop**: Quote status management with `@dnd-kit`
- **Real-time Updates**: Live status updates via Supabase realtime
- **Compare Modal**: Highlights lowest 3 premiums (or 1 if <5 quotes)
- **API Integration**: Direct submission to insurers from the board

## 🛠️ Setup Instructions

### 1. Environment Setup

Copy the environment variables from `ENV_SETUP.md` into `.env.local`:

```bash
cp ENV_SETUP.md .env.local
# Edit .env.local with your actual API credentials
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Database Setup

Run the Supabase migration to create the required tables:

```bash
# Using Supabase CLI
supabase db push

# Or run the SQL file directly in your Supabase dashboard
```

The migration creates:
- `quotes` - Main quote records
- `quote_items` - Insurer responses and premiums  
- `quote_templates` - Quote form templates
- `insurer_tokens` - Cached API tokens
- `drafts` - Auto-saved form drafts
- `api_logs` - API call logging
- `email_logs` - Email sending logs

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
novus-plataform/
├── pages/api/                 # Next.js API routes
│   ├── auth/token.ts         # Token management
│   ├── submissions/          # Quote submissions  
│   ├── quotes/               # Quote CRUD operations
│   ├── bind.ts              # Policy binding
│   ├── issue.ts             # Policy issuance
│   └── drafts.ts            # Draft management
├── services/insurers/        # Business logic
│   ├── markel.ts            # Markel API integration
│   └── cf.ts                # C&F API integration
├── lib/                     # Utilities
│   └── supabase.ts          # Database client
├── types/                   # TypeScript definitions
│   └── quotes.d.ts          # Quote and API types
├── supabase/migrations/     # Database migrations
└── src/                     # Frontend components
    ├── components/          # UI components
    └── pages/               # Page components
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/token` - Get/refresh insurer API tokens

### Quote Management  
- `GET /api/quotes` - List quotes with filters
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/[id]` - Get specific quote
- `PUT /api/quotes/[id]` - Update quote
- `DELETE /api/quotes/[id]` - Delete quote

### Insurer Operations
- `POST /api/submissions` - Submit quote to insurer
- `GET /api/submissions/[id]/quote` - Get quote letter/PDF
- `POST /api/quotes/compare` - Compare multiple quotes
- `POST /api/bind` - Bind approved quote
- `POST /api/issue` - Issue policy

### Draft Management
- `GET /api/drafts` - Get user drafts
- `POST /api/drafts` - Save draft
- `PUT /api/drafts?id=[id]` - Update draft
- `DELETE /api/drafts?id=[id]` - Delete draft

## 🎯 Usage Examples

### Create and Submit Quote

```javascript
// 1. Create quote
const quote = await fetch('/api/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: 'ABC Construction',
    email: 'contact@abc.com',
    policy_type: 'responsabilidade_civil',
    // ... other fields
  })
})

// 2. Submit to Markel
const submission = await fetch('/api/submissions', {
  method: 'POST',
  body: JSON.stringify({
    quote_id: quote.id,
    channel: 'markel'
  })
})

// 3. Compare quotes
const comparison = await fetch('/api/quotes/compare', {
  method: 'POST',
  body: JSON.stringify({
    quote_ids: [quote1.id, quote2.id, quote3.id]
  })
})
```

### Auto-save Drafts

```javascript
// Save draft every 30 seconds
useInterval(() => {
  fetch('/api/drafts', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
}, 30000)
```

## 🔧 Configuration

### Insurer API Setup

1. **Markel Configuration**:
   - Get API credentials from Markel developer portal
   - Configure sandbox/production URLs
   - Set up proper authentication flow

2. **C&F Configuration**:
   - Obtain service credentials
   - Configure agency reference ID
   - Test with UAT environment first

### Supabase Setup

1. Create new Supabase project
2. Run the migration from `supabase/migrations/`
3. Configure Row Level Security policies as needed
4. Set up authentication if required

## 🚦 Testing

The application includes comprehensive error handling and logging:

- **API Logs**: All API calls are logged to `api_logs` table
- **Error Tracking**: Detailed error messages with stack traces
- **Token Management**: Automatic token refresh and caching
- **Validation**: Request/response validation with clear error messages

## 📈 Production Deployment

1. **Environment Variables**: Set all required ENV vars
2. **Database**: Run migrations on production Supabase
3. **API Limits**: Configure rate limiting for insurer APIs
4. **Monitoring**: Set up logging and alerting
5. **SSL/Security**: Ensure HTTPS and secure headers

## 🤝 Contributing

This codebase follows the existing NOVUS architecture patterns:
- TypeScript for type safety
- Comprehensive error handling
- Structured logging
- RESTful API design
- Component-based UI architecture

## 📄 License

Internal use only - Novus Underwriters

---

**Note**: This project successfully ports the entire NOVUS backend API layer into a single Next.js application, providing a cohesive platform for insurance quote management with full Markel and C&F integration capabilities. 