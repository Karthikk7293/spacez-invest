

import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
// FIX: Import SupportTicketStatus
import { Investor, Property, MonthlyLedgerEntry, SupportRequest, SupportTicketStatus } from '../../types';
import PageTitle from '../../components/PageTitle';

const formatCurrency = (value?: number, digits = 0) => value != null ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}` : 'N/A';
const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', options || { year: 'numeric', month: 'short', day: 'numeric' });
};

const DetailItem: React.FC<{ label: string; value?: string | number | null; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`py-2 ${className}`}>
    <dt className="text-sm font-medium text-neutral-500">{label}</dt>
    <dd className="mt-1 text-sm text-neutral-900">{value || 'N/A'}</dd>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = "md:grid-cols-2" }) => (
  <div className="mb-8 bg-white p-6 shadow-lg rounded-xl">
    <h3 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-neutral-200">{title}</h3>
    <dl className={`grid grid-cols-1 gap-x-4 gap-y-3 ${gridCols}`}>
      {children}
    </dl>
  </div>
);

const AdminInvestorDetailPage: React.FC = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const appContext = useContext(AppContext) as AppContextType;
  
  const investor = useMemo(() => {
    return appContext.investors.find(inv => inv.id === investorId);
  }, [investorId, appContext.investors]);

  const investorProperties = useMemo(() => {
    if (!investor) return [];
    return investor.propertiesInvested.map(inv => {
      const property = appContext.properties.find(p => p.id === inv.propertyId);
      return property ? { ...property, investmentAmount: inv.amount, dateInvested: inv.dateInvested } : null;
    }).filter(Boolean) as Array<Property & { investmentAmount: number; dateInvested?: string }>;
  }, [investor, appContext.properties]);

  const investorSupportRequests = useMemo(() => {
    if (!investor) return [];
    return appContext.supportRequests.filter(req => req.email.toLowerCase() === investor.email.toLowerCase())
        .sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [investor, appContext.supportRequests]);

  const overallFinancials = useMemo(() => {
    if (!investor || !investorProperties.length) return { totalReturns: 0 };
    let totalReturns = 0;
    investorProperties.forEach(prop => {
      const ownershipPercentage = (prop.investmentAmount / prop.investmentGoal) * 100;
      prop.monthlyLedgerData?.forEach(entry => {
        totalReturns += entry.netProfitActual * (ownershipPercentage / 100);
      });
    });
    return { totalReturns };
  }, [investor, investorProperties]);


  if (!investor) {
    return <PageTitle title="Investor Not Found" subtitle="The requested investor could not be located." />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <PageTitle title={investor.name} subtitle={`Investor ID: ${investor.id} | Email: ${investor.email}`} />
        <Link to="/admin/investors" className="text-sm bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Investor List
        </Link>
      </div>

      <Section title="Profile & Contact Information">
        <DetailItem label="Full Name" value={investor.name} />
        <DetailItem label="Email Address" value={investor.email} />
        <DetailItem label="Primary Contact Number" value={investor.phone} />
        <DetailItem label="Alternate Contact Number" value={investor.alternateContactNumber} />
        <DetailItem label="Age" value={investor.age ? `${investor.age} years` : undefined} />
      </Section>

      <Section title="KYC & Bank Details">
        <DetailItem label="Aadhar Number" value={investor.aadharNumber} />
        <DetailItem label="PAN Number" value={investor.panNumber} />
        <DetailItem label="Bank Account Number" value={investor.bankAccountNumber} />
        <DetailItem label="Bank IFSC Code" value={investor.bankIfscCode} />
      </Section>
      
      <Section title="Address Information" gridCols="md:grid-cols-1">
        <DetailItem label="Registered Address" value={investor.registeredAddress} />
      </Section>

      <Section title="Point of Contact (POC)" gridCols="md:grid-cols-3">
        <DetailItem label="POC Name" value={investor.pocName || investor.name} />
        <DetailItem label="POC Email" value={investor.pocEmail || investor.email} />
        <DetailItem label="POC Contact Number" value={investor.pocContactNumber || investor.phone} />
      </Section>

      <Section title="Witness Details (Agreement)" gridCols="md:grid-cols-2">
        <DetailItem label="Witness Name" value={investor.witnessName} />
        <DetailItem label="Witness Designation" value={investor.witnessDesignation} />
        <DetailItem label="Witness Contact No." value={investor.witnessContactNumber} />
        <DetailItem label="Witness Email ID" value={investor.witnessEmailId} />
      </Section>
      
      <div className="mb-8 bg-white p-6 shadow-lg rounded-xl">
        <h3 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-neutral-200">Investment Portfolio</h3>
        <div className="mb-4">
            <p className="text-sm"><strong>Total Capital Invested:</strong> <span className="font-semibold">{formatCurrency(investor.totalInvested)}</span></p>
            <p className="text-sm"><strong>Total Cumulative Returns Received:</strong> <span className="font-semibold text-green-600">{formatCurrency(overallFinancials.totalReturns)}</span></p>
        </div>
        {investorProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                <tr>
                  <th className="py-2 px-3 text-left">Property Name</th>
                  <th className="py-2 px-3 text-left">Date Invested</th>
                  <th className="py-2 px-3 text-right">Amount Invested</th>
                  <th className="py-2 px-3 text-right">Ownership %</th>
                  <th className="py-2 px-3 text-right">Cumulative Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm">
                {investorProperties.map(prop => {
                  const ownershipPercentage = (prop.investmentAmount / prop.investmentGoal) * 100;
                  let cumulativeReturnsForProperty = 0;
                  prop.monthlyLedgerData?.forEach(entry => {
                    cumulativeReturnsForProperty += entry.netProfitActual * (ownershipPercentage / 100);
                  });
                  return (
                    <tr key={prop.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3"><Link to={`/property/${prop.id}`} target="_blank" className="text-primary hover:underline font-medium">{prop.name}</Link></td>
                      <td className="py-2.5 px-3">{formatDate(prop.dateInvested)}</td>
                      <td className="py-2.5 px-3 text-right">{formatCurrency(prop.investmentAmount)}</td>
                      <td className="py-2.5 px-3 text-right">{ownershipPercentage.toFixed(2)}%</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${cumulativeReturnsForProperty >= 0 ? 'text-green-600' : 'text-red-500'}`}>{formatCurrency(cumulativeReturnsForProperty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-500">This investor has no active investments.</p>
        )}
      </div>

      <div className="mb-8 bg-white p-6 shadow-lg rounded-xl">
        <h3 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-neutral-200">Support Request History</h3>
        {investorSupportRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                <tr>
                  <th className="py-2 px-3 text-left">Ticket ID</th>
                  <th className="py-2 px-3 text-left">Date Submitted</th>
                  <th className="py-2 px-3 text-left">Issue Type</th>
                  <th className="py-2 px-3 text-left">Subject/Property</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Admin Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm">
                {investorSupportRequests.map(req => (
                  <tr key={req.id} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 text-primary hover:underline cursor-pointer" onClick={() => alert(`Viewing details for ticket ${req.id} (placeholder for modal)`)}>{req.id.substring(0,15)}...</td>
                    <td className="py-2.5 px-3">{formatDate(req.submittedAt, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5 px-3">{req.issueType}</td>
                    <td className="py-2.5 px-3">{req.subject || req.propertyName || 'N/A'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        req.status === SupportTicketStatus.New ? 'bg-blue-100 text-blue-700' :
                        req.status === SupportTicketStatus.InProgress ? 'bg-yellow-100 text-yellow-700' :
                        req.status === SupportTicketStatus.Resolved ? 'bg-green-100 text-green-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{(req as any).adminComments || 'No comments yet.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-neutral-500">No support requests found for this investor.</p>
        )}
         <div className="mt-4 text-right">
             <button 
                onClick={() => alert("Adding admin comment (placeholder functionality)")}
                className="text-sm bg-secondary text-primary-dark font-medium py-1.5 px-3 rounded-md hover:bg-secondary-dark transition-colors"
            >
                Add Comment to a Ticket
            </button>
         </div>
      </div>

    </div>
  );
};

export default AdminInvestorDetailPage;