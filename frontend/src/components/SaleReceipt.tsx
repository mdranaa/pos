import React from 'react';
import { Download, Printer } from 'lucide-react';

interface Product {
  name: string;
  code: string;
}

interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Sale {
  id: string;
  createdAt: string;
  total: number;
  items: SaleItem[];
}

interface SaleReceiptProps {
  sale: Sale;
}

const SaleReceipt: React.FC<SaleReceiptProps> = ({ sale }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handlePrint = () => {
    window.print();
  };

  // Alternative PDF generation using HTML to Canvas approach
  const generatePDF = () => {
    // Create a new window with the receipt content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0;
            color: #333;
          }
          .receipt-info {
            margin-bottom: 20px;
          }
          .receipt-info p {
            margin: 5px 0;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .total-section {
            margin-top: 20px;
            text-align: right;
          }
          .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sales Receipt</h1>
        </div>

        <div class="receipt-info">
          <p><strong>Receipt #:</strong> ${sale.id.slice(-8)}</p>
          <p><strong>Date:</strong> ${formatDate(sale.createdAt)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Code</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items
              .map(
                (item) => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.product.code}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">$${item.subtotal.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="total-section">
          <p class="total-amount">Total: $${sale.total.toFixed(2)}</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  // Simple CSV download as an alternative
  const downloadCSV = () => {
    const csvContent = [
      ['Sales Receipt'],
      ['Receipt #', sale.id.slice(-8)],
      ['Date', formatDate(sale.createdAt)],
      [''],
      ['Item', 'Code', 'Quantity', 'Price', 'Subtotal'],
      ...sale.items.map((item) => [
        item.product.name,
        item.product.code,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`
      ]),
      [''],
      ['Total', '', '', '', `$${sale.total.toFixed(2)}`]
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${sale.id.slice(-8)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
      <div className="flex justify-between items-start mb-6 print:mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales Receipt</h2>
          <p className="text-sm text-gray-500">
            Receipt #: {sale.id.slice(-8)}
          </p>
        </div>
        <div className="flex space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print
          </button>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            title="Print to PDF"
          >
            <Download className="h-4 w-4 mr-1.5" />
            PDF
          </button>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            title="Download as CSV"
          >
            <Download className="h-4 w-4 mr-1.5" />
            CSV
          </button>
        </div>
      </div>

      <div className="mb-6 print:mb-4">
        <p className="text-sm text-gray-500">
          Date: {formatDate(sale.createdAt)}
        </p>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-4 print:mb-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Qty
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.product.name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.product.code}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                  {item.quantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">
            ${sale.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;
