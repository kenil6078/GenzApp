import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrending, getPopularMovies, getPopularTVShows, searchMulti } from '../services/tmdbApi';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getTrending('all', 'day');
    return data.results;
  } catch (err) {
    return rejectWithValue('Failed to fetch trending');
  }
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async (page = 1, { rejectWithValue }) => {
  try {
    const { data } = await getPopularMovies(page);
    return { results: data.results, page: data.page, totalPages: data.total_pages };
  } catch (err) {
    return rejectWithValue('Failed to fetch popular movies');
  }
});

export const fetchPopularTV = createAsyncThunk('movies/fetchPopularTV', async (page = 1, { rejectWithValue }) => {
  try {
    const { data } = await getPopularTVShows(page);
    return { results: data.results, page: data.page, totalPages: data.total_pages };
  } catch (err) {
    return rejectWithValue('Failed to fetch TV shows');
  }
});

export const searchContent = createAsyncThunk('movies/search', async ({ query, page }, { rejectWithValue }) => {
  try {
    const { data } = await searchMulti(query, page);
    return { results: data.results, page: data.page, totalPages: data.total_pages, query };
  } catch (err) {
    return rejectWithValue('Search failed');
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    popular: { results: [], page: 1, totalPages: 1 },
    popularTV: { results: [], page: 1, totalPages: 1 },
    search: { results: [], page: 1, totalPages: 1, query: '' },
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.search = { results: [], page: 1, totalPages: 1, query: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(fetchPopularMovies.pending, (state) => { state.loading = true; })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.popular.results = action.payload.results;
        } else {
          state.popular.results = [...state.popular.results, ...action.payload.results];
        }
        state.popular.page = action.payload.page;
        state.popular.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(fetchPopularTV.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.popularTV.results = action.payload.results;
        } else {
          state.popularTV.results = [...state.popularTV.results, ...action.payload.results];
        }
        state.popularTV.page = action.payload.page;
        state.popularTV.totalPages = action.payload.totalPages;
      })
      .addCase(searchContent.pending, (state) => { state.searchLoading = true; })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchLoading = false;
        if (action.payload.page === 1) {
          state.search.results = action.payload.results;
        } else {
          state.search.results = [...state.search.results, ...action.payload.results];
        }
        state.search.page = action.payload.page;
        state.search.totalPages = action.payload.totalPages;
        state.search.query = action.payload.query;
      })
      .addCase(searchContent.rejected, (state) => { state.searchLoading = false; });
  },
});

export const { clearSearch } = movieSlice.actions;
export default movieSlice.reducer;
