import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import axios from '../../utils/axios';
import { CartItem } from './cartSlice';

export interface SaleItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

export interface Sale {
  id: string;
  total: number;
  items: SaleItem[];
  createdAt: string;
}

interface SaleState {
  sales: Sale[];
  currentSale: Sale | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SaleState = {
  sales: [],
  currentSale: null,
  isLoading: false,
  error: null,
};

export const fetchSales = createAsyncThunk(
  'sale/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/sales');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales');
    }
  }
);

export const createSale = createAsyncThunk(
  'sale/createSale',
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const saleData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      
      const response = await axios.post('/sales', saleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sale');
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  'sale/fetchSaleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/sales/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sale');
    }
  }
);

const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.isLoading = false;
        state.currentSale = action.payload;
        state.sales.unshift(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSaleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.isLoading = false;
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentSale, addSale } = saleSlice.actions;

export const selectSales = (state: RootState) => state.sale;

export default saleSlice.reducer;