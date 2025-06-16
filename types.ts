
export enum PropertyStatus {
  Draft = 'Draft',
  Live = 'Live',
  FullyFunded = 'Fully Funded',
  Closed = 'Closed',
}

export interface CapexDetails {
  setupCost: number;
  securityDeposit: number;
  workingCapital: number;
  emergencyFund: number;
}

export interface OpexDetails {
  rent: number;
  staff: number; // This might include food for staff as per some ledger concepts
  foodStaff: number; // Or keep separate if needed
  utilities: number; // Should cover water, electricity
  maintenance: number; // Should cover housekeeping materials
  otherOperatingCosts?: number; // For "I Bill" and other miscellaneous
}

export interface RevenueAssumptions {
  tariffPerRoom: number;
  occupancyRate: number; // Target/Projected occupancy rate (0-1)
  numberOfRooms: number; // Total rooms in property, all are rentable
  // reserveSlots: number; // Removed: Number of rooms reserved for owner/maintenance, not rentable
}

export interface CalculatedMetrics {
  totalCapex: number;
  totalOpexMonthly: number; // Based on projected OpexDetails
  annualOpex: number; // Based on projected OpexDetails
  monthlyGrossRevenue: number; // Based on RevenueAssumptions
  monthlyGstAmount: number;
  monthlyCommissionAmount: number;
  monthlyNetRevenue: number;
  annualNetRevenue: number;
  annualNetProfit: number; // Projected annual net profit
  annualInvestorShare: number;
  monthlyInvestorShare: number;
  roiProjections: ROIProjectionItem[];
  rentableRooms: number; // Will now be equal to numberOfRooms
}

export interface MonthlyLedgerEntry {
  month: string; // "YYYY-MM"
  revenue: number; // Actual gross revenue for the month
  occupancyRateActual: number; // Actual occupancy rate for the month (0-1)
  opexActual: OpexDetails; // Actual opex for the month
  totalOperatingExpensesActual: number; // Sum of opexActual fields
  netProfitActual: number; // revenue - totalOperatingExpensesActual
  totalPayoutToInvestors: number; // Actual amount paid out from net profit this month
}

export interface LedgerUpdateLogEntry {
  logId: string;
  updatedAt: string; // ISO Date of when the log entry was made
  updatedBy: string; // e.g., "admin"
  monthUpdated: string; // The "YYYY-MM" of the ledger entry that was affected
  notes: string; // E.g., "Initial data entry", "Corrected revenue figure"
  previousValues?: Partial<MonthlyLedgerEntry>; // Optional: for detailed audit
}

export interface Property {
  id: string;
  name: string;
  city: string;
  images: string[]; // URLs
  description: string;
  investmentGoal: number; // same as totalCapex, can be calculated or stored
  amountRaised: number;
  status: PropertyStatus;
  numberOfInvestmentSlots: number; 
  capexDetails: CapexDetails;
  opexDetails: OpexDetails; // These are target/projected OpEx
  revenueAssumptions: RevenueAssumptions; 
  calculatedMetrics?: CalculatedMetrics; 
  locationHighlights?: string[];
  amenities?: string[];
  whyInvest?: string[];
  goLiveDate?: string; // ISO Date string - New for investor dashboard
  monthlyLedgerData?: MonthlyLedgerEntry[]; // New for performance tracking
  lastLedgerUpdate?: string; // ISO Date string - New for admin view
  ledgerUpdateLog?: LedgerUpdateLogEntry[]; // New for audit trail
}

export interface ROIProjectionItem {
  year: number;
  annualReturnPercentage: number;
  cumulativeReturnPercentage: number;
  annualInvestorShareAmount: number;
}

export interface InvestorInvestment {
  propertyId: string;
  amount: number;
  dateInvested?: string; // ISO Date string
  // ownershipPercentage can be calculated: (amount / property.investmentGoal) * 100
}
export interface Investor {
  id: string;
  name: string;
  email: string;
  totalInvested: number; 
  propertiesInvested: InvestorInvestment[]; 
  // For mock login, can add username/password if needed, or use ID to select
  username?: string; // Example: investor's email
  password?: string; // Example: "password"
  // FIX: Added missing optional fields for Investor type
  phone?: string;
  alternateContactNumber?: string;
  age?: number;
  aadharNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  registeredAddress?: string;
  pocName?: string;
  pocEmail?: string;
  pocContactNumber?: string;
  witnessName?: string;
  witnessDesignation?: string;
  witnessContactNumber?: string;
  witnessEmailId?: string;
}

export interface Investment {
  id: string;
  investorId: string;
  propertyId: string;
  amount: number;
  date: string; // ISO Date string
}

export interface Prospect {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  email: string;
  phone: string;
  intendedInvestment?: number;
  submittedAt: string; // ISO Date string
  status: 'New' | 'Contacted' | 'Follow-up' | 'Closed';
}

export enum SupportTicketStatus {
  New = 'New',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum SupportTicketIssueType {
  GeneralInquiry = 'General Inquiry',
  TechnicalIssue = 'Technical Issue',
  InvestmentQuestion = 'Investment Question',
  PaymentIssue = 'Payment Issue',
  LedgerInquiry = 'Ledger Inquiry', // Added for report questions
  Other = 'Other',
}
export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone?: string; 
  propertyId?: string; 
  propertyName?: string; 
  issueType: SupportTicketIssueType | 'General Contact'; 
  subject?: string; // Could be used for report period for LedgerInquiry
  message: string;
  submittedAt: string; // ISO Date string
  status: SupportTicketStatus;
  adminComments?: string; // Added for admin comments
}