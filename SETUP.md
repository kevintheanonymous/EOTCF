# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Copy your config to `src/config/firebase.js`
   - Set up Firestore security rules (see README.md)

3. **Configure Gemini API:**
   - Get API key from Google AI Studio
   - Add to `src/config/gemini.js`

4. **Create Firestore Indexes:**
   
   Firestore will prompt you to create composite indexes when you first run queries. You can also create them manually:
   
   - **Transactions collection:**
     - Fields: `date` (Ascending), `date` (Ascending)
     - Query scope: Collection
   
   - **Users collection:**
     - Fields: `role` (Ascending)
     - Query scope: Collection

5. **Run the app:**
   ```bash
   npm run dev
   ```

## First Login

1. Sign up with `eotctoulouse@gmail.com` (or any email)
2. If using `eotctoulouse@gmail.com`, you'll be automatically assigned Admin role
3. For other emails, wait for Admin approval

## Testing

- Create test transactions to see the dashboard populate
- Add inventory items to see stock value calculation
- Test the Magic Fill feature with text like: "Paid 50 euros for candles yesterday"
- Test language switching to verify translations

## Troubleshooting

- **Firestore permission errors:** Check security rules
- **AI not working:** Verify Gemini API key is correct
- **Amharic not displaying:** Ensure fonts are loaded (check browser console)
- **Export issues:** Check browser console for errors

