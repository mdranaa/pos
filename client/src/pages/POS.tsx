import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, XCircle, CreditCard } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProducts, setSearchQuery, selectProducts } from '../store/slices/productSlice';
import { selectCart, clearCart } from '../store/slices/cartSlice';
import { createSale, selectSales } from '../store/slices/saleSlice';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import SaleReceipt from '../components/SaleReceipt';
import toast from 'react-hot-toast';
import socket from '../utils/socket';
import { updateProductInStore } from '../store/slices/productSlice';

const POS: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, searchQuery, isLoading } = useAppSelector(selectProducts);
  const { items, total } = useAppSelector(selectCart);
  const { currentSale, isLoading: saleLoading, error: saleError } = useAppSelector(selectSales);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());

    // Socket connection for real-time updates
    socket.on('productUpdate', (updatedProduct) => {
      dispatch(updateProductInStore(updatedProduct));
    });

    return () => {
      socket.off('productUpdate');
    };
  }, [dispatch]);

  useEffect(() => {
    if (saleError) {
      toast.error(saleError);
    }
  }, [saleError]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty. Add products before checkout.');
      return;
    }

    dispatch(createSale(items))
      .unwrap()
      .then(() => {
        setCheckoutComplete(true);
        toast.success('Sale completed successfully!');
      })
      .catch((error) => {
        toast.error(`Checkout failed: ${error}`);
      });
  };

  const handleNewSale = () => {
    dispatch(clearCart());
    setCheckoutComplete(false);
  };

  if (checkoutComplete && currentSale) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sale Complete</h1>
          <button
            onClick={handleNewSale}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Sale
          </button>
        </div>
        <SaleReceipt sale={currentSale} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row md:space-x-6">
      {/* Left Side - Products */}
      <div className="w-full md:w-2/3 mb-6 md:mb-0 flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products by name or code..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 h-40 rounded-md animate-pulse-subtle"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : 'No products available.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h2 className="ml-2 text-lg font-semibold text-gray-900">Shopping Cart</h2>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {items.length > 0 ? (
            items.map((item) => <CartItem key={item.productId} item={item} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Cart is empty. Add products to get started.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Total:</span>
            <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || saleLoading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {saleLoading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;