import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addProduct, Product } from '../store/slices/productSlice';

interface ProductFormProps {
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    stockQty: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.code || !formData.price || !formData.stockQty) {
      setError('All fields are required');
      return;
    }

    const price = parseFloat(formData.price);
    const stockQty = parseInt(formData.stockQty, 10);

    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number');
      return;
    }

    if (isNaN(stockQty) || stockQty < 0) {
      setError('Stock quantity must be a non-negative number');
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        addProduct({
          name: formData.name,
          code: formData.code,
          price,
          stockQty,
        })
      ).unwrap();
      onClose();
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Product Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product code"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="stockQty" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQty"
            name="stockQty"
            value={formData.stockQty}
            onChange={handleChange}
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;