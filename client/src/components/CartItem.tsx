import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../store/slices/cartSlice';
import { useAppDispatch } from '../store/hooks';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }));
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.productId));
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 animate-slide-up">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <span className="mr-2">{item.code}</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 text-gray-700">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleRemove}
          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;