# My Claim Buddy (MCB) Frontend

A modern React application for the My Claim Buddy platform, which enables users to manage their car finance claims without solicitors, significantly reducing legal fees.

## Overview

The MCB platform provides a guided process for users to:
- Submit car finance claims
- Track lender responses
- Handle refunds efficiently

## Features

- **Landing Page**: Introduces the platform and its benefits
- **Authentication System**: Full login and 6-step signup flow
- **Dashboard**: Overview of claim statistics and active claims
- **Claims Management**: List and filter all claims
- **Claim Details**: Comprehensive view of individual claims with timeline, correspondence, and document management
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Technology Stack

- **React**: Frontend library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Navigation and routing
- **Chakra UI**: Component library for styling
- **LocalStorage**: For demo data persistence

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # Generic UI components
├── layouts/             # Page layout components
├── pages/               # Application pages
│   ├── auth/            # Authentication pages
│   │   └── signup/      # Multi-step signup flow
│   └── claims/          # Claims management pages
└── router.tsx           # Application routing configuration
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## User Flow

1. User visits the landing page and learns about the platform
2. User signs up through the 6-step process:
   - Basic information
   - Password creation
   - Contact information
   - Finance agreement details
   - Document upload
   - Review and submit
3. After signup/login, user lands on the dashboard
4. User can create new claims or manage existing ones
5. User can track the progress of each claim and communicate with lenders

## Future Enhancements

- Backend integration with proper API calls
- Document upload to a secure storage
- Email notifications for claim updates
- User profile management
- Admin portal for claim management
