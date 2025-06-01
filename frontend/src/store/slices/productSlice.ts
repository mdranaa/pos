import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import axios from '../../utils/axios';

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stockQty: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/products', product);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (
    { id, productData }: { id: string; productData: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/products/${id}`, productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      
      if (!action.payload) {
        state.filteredProducts = state.products;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredProducts = state.products.filter(
          product => 
            product.name.toLowerCase().includes(query) ||
            product.code.toLowerCase().includes(query)
        );
      }
    },
    updateProductInStore: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        state.filteredProducts = state.products.filter(
          product => 
            product.name.toLowerCase().includes(query) ||
            product.code.toLowerCase().includes(query)
        );
      } else {
        state.filteredProducts = state.products;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          if (
            action.payload.name.toLowerCase().includes(query) ||
            action.payload.code.toLowerCase().includes(query)
          ) {
            state.filteredProducts.push(action.payload);
          }
        } else {
          state.filteredProducts = state.products;
        }
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        
        const filteredIndex = state.filteredProducts.findIndex(p => p.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredProducts[filteredIndex] = action.payload;
        }
      });
  },
});

export const { setSearchQuery, updateProductInStore } = productSlice.actions;

export const selectProducts = (state: RootState) => state.product;

export default productSlice.reducer;