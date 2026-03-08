import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import movieReducer from '../redux/movieSlice';
import favoriteReducer from '../redux/favoriteSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    favorites: favoriteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
