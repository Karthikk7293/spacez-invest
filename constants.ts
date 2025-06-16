

// FIX: Added SupportRequest, SupportTicketStatus, SupportTicketIssueType to imports
import { Property, PropertyStatus, Investor, CapexDetails, OpexDetails, RevenueAssumptions, InvestorInvestment, MonthlyLedgerEntry, LedgerUpdateLogEntry, SupportRequest, SupportTicketStatus, SupportTicketIssueType } from './types';
// FIX: Export Property and Investor types to be available for import by other modules like App.tsx
export type { Property, Investor };

export const GST_RATE = 0.18;
export const COMMISSION_RATE = 0.12;
export const INVESTOR_PROFIT_SHARE_RATE = 0.50;
export const PROJECTION_YEARS = 5;
export const DEFAULT_NUMBER_OF_INVESTMENT_SLOTS = 10; 
export const ANNUAL_DEPRECIATION_RATE = 0.05; // 5% annual depreciation for principal calculation

export const DEFAULT_CAPEX: CapexDetails = {
  setupCost: 750000,
  securityDeposit: 650000,
  workingCapital: 180080,
  emergencyFund: 180080,
}; // Total: 1,760,160

export const DEFAULT_OPEX: OpexDetails = {
  rent: 130000,
  staff: 30000,
  foodStaff: 6000,
  utilities: 14080,
  maintenance: 10000,
  otherOperatingCosts: 5000, // Added default
};

export const DEFAULT_REVENUE_ASSUMPTIONS: RevenueAssumptions = {
  tariffPerRoom: 4250, // Default tariff, will be overridden by OCR data for specific properties
  occupancyRate: 0.80,
  numberOfRooms: 4, 
};

// Defined THEME_COLORS based on tailwind.config in index.html
export const THEME_COLORS = {
  primary: 'themePrimary',       // Maps to your '#0D9488' (teal-600)
  secondary: 'themeSecondary',   // Maps to your '#FBBF24' (amber-400)
  accent: 'themeAccent',         // Maps to your '#F97316' (orange-500)
  
  background: 'themeBgLight',    // Maps to your '#F8FAFC' (slate-50)
  cardBackground: 'themeBgCard', // Maps to your '#FFFFFF' (white)
  
  textBase: 'themeTextDark',     // Maps to your '#1E293B' (slate-800)
  textMuted: 'themeTextMedium',  // Maps to your '#64748B' (slate-500)
  textLight: 'themeTextLight',   // Maps to your '#E2E8F0' (slate-200 for dark BGs)
  
  border: 'themeBorderLight',    // Maps to your '#CBD5E1' (slate-300)
  
  // Common status colors (using standard Tailwind names if not in your theme directly)
  error: 'red-500',
  success: 'green-500',
  warning: 'yellow-500',
  info: 'blue-500',
};


const generatePlaceholderImages = (name: string, count: number = 3): string[] => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${slug}-${i + 1}/800/600`);
};

const placeholderDetails = {
  description: "A beautifully designed luxury villa offering unparalleled comfort and style. Located in a prime area, this property is an excellent choice for discerning travelers and a lucrative investment opportunity. Features modern amenities, spacious interiors, and serene surroundings.",
  locationHighlights: [
    "Prime location with easy access to city attractions.",
    "Close to popular restaurants and shopping areas.",
    "Serene and peaceful neighborhood.",
    "Excellent transport links."
  ],
  amenities: [
    "Private Swimming Pool",
    "Fully Equipped Kitchen",
    "High-speed Wi-Fi",
    "Air Conditioning",
    "Daily Housekeeping",
    "Dedicated Concierge Service",
    "Landscaped Gardens",
    "Secure Parking"
  ],
  whyInvest: [
    "High potential for rental income and capital appreciation.",
    "Professionally managed by Spacez, ensuring hassle-free ownership.",
    "Located in a high-demand tourist destination.",
    "Strong ROI projections based on market analysis."
  ]
};

const PROPERTY_CITY_FROM_PDF_MAP: Record<string, string> = {
  "Heritage Haven": "Bangalore", // Madiwala is in Bangalore
  "Vana Vista": "Bangalore", // Koramangala is in Bangalore
  "Lagoon Luxe": "Bangalore", // Whitefield is in Bangalore
  "Garden Glory": "Bangalore", // Sarjapur Road is in Bangalore
  "Boutique farm stay at Bangalore": "Bangalore", // Explicitly Bangalore
  "Philly Nest: Cozy 1BHK Apartment": "Philadelphia", // From PDF
  "Billionaire's Glass House": "Bangalore", // Koramangala is in Bangalore
  "Bombay Belvedere": "Mumbai", // Andheri is in Mumbai
  "Garden Bliss": "Bangalore", // Assuming Bangalore from context if not specified, or from previous version
  "CineCastle Spacez Villa": "Bangalore", // MG Road is in Bangalore
  "Hill Top Hideaway": "Mumbai", // Previously "Leh-Ladakh", PDF mentions Mumbai for a "Hilltop Hideaway"
  "Woodstock Nineties": "Mumbai", // Goregaon West is in Mumbai
  "Aurora Heights": "Bangalore", // JP Nagar is in Bangalore
  "Bougain Blossom": "Bangalore", // Kodihalli is in Bangalore
  "Garden Veil": "Bangalore", // Assuming Bangalore from context if not specified
  // Properties like Magnum Opus, Classic Charm, Stellar Skyline, Nature's Novelle, Orchid Nirvana, Regal Sapphire from PDF
  // did not have clear city names, so they will retain their cities from NEW_PROPERTIES_DATA or get a general one if not present.
};


const NEW_PROPERTIES_DATA: Array<Partial<Property> & { name: string, city: string, numberOfRooms?: number, numberOfInvestmentSlots?: number, goLiveDate?: string }> = [
  // Fully Funded
  { name: 'Jugglers Rest', city: 'Jaipur', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2023-01-15T00:00:00.000Z' },
  { name: 'House of Two Trees', city: 'Manali', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2023-03-01T00:00:00.000Z' },
  { name: 'Palm Paradise', city: 'Kochi', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 12, goLiveDate: '2022-11-10T00:00:00.000Z' },
  { name: 'Vintage Haven', city: 'Shimla', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2023-05-20T00:00:00.000Z' },
  { name: 'Namma Woodland', city: 'Ooty', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 10, goLiveDate: '2023-02-01T00:00:00.000Z' },
  { name: 'Metronest', city: 'Pune', status: PropertyStatus.FullyFunded, numberOfRooms: 2, numberOfInvestmentSlots: 8, goLiveDate: '2022-12-01T00:00:00.000Z' },
  { name: 'Urban Escape', city: 'Chandigarh', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2023-04-10T00:00:00.000Z' },
  { name: 'Garden Glory', city: 'Bangalore', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 15, goLiveDate: '2023-06-15T00:00:00.000Z' }, // Updated by PDF
  { name: 'Heritage Haven', city: 'Bangalore', status: PropertyStatus.FullyFunded, numberOfRooms: 6, numberOfInvestmentSlots: 12, goLiveDate: '2022-10-01T00:00:00.000Z' }, // Updated by PDF
  { name: 'Cascade Castle', city: 'Dehradun', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2023-07-01T00:00:00.000Z' },
  { name: 'Vana Vista', city: 'Bangalore', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2023-08-15T00:00:00.000Z' }, // Updated by PDF
  { name: 'Billionaire\'s GH', city: 'Goa', status: PropertyStatus.FullyFunded, numberOfRooms: 7, numberOfInvestmentSlots: 20, goLiveDate: '2022-09-01T00:00:00.000Z' }, 
  { name: 'Regal Sapphire', city: 'Chennai', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 10, goLiveDate: '2023-09-01T00:00:00.000Z' },
  { name: 'Mansion Bay', city: 'Alibaug', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2023-10-10T00:00:00.000Z' },
  { name: 'Waterfall Manor', city: 'Lonavala', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 12, goLiveDate: '2023-04-01T00:00:00.000Z' },
  { name: 'Magnum Opus', city: 'Goa', status: PropertyStatus.FullyFunded, numberOfRooms: 6, numberOfInvestmentSlots: 15, goLiveDate: '2023-11-01T00:00:00.000Z' }, // Retained Goa as PDF was not specific
  { name: 'Nature\'s Novelle', city: 'Kodaikanal', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2023-12-15T00:00:00.000Z' },
  { name: 'Lagoon Luxe', city: 'Bangalore', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2024-01-20T00:00:00.000Z' }, // Updated by PDF
  { name: 'Casa Blu', city: 'Gokarna', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 10, goLiveDate: '2024-02-10T00:00:00.000Z' },
  { name: 'Pearl Palace', city: 'Hyderabad', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 10, goLiveDate: '2024-03-01T00:00:00.000Z' },
  { name: 'Bombay Belvedere', city: 'Mumbai', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2024-04-05T00:00:00.000Z' }, // Updated by PDF
  { name: 'Bollywood Boulevard', city: 'Mumbai', status: PropertyStatus.FullyFunded, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2024-05-15T00:00:00.000Z' },
  { name: 'Classic Charm', city: 'Udaipur', status: PropertyStatus.FullyFunded, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2024-06-01T00:00:00.000Z' }, // Retained current city as PDF was not specific
  { name: 'Gatsby Grandeur', city: 'Delhi', status: PropertyStatus.FullyFunded, numberOfRooms: 5, numberOfInvestmentSlots: 12, goLiveDate: '2024-07-10T00:00:00.000Z' }, // Retained current city as PDF was not specific
  { name: 'Twilight Terrace', city: 'Shillong', status: PropertyStatus.Live, numberOfRooms: 2, numberOfInvestmentSlots: 6, goLiveDate: '2024-08-01T00:00:00.000Z' },
  { name: 'Garden Bliss', city: 'Bangalore', status: PropertyStatus.Live, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2024-09-01T00:00:00.000Z' }, // Updated by PDF
  { name: 'Orchid Nirvana', city: 'Mysore', status: PropertyStatus.Draft, numberOfRooms: 4, numberOfInvestmentSlots: 10 }, // Retained current city as PDF was not specific
  { name: 'Hilltop Hideaway', city: 'Mumbai', status: PropertyStatus.Live, numberOfRooms: 3, numberOfInvestmentSlots: 10, goLiveDate: '2024-10-01T00:00:00.000Z' }, // Updated by PDF
  { name: 'Cine Castle', city: 'Bangalore', status: PropertyStatus.Draft, numberOfRooms: 2, numberOfInvestmentSlots: 5 }, // Updated by PDF (CineCastle Spacez Villa)
  { name: 'Aurora Heights', city: 'Bangalore', status: PropertyStatus.Live, numberOfRooms: 4, numberOfInvestmentSlots: 10, goLiveDate: '2024-11-15T00:00:00.000Z' }, // Updated by PDF
  { name: 'Bougain Blossom', city: 'Bangalore', status: PropertyStatus.Live, numberOfRooms: 3, numberOfInvestmentSlots: 8, goLiveDate: '2024-12-01T00:00:00.000Z' }, // Updated by PDF
  { name: 'Timeless Hearth', city: 'Varanasi', status: PropertyStatus.Draft, numberOfRooms: 5, numberOfInvestmentSlots: 12 },
  { name: 'Garden Veil', city: 'Bangalore', status: PropertyStatus.Live, numberOfRooms: 2, numberOfInvestmentSlots: 6, goLiveDate: '2025-01-10T00:00:00.000Z' }, // Updated by PDF
  // Adding Philly Nest if it's considered part of the Spacez properties, even if US based
  { name: 'Philly Nest: Cozy 1BHK Apartment', city: 'Philadelphia', status: PropertyStatus.Live, numberOfRooms: 1, numberOfInvestmentSlots: 4, goLiveDate: '2024-09-15T00:00:00.000Z' }
];

const OCR_PRICE_JB_MAP: Record<string, number> = {
  "Magnum Opus": 16750,
  "Classic Charm": 10999,
  "Heritage Haven": 16750,
  "Vana Vista": 16750,
  "Lagoon Luxe": 22999,
  "Garden Glory": 7400, // AHU A1 Sarjapur
  "Boutique farm stay at Bangalore": 12000,
  "Gatsby Grandeur": 21750,
  "Philly Nest: Cozy 1BHK Apartment": 8000,
  "Stellar Skyline": 16750,
  "Nature's Novelle": 18750,
  "Orchid Nirvana": 16750,
  "Regal Sapphire": 17750,
  "Billionaire's Glass House": 16750,
  "Bombay Belvedere": 24750, // Bombay Belvedere Spacez Luxurious Villa
  "Garden Bliss": 13750,
  "CineCastle Spacez Villa": 13750, // Matched with 'Cine Castle'
  "Hill Top Hideaway": 22500, // Matched with 'Hill Top Hideaway Spacez Luxury Pool Villa'
  "Woodstock Nineties": 20000,
  "Aurora Heights": 22500, // Matched with 'Aurora Heights Spacez Luxe Cine Villa'
  "Bougain Blossom": 18750, // Matched with 'Bougain Blossom Spacez Villa'
  "Garden Veil": 19750, // Matched with 'Garden Veil Spacez Garden Villa'
  // Defaults for other properties not in OCR
  "Jugglers Rest": 400000/30/4, 
  "House of Two Trees": 250000/30/3,
  "Palm Paradise": 400000/30/5,
  "Vintage Haven": 400000/30/4,
  "Namma Woodland": 350000/30/3,
  "Metronest": 150000/30/2,
  "Urban Escape": 500000/30/4,
  "Cascade Castle": 400000/30/4,
  "Billionaire's GH": 300000/30/7,
  "Mansion Bay": 300000/30/4,
  "Waterfall Manor": 350000/30/5,
  "Casa Blu": 500000/30/3,
  "Pearl Palace": 450000/30/5,
  "Bollywood Boulevard": 150000/30/3,
  "Twilight Terrace": 200000/30/2,
  "Timeless Hearth": 500000/30/5,
};

// FIX: Define MOCK_ADMIN_USERS
export const MOCK_ADMIN_USERS = [
  { username: 'hardik@spacez.co', password: 'password' },
  { username: 'shubham@spacez.co', password: 'password' },
  { username: 'rounak@spacez.co', password: 'password' },
];

export const MOCK_PROPERTIES: Property[] = NEW_PROPERTIES_DATA.map((propData, index) => {
  const baseRevenueAssumptions = { ...DEFAULT_REVENUE_ASSUMPTIONS };
  if (propData.numberOfRooms) {
    baseRevenueAssumptions.numberOfRooms = propData.numberOfRooms;
  }
  
  // Determine the correct property name for map lookups, handling variants from PDF
  let mapLookupName = propData.name;
  if (propData.name === "Cine Castle") mapLookupName = "CineCastle Spacez Villa";
  if (propData.name === "Hilltop Hideaway") mapLookupName = "Hill Top Hideaway Spacez Luxury Pool Villa"; // Note: PDF has "Hill Top..."
  if (propData.name === "Aurora Heights") mapLookupName = "Aurora Heights Spacez Luxe Cine Villa";
  if (propData.name === "Bougain Blossom") mapLookupName = "Bougain Blossom Spacez Villa";
  if (propData.name === "Garden Veil") mapLookupName = "Garden Veil Spacez Garden Villa";


  // Override tariffPerRoom if present in OCR_PRICE_JB_MAP
  if (OCR_PRICE_JB_MAP[mapLookupName]) {
    baseRevenueAssumptions.tariffPerRoom = OCR_PRICE_JB_MAP[mapLookupName];
  } else if (OCR_PRICE_JB_MAP[propData.name]) { // Fallback to original name if variant not found
     baseRevenueAssumptions.tariffPerRoom = OCR_PRICE_JB_MAP[propData.name];
  }


  // Initial May 2025 Ledger Data from user prompt for specific villas
  const may2025Revenue: Record<string, number> = {
    "Jugglers Rest": 400000, "House of Two Trees": 250000, "Palm Paradise": 400000,
    "Vintage Haven": 400000, "Namma Woodland": 350000, "Metronest": 150000,
    "Urban Escape": 500000, "Garden Glory": 225000, "Heritage Haven": 300000,
    "Cascade Castle": 400000, "Vana Vista": 350000, "Billionaire's GH": 300000,
    "Regal Sapphire": 350000, "Mansion Bay": 300000, "Waterfall Manor": 350000,
    "Magnum Opus": 250000, "Nature's Novelle": 300000, "Lagoon Luxe": 500000,
    "Casa Blu": 500000, "Pearl Palace": 450000, "Bombay Belvedere": 350000,
    "Bollywood Boulevard": 150000, "Classic Charm": 200000, "Gatsby Grandeur": 250000,
    "Twilight Terrace": 200000, "Garden Bliss": 200000, "Orchid Nirvana": 200000,
    "Hilltop Hideaway": 350000, "Cine Castle": 150000, "Aurora Heights": 250000,
    "Bougain Blossom": 250000, "Timeless Hearth": 500000, "Garden Veil": 400000,
  };

  const monthlyLedgerData: MonthlyLedgerEntry[] = [];
  let lastLedgerUpdate: string | undefined = undefined;
  let ledgerUpdateLog: LedgerUpdateLogEntry[] = [];

  if (may2025Revenue[propData.name]) {
    const revenue = may2025Revenue[propData.name];
    const opexActual = { ...DEFAULT_OPEX }; // Assume default opex for now
    const totalOperatingExpensesActual = Object.values(opexActual).reduce((sum, val) => sum + val, 0);
    const netProfitActual = revenue - totalOperatingExpensesActual;
    const totalPayoutToInvestors = netProfitActual * INVESTOR_PROFIT_SHARE_RATE;
    
    monthlyLedgerData.push({
      month: "2025-05",
      revenue,
      occupancyRateActual: 0.75, // Assume 75% actual occupancy
      opexActual,
      totalOperatingExpensesActual,
      netProfitActual,
      totalPayoutToInvestors,
    });
    lastLedgerUpdate = new Date().toISOString();
    ledgerUpdateLog.push({
        logId: `log-${Date.now()}-${index}`,
        updatedAt: lastLedgerUpdate,
        updatedBy: "System Bulk Update",
        monthUpdated: "2025-05",
        notes: "Initial revenue data for May 2025 based on user prompt."
    });
  }
  
  // Override city if present in PROPERTY_CITY_FROM_PDF_MAP
  const cityFromPdf = PROPERTY_CITY_FROM_PDF_MAP[propData.name] || propData.city;

  return {
    id: `prop-${index + 1}-${propData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, // More robust slug
    name: propData.name,
    city: cityFromPdf, // Use city from PDF map or fallback to existing
    images: generatePlaceholderImages(propData.name),
    description: placeholderDetails.description,
    investmentGoal: DEFAULT_CAPEX.setupCost + DEFAULT_CAPEX.securityDeposit + DEFAULT_CAPEX.workingCapital + DEFAULT_CAPEX.emergencyFund,
    amountRaised: propData.status === PropertyStatus.FullyFunded ? (DEFAULT_CAPEX.setupCost + DEFAULT_CAPEX.securityDeposit + DEFAULT_CAPEX.workingCapital + DEFAULT_CAPEX.emergencyFund) : Math.random() * (DEFAULT_CAPEX.setupCost + DEFAULT_CAPEX.securityDeposit),
    status: propData.status || PropertyStatus.Draft,
    numberOfInvestmentSlots: propData.numberOfInvestmentSlots || DEFAULT_NUMBER_OF_INVESTMENT_SLOTS,
    capexDetails: { ...DEFAULT_CAPEX },
    opexDetails: { ...DEFAULT_OPEX },
    revenueAssumptions: baseRevenueAssumptions,
    locationHighlights: placeholderDetails.locationHighlights,
    amenities: placeholderDetails.amenities,
    whyInvest: placeholderDetails.whyInvest,
    goLiveDate: propData.goLiveDate,
    monthlyLedgerData: monthlyLedgerData.length > 0 ? monthlyLedgerData : [],
    lastLedgerUpdate: lastLedgerUpdate,
    ledgerUpdateLog: ledgerUpdateLog.length > 0 ? ledgerUpdateLog : [],
  };
});

export const MOCK_INVESTORS: Investor[] = [
  { 
    id: 'inv-1', name: 'Ananya Sharma', email: 'ananya.sharma@example.com', totalInvested: 500000, 
    username: 'ananya.sharma@example.com', password: 'password',
    phone: '9876543210', alternateContactNumber: '9000011111', age: 34, 
    aadharNumber: '1234 5678 9012', panNumber: 'ABCDE1234F', 
    bankAccountNumber: '001234567890', bankIfscCode: 'HDFC0001234', 
    registeredAddress: '12B, Lotus Apartments, Juhu, Mumbai - 400049',
    pocName: 'Rohan Sharma (Spouse)', pocEmail: 'rohan.s@example.com', pocContactNumber: '9876500000',
    witnessName: 'Priya Singh', witnessDesignation: 'Financial Advisor', witnessContactNumber: '9988776655', witnessEmailId: 'priya.singh@example.com',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[0].id, amount: 200000, dateInvested: '2023-01-20T10:00:00Z' },
      { propertyId: MOCK_PROPERTIES[2].id, amount: 300000, dateInvested: '2022-11-15T14:30:00Z' },
    ]
  },
  { 
    id: 'inv-2', name: 'Vikram Singh', email: 'vikram.singh@example.com', totalInvested: 750000, 
    username: 'vikram.singh@example.com', password: 'password',
    phone: '9123456789', registeredAddress: '5, Green Park, New Delhi - 110016',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[1].id, amount: 350000, dateInvested: '2023-03-10T11:00:00Z' },
      { propertyId: MOCK_PROPERTIES[4].id, amount: 400000, dateInvested: '2023-02-05T09:20:00Z' },
    ]
  },
  { 
    id: 'inv-3', name: 'Priya Reddy', email: 'priya.reddy@example.com', totalInvested: 300000, 
    username: 'priya.reddy@example.com', password: 'password',
    phone: '9998887770',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[5].id, amount: 300000, dateInvested: '2022-12-10T16:00:00Z' }
    ]
  },
  { 
    id: 'inv-hardik', name: 'Hardik Pandya (Investor)', email: 'hardik@spacez.co', totalInvested: 1000000, 
    username: 'hardik@spacez.co', password: 'password',
    phone: '8887776665', aadharNumber: '2345 6789 0123', panNumber: 'FGHIJ5678K',
    bankAccountNumber: '987654321000', bankIfscCode: 'ICIC0005678',
    registeredAddress: 'Apt 101, Galaxy Heights, Bandra, Mumbai',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[0].id, amount: 500000, dateInvested: '2024-01-10T10:00:00Z' },
      { propertyId: MOCK_PROPERTIES[1].id, amount: 500000, dateInvested: '2024-02-15T10:00:00Z' },
    ]
  },
  { 
    id: 'inv-shubham', name: 'Shubham Gill (Investor)', email: 'shubham@spacez.co', totalInvested: 800000, 
    username: 'shubham@spacez.co', password: 'password',
    phone: '7776665554',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[2].id, amount: 800000, dateInvested: '2024-03-20T10:00:00Z' },
    ]
  },
  { 
    id: 'inv-rounak', name: 'Rounak Agrawal (Investor)', email: 'rounak@spacez.co', totalInvested: 1200000, 
    username: 'rounak@spacez.co', password: 'password',
    phone: '6665554443',
    propertiesInvested: [
      { propertyId: MOCK_PROPERTIES[3].id, amount: 600000, dateInvested: '2024-04-25T10:00:00Z' },
      { propertyId: MOCK_PROPERTIES[4].id, amount: 600000, dateInvested: '2024-05-01T10:00:00Z' },
    ]
  },
];

// FIX: Export MOCK_SUPPORT_REQUESTS
export const MOCK_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'ticket-001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '9876512345',
    issueType: SupportTicketIssueType.InvestmentQuestion,
    subject: 'Question about Goa Villa ROI',
    propertyId: MOCK_PROPERTIES[0].id,
    propertyName: MOCK_PROPERTIES[0].name,
    message: 'I have a few questions regarding the projected ROI for the "Jugglers Rest" villa in Goa. Could someone please clarify the assumptions made for occupancy rates?',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: SupportTicketStatus.New,
    adminComments: "Forwarded to investment team."
  },
  {
    id: 'ticket-002',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    phone: '9123456780',
    issueType: SupportTicketIssueType.TechnicalIssue,
    subject: 'Login problem on investor portal',
    message: 'I am unable to log in to my investor portal account. The password reset link is not working either. Please assist.',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: SupportTicketStatus.InProgress,
  },
  {
    id: 'ticket-003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    issueType: SupportTicketIssueType.GeneralInquiry,
    subject: 'Information about upcoming properties',
    message: 'Are there any new properties planned for listing in Lonavala or Alibaug in the next quarter? I am interested in exploring more options.',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: SupportTicketStatus.Resolved,
    adminComments: "Provided information about upcoming Lonavala project via email."
  },
  {
    id: 'ticket-004',
    name: MOCK_INVESTORS[0].name, // Ananya Sharma
    email: MOCK_INVESTORS[0].email,
    propertyId: MOCK_PROPERTIES[0].id,
    propertyName: MOCK_PROPERTIES[0].name,
    issueType: SupportTicketIssueType.LedgerInquiry,
    subject: `Ledger question for ${MOCK_PROPERTIES[0].name} - May 2025`,
    message: 'I was reviewing my May 2025 report for Jugglers Rest and had a question about the maintenance expenses. Could you provide a breakdown?',
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: SupportTicketStatus.New,
  },
   {
    id: 'ticket-005',
    name: 'Hardik Pandya (Investor)',
    email: 'hardik@spacez.co',
    phone: '8887776665',
    issueType: SupportTicketIssueType.PaymentIssue,
    subject: 'Payout not received for June',
    propertyId: MOCK_PROPERTIES[0].id,
    propertyName: MOCK_PROPERTIES[0].name,
    message: 'I haven\'t received my payout for Jugglers Rest for the month of June. Can you please check?',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: SupportTicketStatus.InProgress,
    adminComments: "Checking with finance team. Bank holiday might have caused delay."
  },
];
