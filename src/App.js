import React, { useState, useEffect } from 'react';

// Mock data for demonstration purposes
const mockInvoices = [
  {
    id: 'INV001',
    supplierName: 'ABC Corp',
    status: 'error',
    errorDetected: 'GSTIN Mismatch',
    explanation: 'The GSTIN provided for ABC Corp does not match the registered GSTIN.',
    suggestedFix: 'Verify the GSTIN with the supplier and update the record.',
    isReviewed: false,
  },
  {
    id: 'INV002',
    supplierName: 'XYZ Ltd',
    status: 'warning',
    errorDetected: 'Invoice Date Format',
    explanation: 'Invoice date is in an unexpected format (DD/MM/YY instead of YYYY-MM-DD).',
    suggestedFix: 'Standardize date format to YYYY-MM-DD.',
    isReviewed: false,
  },
  {
    id: 'INV003',
    supplierName: 'PQR Solutions',
    status: 'clean',
    errorDetected: 'No issues detected',
    explanation: 'This invoice appears to be valid.',
    suggestedFix: '',
    isReviewed: false,
  },
  {
    id: 'INV004',
    supplierName: 'Global Traders',
    status: 'error',
    errorDetected: 'Duplicate Invoice ID',
    explanation: 'This invoice ID (INV004) has been found previously in the uploaded batch.',
    suggestedFix: 'Investigate if this is a legitimate duplicate or an entry error.',
    isReviewed: false,
  },
  {
    id: 'INV005',
    supplierName: 'Tech Innovations',
    status: 'warning',
    errorDetected: 'Missing HSN/SAC Code',
    explanation: 'HSN/SAC code is missing for one or more line items.',
    suggestedFix: 'Add the appropriate HSN/SAC code for all line items.',
    isReviewed: false,
  },
  {
    id: 'INV006',
    supplierName: 'Bright Future',
    status: 'error',
    errorDetected: 'Incorrect Tax Rate',
    explanation: 'The applied GST rate (12%) does not match the standard rate (18%) for the product category.',
    suggestedFix: 'Correct the GST tax rate to the applicable standard rate.',
    isReviewed: false,
  },
  {
    id: 'INV007',
    supplierName: 'Creative Minds',
    status: 'clean',
    errorDetected: 'No issues detected',
    explanation: 'This invoice appears to be valid.',
    suggestedFix: '',
    isReviewed: false,
  },
  {
    id: 'INV008',
    supplierName: 'Digital Edge',
    status: 'warning',
    errorDetected: 'Round-off Difference',
    explanation: 'A minor difference (INR 0.05) detected in the total amount due to rounding.',
    suggestedFix: 'Adjust the total amount to resolve the rounding discrepancy.',
    isReviewed: false,
  },
];

// Main App component
function App() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Simulate fetching data on component mount
  useEffect(() => {
    // In a real application, this would be a fetch call to your backend
    setIsLoading(true);
    setTimeout(() => {
      setInvoices(mockInvoices);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  // Filter invoices based on activeFilter
  useEffect(() => {
    let currentFiltered = [];
    if (activeFilter === 'errors') {
      currentFiltered = invoices.filter(inv => inv.status === 'error');
    } else if (activeFilter === 'warnings') {
      currentFiltered = invoices.filter(inv => inv.status === 'warning');
    } else {
      currentFiltered = invoices;
    }
    setFilteredInvoices(currentFiltered);
  }, [invoices, activeFilter]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsLoading(true);
      // Simulate API call to upload and get validation results
      setTimeout(() => {
        // In a real scenario, you'd parse the file and send it to backend
        // For now, we'll just re-use mock data
        setInvoices([...mockInvoices].sort(() => Math.random() - 0.5)); // Shuffle for a fresh feel
        setIsLoading(false);
        alertUser("File uploaded and validation results loaded!");
      }, 1500);
    }
  };

  // Mark an invoice as reviewed
  const handleMarkAsReviewed = (id) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.id === id ? { ...invoice, isReviewed: !invoice.isReviewed } : invoice
      )
    );
    // If the selected invoice is the one being reviewed, update it
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice(prev => ({ ...prev, isReviewed: !prev.isReviewed }));
    }
  };

  // Handle row click to show details panel
  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPanelOpen(true);
  };

  // Close the detail panel
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedInvoice(null);
  };

  // Simulate export actions
  const handleExportCleaned = () => {
    const cleanedInvoices = invoices.filter(inv => inv.status === 'clean' || inv.isReviewed);
    console.log('Exporting cleaned invoices:', cleanedInvoices);
    alertUser('Cleaned file export initiated!');
  };

  const handleExportSummary = () => {
    console.log('Exporting summary report (PDF)');
    alertUser('Summary report (PDF) export initiated!');
  };

  // Custom alert function instead of window.alert
  const alertUser = (message) => {
    // In a real app, you'd use a state-driven modal or toast notification
    console.log("Alert:", message);
    // For this example, we'll just use a simple console log and a temporary visual cue if needed
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
      document.body.removeChild(alertBox);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          GST Invoice Validator
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Upload your invoices to detect errors, warnings, and get suggestions.
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-grow gap-6">
        {/* Left Section: Upload, Filters, Table */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col">
          {/* Upload Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Invoices</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label htmlFor="file-upload" className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-center">
                <input id="file-upload" type="file" accept=".csv, .xls, .xlsx" onChange={handleFileUpload} className="hidden" />
                Upload CSV/Excel File
              </label>
              <span className="text-gray-500 text-sm truncate">
                {fileName ? `Selected: ${fileName}` : 'No file chosen'}
              </span>
            </div>
            {isLoading && (
              <div className="mt-4 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing file...
              </div>
            )}
          </div>

          {/* Results Table with Filters */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Validation Results</h2>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-4">
              {['all', 'errors', 'warnings'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200
                    ${activeFilter === filter
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} ({invoices.filter(inv => filter === 'all' ? true : inv.status === filter).length})
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1 relative">
              {filteredInvoices.length === 0 && !isLoading ? (
                <div className="text-center text-gray-500 py-10">
                  No invoices to display. Upload a file to get started!
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Error Detected
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleRowClick(invoice)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {invoice.supplierName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${invoice.status === 'error' ? 'bg-red-100 text-red-800' : ''}
                            ${invoice.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${invoice.status === 'clean' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {invoice.errorDetected}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAsReviewed(invoice.id); }}
                            className={`px-3 py-1 rounded-md text-white text-xs font-medium transition-colors duration-200
                              ${invoice.isReviewed ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}
                            `}
                          >
                            {invoice.isReviewed ? 'Unmark' : 'Mark as Reviewed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Invoice Details Panel */}
        <div className={`fixed inset-y-0 right-0 w-full lg:w-1/3 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40
          ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:translate-x-0 lg:shadow-lg lg:rounded-xl lg:p-6 lg:flex-shrink-0 lg:flex lg:flex-col
          ${selectedInvoice ? '' : 'lg:hidden'}`} // Hide panel on larger screens if no invoice selected
        >
          <div className="p-6 lg:p-0 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 border-b pb-4 lg:border-none lg:pb-0">
              <h2 className="text-2xl font-semibold text-gray-800">Invoice Details</h2>
              <button
                onClick={handleClosePanel}
                className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedInvoice ? (
              <div className="flex-1 overflow-y-auto">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Invoice ID</p>
                  <p className="text-lg text-gray-900">{selectedInvoice.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Supplier Name</p>
                  <p className="text-lg text-gray-900">{selectedInvoice.supplierName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
                    ${selectedInvoice.status === 'error' ? 'bg-red-100 text-red-800' : ''}
                    ${selectedInvoice.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedInvoice.status === 'clean' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Error Detected</p>
                  <p className="text-gray-900">{selectedInvoice.errorDetected}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Explanation</p>
                  <p className="text-gray-900">{selectedInvoice.explanation}</p>
                </div>
                {selectedInvoice.suggestedFix && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Suggested Fix</p>
                    <p className="text-gray-900">{selectedInvoice.suggestedFix}</p>
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleMarkAsReviewed(selectedInvoice.id)}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-200
                      ${selectedInvoice.isReviewed ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}
                    `}
                  >
                    {selectedInvoice.isReviewed ? 'Unmark as Reviewed' : 'Mark as Reviewed'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Click on an invoice row to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={handleExportCleaned}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Export Cleaned File
        </button>
        <button
          onClick={handleExportSummary}
          className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Export Summary Report (PDF)
        </button>
      </div>
    </div>
  );
}

export default App;
