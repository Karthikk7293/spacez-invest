
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../App';
import PageTitle from '../../components/PageTitle';
import { SupportRequest, SupportTicketStatus, SupportTicketIssueType } from '../../types';
import { THEME_COLORS } from '../../constants';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const getStatusColor = (status: SupportTicketStatus) => {
  switch (status) {
    case SupportTicketStatus.New: return 'bg-blue-100 text-blue-700 border-blue-300 focus:ring-blue-500';
    case SupportTicketStatus.InProgress: return 'bg-yellow-100 text-yellow-700 border-yellow-300 focus:ring-yellow-500';
    case SupportTicketStatus.Resolved: return 'bg-green-100 text-green-700 border-green-300 focus:ring-green-500';
    case SupportTicketStatus.Closed: return 'bg-neutral-100 text-neutral-600 border-neutral-300 focus:ring-neutral-500';
    default: return 'bg-gray-100 text-gray-700';
  }
};

interface SupportRequestDetailModalProps {
  request: SupportRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (requestId: string, newStatus: SupportTicketStatus) => void;
}

const SupportRequestDetailModal: React.FC<SupportRequestDetailModalProps> = ({ request, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen) return null;

  const [currentStatus, setCurrentStatus] = useState(request.status);

  const handleStatusUpdate = () => {
    onUpdateStatus(request.id, currentStatus);
    // Optionally, close modal or show success message within modal
    // onClose(); // Or keep open to see change reflected / further changes
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl transform transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">Support Request Details</h2>
            <p className="text-sm text-neutral-500">Ticket ID: {request.id}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p><strong>Requester:</strong> {request.name} (<a href={`mailto:${request.email}`} className="text-primary hover:underline">{request.email}</a>) {request.phone && `| Phone: ${request.phone}`}</p>
          <p><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
          <p><strong>Issue Type:</strong> <span className="font-medium">{request.issueType}</span></p>
          {request.propertyName && <p><strong>Related Property:</strong> <Link to={`/property/${request.propertyId}`} target="_blank" className="text-primary hover:underline">{request.propertyName}</Link></p>}
          {request.subject && <p><strong>Subject / Report Period:</strong> {request.subject}</p>}
          
          <div className="mt-2">
            <p className="font-medium text-neutral-600 mb-1">Message:</p>
            <p className="text-sm text-neutral-700 whitespace-pre-wrap bg-neutral-50 p-3 rounded-md border max-h-60 overflow-y-auto">{request.message}</p>
          </div>

          <div className="mt-4 pt-4 border-t">
            <label htmlFor="status-update" className="block text-sm font-medium text-neutral-700 mb-1">Update Status:</label>
            <div className="flex items-center gap-3">
              <select 
                id="status-update"
                value={currentStatus} 
                onChange={(e) => setCurrentStatus(e.target.value as SupportTicketStatus)}
                className={`flex-grow p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 text-sm ${getStatusColor(currentStatus)}`}
              >
                {Object.values(SupportTicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                onClick={handleStatusUpdate}
                className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                disabled={currentStatus === request.status}
              >
                Update
              </button>
            </div>
          </div>
        </div>
         <button onClick={onClose} className="mt-6 w-full text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2.5 rounded-md text-sm font-medium transition-colors">
            Close Details
        </button>
      </div>
    </div>
  );
};


const AdminSupportRequestsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { supportRequests, updateSupportRequestStatus } = appContext;

  const [filterStatus, setFilterStatus] = useState<SupportTicketStatus | 'All'>('All');
  const [filterIssueType, setFilterIssueType] = useState<SupportTicketIssueType | 'All' | 'General Contact'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingRequest, setViewingRequest] = useState<SupportRequest | null>(null);


  const filteredRequests = useMemo(() => {
    return supportRequests
      .filter(req => {
        const statusMatch = filterStatus === 'All' || req.status === filterStatus;
        const issueTypeMatch = filterIssueType === 'All' || req.issueType === filterIssueType;
        const searchMatch = searchTerm === '' ||
          req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.subject && req.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
          req.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.propertyName && req.propertyName.toLowerCase().includes(searchTerm.toLowerCase()));
        return statusMatch && issueTypeMatch && searchMatch;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [supportRequests, filterStatus, filterIssueType, searchTerm]);

  const handleStatusChange = (requestId: string, newStatus: SupportTicketStatus) => {
    updateSupportRequestStatus(requestId, newStatus);
     // If the currently viewed request's status is updated, refresh its data in the modal
    if (viewingRequest && viewingRequest.id === requestId) {
        setViewingRequest(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };
  
  const allIssueTypes: (SupportTicketIssueType | 'General Contact')[] = ['General Contact', ...Object.values(SupportTicketIssueType)];


  return (
    <div>
      <PageTitle title="Support Requests" subtitle={`Manage and track ${filteredRequests.length} user inquiries.`} />

      <div className={`mb-6 p-4 bg-white shadow rounded-lg flex flex-col md:flex-row gap-4 items-center`}>
        <input
          type="text"
          placeholder="Search by name, email, subject, message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-grow w-full md:w-1/3 p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow`}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as SupportTicketStatus | 'All')}
          className={`w-full md:w-auto p-3.5 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm bg-white transition-shadow`}
        >
          <option value="All">All Statuses</option>
          {Object.values(SupportTicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterIssueType}
          onChange={(e) => setFilterIssueType(e.target.value as SupportTicketIssueType | 'All' | 'General Contact')}
          className={`w-full md:w-auto p-3.5 border border-neutral-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm bg-white transition-shadow`}
        >
          <option value="All">All Issue Types</option>
          {allIssueTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {filteredRequests.length > 0 ? (
        <div className={`bg-white shadow-xl rounded-lg overflow-x-auto`}>
          <table className="w-full min-w-[900px]"> {/* Ensure min-width for better layout */}
            <thead className={`bg-neutral-50 border-b-2 border-neutral-200`}>
              <tr>
                {['Requester', 'Contact', 'Issue Type', 'Subject/Property', 'Submitted', 'Status', 'Actions'].map(header => (
                  <th key={header} className="py-3 px-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-neutral-700 font-medium">{req.name}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600">
                    <a href={`mailto:${req.email}`} className="text-primary hover:underline">{req.email}</a>
                    {req.phone && <span className="block text-xs text-neutral-500">{req.phone}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600">{req.issueType}</td>
                  <td className="py-3.5 px-4 text-sm text-neutral-600">
                    {req.subject || (req.propertyName ? 
                        <Link to={`/property/${req.propertyId}`} target="_blank" className="text-primary hover:underline">
                            {req.propertyName}
                        </Link> 
                        : 'N/A')}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-neutral-500">{formatDate(req.submittedAt)}</td>
                  <td className="py-3.5 px-4 text-sm">
                    <select 
                        value={req.status} 
                        onChange={(e) => handleStatusChange(req.id, e.target.value as SupportTicketStatus)}
                        className={`p-1.5 text-xs font-medium rounded-md border focus:ring-2 focus:ring-opacity-50 transition-colors ${getStatusColor(req.status)}`}
                    >
                        {Object.values(SupportTicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-sm">
                    <button
                      onClick={() => setViewingRequest(req)}
                      className={`text-primary hover:underline font-medium`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`text-center py-12 bg-white shadow rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-neutral-400 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91A2.25 2.25 0 011.07 7.072V6.75" />
          </svg>
          <p className={`text-neutral-500 text-lg`}>No support requests found.</p>
          {supportRequests.length > 0 && <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters.</p>}
        </div>
      )}
      {viewingRequest && (
        <SupportRequestDetailModal 
            request={viewingRequest}
            isOpen={!!viewingRequest}
            onClose={() => setViewingRequest(null)}
            onUpdateStatus={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AdminSupportRequestsPage;
      