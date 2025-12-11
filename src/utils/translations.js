export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    inventory: 'Inventory',
    users: 'Users',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    loginButton: 'Sign In',
    signupButton: 'Create Account',
    verificationPending: 'Verification Pending',
    verificationMessage: 'Your account is pending approval. An administrator will review your request shortly.',
    incorrectPassword: 'Incorrect password',
    emailInUse: 'Email already in use',
    weakPassword: 'Password should be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    
    // Dashboard
    income: 'Income',
    expenses: 'Expenses',
    netBalance: 'Net Balance',
    totalStockValue: 'Total Stock Value',
    startDate: 'Start Date',
    endDate: 'End Date',
    aiFinancialAdvisor: 'AI Financial Advisor',
    ledger: 'Ledger',
    exportExcel: 'Export to Excel',
    exportPDF: 'Export/Print',
    date: 'Date',
    type: 'Type',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',
    donorName: 'Donor Name',
    noTransactions: 'No transactions found',
    
    // Transactions
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    deleteTransaction: 'Delete Transaction',
    transactionType: 'Transaction Type',
    income: 'Income',
    expense: 'Expense',
    transactionCategories: {
      income: {
        tithe: 'Tithe',
        candleSales: 'Candle Sales',
        buildingFund: 'Building Fund',
        other: 'Other'
      },
      expense: {
        rent: 'Rent',
        utilities: 'Utilities',
        supplies: 'Supplies',
        salaries: 'Salaries',
        maintenance: 'Maintenance'
      }
    },
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    actions: 'Actions',
    magicFill: 'Magic Fill (AI)',
    magicFillPlaceholder: 'Paste unstructured text here (e.g., "Paid 50 euros for candles yesterday")',
    parse: 'Parse with AI',
    
    // Inventory
    addItem: 'Add Item',
    editItem: 'Edit Item',
    itemName: 'Item Name',
    itemType: 'Item Type',
    price: 'Price',
    quantity: 'Quantity',
    imageUrl: 'Image URL',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    noItems: 'No items found',
    itemTypes: {
      religiousItem: 'Religious Item',
      book: 'Book',
      clothing: 'Clothing',
      other: 'Other'
    },
    
    // Users
    accessRequests: 'Access Requests',
    activeUsers: 'Active Users',
    approve: 'Approve',
    deny: 'Deny',
    changeRole: 'Change Role',
    role: 'Role',
    pending: 'Pending',
    member: 'Member',
    treasurer: 'Treasurer',
    admin: 'Admin',
    noPendingUsers: 'No pending users',
    noActiveUsers: 'No active users',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close'
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    transactions: 'Transactions',
    inventory: 'Inventaire',
    users: 'Utilisateurs',
    logout: 'Déconnexion',
    login: 'Connexion',
    signup: 'S\'inscrire',
    
    // Auth
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    phoneNumber: 'Numéro de téléphone',
    loginButton: 'Se connecter',
    signupButton: 'Créer un compte',
    verificationPending: 'Vérification en attente',
    verificationMessage: 'Votre compte est en attente d\'approbation. Un administrateur examinera votre demande sous peu.',
    incorrectPassword: 'Mot de passe incorrect',
    emailInUse: 'Email déjà utilisé',
    weakPassword: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    
    // Dashboard
    income: 'Revenus',
    expenses: 'Dépenses',
    netBalance: 'Solde net',
    totalStockValue: 'Valeur totale du stock',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    aiFinancialAdvisor: 'Conseiller financier IA',
    ledger: 'Grand livre',
    exportExcel: 'Exporter vers Excel',
    exportPDF: 'Exporter/Imprimer',
    date: 'Date',
    type: 'Type',
    category: 'Catégorie',
    amount: 'Montant',
    description: 'Description',
    donorName: 'Nom du donateur',
    noTransactions: 'Aucune transaction trouvée',
    
    // Transactions
    addTransaction: 'Ajouter une transaction',
    editTransaction: 'Modifier la transaction',
    deleteTransaction: 'Supprimer la transaction',
    transactionType: 'Type de transaction',
    income: 'Revenus',
    expense: 'Dépenses',
    transactionCategories: {
      income: {
        tithe: 'Dîme',
        candleSales: 'Vente de bougies',
        buildingFund: 'Fonds de construction',
        other: 'Autre'
      },
      expense: {
        rent: 'Loyer',
        utilities: 'Services publics',
        supplies: 'Fournitures',
        salaries: 'Salaires',
        maintenance: 'Entretien'
      }
    },
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    actions: 'Actions',
    magicFill: 'Remplissage magique (IA)',
    magicFillPlaceholder: 'Collez le texte non structuré ici (ex: "Payé 50 euros pour des bougies hier")',
    parse: 'Analyser avec l\'IA',
    
    // Inventory
    addItem: 'Ajouter un article',
    editItem: 'Modifier l\'article',
    itemName: 'Nom de l\'article',
    itemType: 'Type d\'article',
    price: 'Prix',
    quantity: 'Quantité',
    imageUrl: 'URL de l\'image',
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    noItems: 'Aucun article trouvé',
    itemTypes: {
      religiousItem: 'Article religieux',
      book: 'Livre',
      clothing: 'Vêtements',
      other: 'Autre'
    },
    
    // Users
    accessRequests: 'Demandes d\'accès',
    activeUsers: 'Utilisateurs actifs',
    approve: 'Approuver',
    deny: 'Refuser',
    changeRole: 'Changer le rôle',
    role: 'Rôle',
    pending: 'En attente',
    member: 'Membre',
    treasurer: 'Trésorier',
    admin: 'Administrateur',
    noPendingUsers: 'Aucun utilisateur en attente',
    noActiveUsers: 'Aucun utilisateur actif',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    close: 'Fermer'
  },
  am: {
    // Navigation
    dashboard: 'ዳሽቦርድ',
    transactions: 'ግብይቶች',
    inventory: 'እቃዎች',
    users: 'ተጠቃሚዎች',
    logout: 'ውጣ',
    login: 'ግባ',
    signup: 'ተመዝግብ',
    
    // Auth
    email: 'ኢሜይል',
    password: 'የይለፍ ቃል',
    confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
    firstName: 'የመጀመሪያ ስም',
    lastName: 'የአያት ስም',
    phoneNumber: 'የስልክ ቁጥር',
    loginButton: 'ግባ',
    signupButton: 'መለያ ፍጠር',
    verificationPending: 'ማረጋገጥ በመጠባበቅ ላይ',
    verificationMessage: 'የእርስዎ መለያ ማረጋገጥ በመጠባበቅ ላይ ነው። አስተዳዳሪ ወዲያውኑ ጥያቄዎን ያስተውላል።',
    incorrectPassword: 'የተሳሳተ የይለፍ ቃል',
    emailInUse: 'ኢሜይል አስቀድሞ ጥቅም ላይ ውሏል',
    weakPassword: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖረው ይገባል',
    passwordsDontMatch: 'የይለፍ ቃሎች አይዛመዱም',
    
    // Dashboard
    income: 'ገቢ',
    expenses: 'ወጪዎች',
    netBalance: 'ንጹህ ሚዛን',
    totalStockValue: 'አጠቃላይ የእቃ ዋጋ',
    startDate: 'የመጀመሪያ ቀን',
    endDate: 'የመጨረሻ ቀን',
    aiFinancialAdvisor: 'የAI የገንዘብ አማካሪ',
    ledger: 'የግብይት መዝገብ',
    exportExcel: 'ወደ Excel ላክ',
    exportPDF: 'ላክ/አትም',
    date: 'ቀን',
    type: 'ዓይነት',
    category: 'ምድብ',
    amount: 'መጠን',
    description: 'መግለጫ',
    donorName: 'የለጋሽ ስም',
    noTransactions: 'ግብይት አልተገኘም',
    
    // Transactions
    addTransaction: 'ግብይት ጨምር',
    editTransaction: 'ግብይት አርም',
    deleteTransaction: 'ግብይት ሰርዝ',
    transactionType: 'የግብይት ዓይነት',
    income: 'ገቢ',
    expense: 'ወጪ',
    transactionCategories: {
      income: {
        tithe: 'አስረካቢ',
        candleSales: 'ካራስ ሽያጭ',
        buildingFund: 'የግንባታ ፈንድ',
        other: 'ሌላ'
      },
      expense: {
        rent: 'ኪራይ',
        utilities: 'መገልገያዎች',
        supplies: 'ቁሳቁሶች',
        salaries: 'ደመወዝ',
        maintenance: 'ጥገና'
      }
    },
    save: 'አስቀምጥ',
    cancel: 'ተወ',
    delete: 'ሰርዝ',
    edit: 'አርም',
    actions: 'ድርጊቶች',
    magicFill: 'የAI አስላስት መሙያ',
    magicFillPlaceholder: 'ያልተዋቀረ ጽሁፍ እዚህ ይጣበቁ (ለምሳሌ: "ለካራስ 50 ዩሮ ትላንት ተከፍሏል")',
    parse: 'በAI ተንተን',
    
    // Inventory
    addItem: 'እቃ ጨምር',
    editItem: 'እቃ አርም',
    itemName: 'የእቃ ስም',
    itemType: 'የእቃ ዓይነት',
    price: 'ዋጋ',
    quantity: 'ብዛት',
    imageUrl: 'የምስል አድራሻ',
    inStock: 'በመጋዘን ውስጥ',
    outOfStock: 'የተጠናቀቀ',
    noItems: 'እቃ አልተገኘም',
    itemTypes: {
      religiousItem: 'የሃይማኖት እቃ',
      book: 'መጽሐፍ',
      clothing: 'ልብስ',
      other: 'ሌላ'
    },
    
    // Users
    accessRequests: 'የመዳረሻ ጥያቄዎች',
    activeUsers: 'ንቁ ተጠቃሚዎች',
    approve: 'ይፈቀድ',
    deny: 'አትፈቀድ',
    changeRole: 'የድርጅት ሚና ለውጥ',
    role: 'የድርጅት ሚና',
    pending: 'በመጠባበቅ ላይ',
    member: 'አባል',
    treasurer: 'ነዋሪ',
    admin: 'አስተዳዳሪ',
    noPendingUsers: 'በመጠባበቅ ላይ ያለ ተጠቃሚ የለም',
    noActiveUsers: 'ንቁ ተጠቃሚ የለም',
    
    // Common
    loading: 'በመጫን ላይ...',
    error: 'ስህተት',
    success: 'ተሳክቷል',
    close: 'ዝጋ'
  }
}

export const getTranslation = (lang, key) => {
  const keys = key.split('.')
  let value = translations[lang] || translations.en
  for (const k of keys) {
    value = value?.[k]
    if (!value) return key
  }
  return value || key
}

