# Project Structure

```
eotc-toulouse-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard with stats, AI advisor, ledger
│   │   ├── Inventory.jsx         # Inventory management with grid view
│   │   ├── Layout.jsx            # Main layout with sidebar navigation
│   │   ├── LanguageSelector.jsx  # Language switcher component
│   │   ├── Login.jsx             # Login page
│   │   ├── SignUp.jsx            # Sign up page
│   │   ├── Transactions.jsx     # Transaction CRUD with Magic Fill
│   │   ├── Users.jsx             # User administration (Admin only)
│   │   └── VerificationPending.jsx # Pending user screen
│   ├── config/
│   │   ├── firebase.js           # Firebase configuration
│   │   └── gemini.js             # Gemini API configuration
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication context & logic
│   │   └── LanguageContext.jsx   # Language context
│   ├── utils/
│   │   └── translations.js       # Translation dictionary (en, fr, am)
│   ├── App.jsx                   # Main app component with routing
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + print styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # Main documentation
├── SETUP.md                     # Setup instructions
└── PROJECT_STRUCTURE.md         # This file
```

## Key Components

### Authentication Flow
1. **SignUp** → Creates user with "pending" role
2. **VerificationPending** → Shows waiting screen
3. **Login** → Authenticates existing users
4. **AuthContext** → Manages auth state and auto-initializes admin

### Main Features
- **Dashboard**: Financial overview, date filtering, AI insights, exports
- **Transactions**: Full CRUD with AI-powered text parsing
- **Inventory**: Item management with stock tracking
- **Users**: Admin panel for user approval and role management

### Context Providers
- **AuthContext**: User authentication, role management, admin initialization
- **LanguageContext**: Language state management (en/fr/am)

### Configuration
- **Firebase**: Authentication and Firestore database
- **Gemini**: AI model for financial insights and text parsing

## Data Models

### User Document
```javascript
{
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  role: 'admin' | 'treasurer' | 'member' | 'pending',
  createdAt: Timestamp
}
```

### Transaction Document
```javascript
{
  type: 'income' | 'expense',
  category: string,
  amount: number,
  date: Timestamp,
  description: string,
  donorName: string (optional)
}
```

### Inventory Document
```javascript
{
  name: string,
  type: string,
  price: number,
  quantity: number,
  imageUrl: string (optional),
  description: string (optional)
}
```

