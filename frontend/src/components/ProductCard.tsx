import React from 'react';
import { Package } from 'lucide-react';
import { Product } from '../store/slices/productSlice';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        code: product.code,
        price: product.price,
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="ml-2 font-medium text-gray-900">{product.name}</h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.code}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <span
          className={`text-sm ${
            product.stockQty > 10
              ? 'text-green-600'
              : product.stockQty > 0
              ? 'text-orange-500'
              : 'text-red-600'
          }`}
        >
          Stock: {product.stockQty}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stockQty <= 0}
        className={`mt-3 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          product.stockQty > 0
            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;