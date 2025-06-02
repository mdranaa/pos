import React, { useEffect } from 'react';
import { ReceiptText, Download, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchSales, selectSales, fetchSaleById } from '../store/slices/saleSlice';
import SaleReceipt from '../components/SaleReceipt';
import socket from '../utils/socket';
import { addSale } from '../store/slices/saleSlice';

const Sales: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sales, currentSale, isLoading } = useAppSelector(selectSales);
  
  useEffect(() => {
    dispatch(fetchSales());
    
    // Socket connection for real-time updates
    socket.on('saleCreated', (newSale) => {
      dispatch(addSale(newSale));
    });
    
    return () => {
      socket.off('saleCreated');
    };
  }, [dispatch]);
  
  const handleViewReceipt = (id: string) => {
    dispatch(fetchSaleById(id));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales History</h1>
      
      {currentSale ? (
        <div className="mb-6">
          <button
            onClick={() => dispatch({ type: 'sale/clearCurrentSale' })}
            className="mb-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Sales List
          </button>
          
          <SaleReceipt sale={currentSale} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-pulse-subtle flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md">
                            <ReceiptText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {sale.id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(sale.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReceipt(sale.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No sales records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;