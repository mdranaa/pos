import React, { useEffect } from 'react';
import { BarChart3, Package, ReceiptText, TrendingUp } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProducts, selectProducts } from '../store/slices/productSlice';
import { fetchSales, selectSales } from '../store/slices/saleSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(selectProducts);
  const { sales } = useAppSelector(selectSales);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSales());
  }, [dispatch]);

  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getLowStockProducts = () => {
    return products.filter((product) => product.stockQty < 10);
  };

  const getTopSellingProducts = () => {
    const productSales: Record<string, { count: number; name: string }> = {};
    
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { count: 0, name: item.product.name };
        }
        productSales[item.productId].count += item.quantity;
      });
    });
    
    return Object.entries(productSales)
      .map(([id, { count, name }]) => ({ id, count, name }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <ReceiptText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
              <p className="text-2xl font-semibold text-gray-900">{sales.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Revenue</h2>
              <p className="text-2xl font-semibold text-gray-900">
                ${calculateTotalSales().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Avg. Sale</h2>
              <p className="text-2xl font-semibold text-gray-900">
                ${sales.length ? (calculateTotalSales() / sales.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-5 animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h2>
          {getLowStockProducts().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getLowStockProducts().map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stockQty === 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.stockQty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No low stock products found.</p>
          )}
        </div>
        
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          {getTopSellingProducts().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getTopSellingProducts().map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {product.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No sales data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;