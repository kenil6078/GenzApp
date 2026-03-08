import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addFavorite, getFavorites, removeFavorite } from '../services/authApi';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getFavorites();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
  }
});

export const addToFavorites = createAsyncThunk('favorites/add', async (movieData, { rejectWithValue }) => {
  try {
    const { data } = await addFavorite(movieData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
  }
});

export const removeFromFavorites = createAsyncThunk('favorites/remove', async (tmdbId, { rejectWithValue }) => {
  try {
    await removeFavorite(tmdbId);
    return tmdbId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove favorite');
  }
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.tmdbId !== Number(action.payload));
      });
  },
});

export default favoriteSlice.reducer;
