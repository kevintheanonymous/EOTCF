# EOTC Toulouse Finance & Inventory Management System

A comprehensive, bilingual (English, French, Amharic) web application for managing finances, inventory, and user administration for the Ethiopian Orthodox Tewahedo Church of Toulouse.

## Features

- **Authentication & User Roles**: Secure email/password authentication with role-based access (Admin, Treasurer, Member, Pending)
- **Dashboard**: Financial overview with date filtering, AI insights, and export capabilities
- **Transaction Management**: Full CRUD operations with AI-powered "Magic Fill" for parsing unstructured text
- **Inventory Management**: Track religious items, books, clothing with stock management
- **User Administration**: Admin panel for approving pending users and managing roles
- **Multi-language Support**: Complete translations in English, French, and Amharic
- **Export Features**: Excel export (with BOM for Amharic) and PDF/Print functionality

## Tech Stack

- React 18 with Hooks
- Vite for build tooling
- Firebase (Authentication & Firestore)
- Google Gemini API (Flash model) for AI features
- Tailwind CSS for styling
- React Router for navigation
- date-fns for date handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Update `src/config/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 3. Configure Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'treasurer');
    }
    
    // Inventory collection
    match /inventory/{itemId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'treasurer');
    }
  }
}
```

### 4. Configure Gemini API

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `src/config/gemini.js` with your API key:

```javascript
const API_KEY = 'YOUR_GEMINI_API_KEY'
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Admin Initialization

The system automatically initializes the user `eotctoulouse@gmail.com` as an Admin when they first log in. This ensures the owner is never locked out.

## User Roles

- **Admin**: Full access to all features including user management
- **Treasurer**: Can manage transactions and inventory
- **Member**: Read-only access to dashboard and inventory
- **Pending**: No access until approved by an Admin

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Design System

- **Primary Color**: Deep Gold (#B45309)
- **Secondary Colors**: Liturgical Red (#B91C1C), Emerald Green (#15803D)
- **Background**: Warm Parchment (#FAFAF9)
- **Text**: Dark Brown (#292524)
- **Fonts**: Inter (UI), Playfair Display & Noto Serif Ethiopic (Headers/Amharic)

## Notes

- Excel exports include BOM (Byte Order Mark) for proper Amharic character rendering
- Print functionality hides navigation and buttons for clean reports
- All dates are stored in Firestore as Timestamp objects
- The AI Magic Fill feature uses Gemini to parse unstructured transaction text

## License

This project is proprietary software for EOTC Toulouse.

