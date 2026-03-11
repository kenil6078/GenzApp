import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, getUserProfile, logoutUser } from '../services/authApi';

export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await loginUser(credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const signup = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await signupUser(userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getUserProfile();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    await logoutUser();
    return null;
  } catch (err) {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    isInitialized: false, // Added to track if we've attempted to fetch the profile on load
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, rejected)
      .addCase(signup.pending, pending)
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(signup.rejected, rejected)
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.isInitialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isInitialized = true;
      })
      .addCase(logout.rejected, (state) => {
        state.userInfo = null;
        state.isInitialized = true;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
