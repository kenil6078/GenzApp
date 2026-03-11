import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './app/store';
import { fetchProfile } from './redux/userSlice';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Movies from './pages/Movies/Movies';
import TVShows from './pages/TVShows/TVShows';
import People from './pages/People/People';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import PersonDetails from './pages/PersonDetails/PersonDetails';
import Search from './pages/Search/Search';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Favorites from './pages/Favorites/Favorites';
import WatchHistory from './pages/WatchHistory/WatchHistory';
import Admin from './pages/Admin/Admin';
import { Loader } from './components/Loader/Loader';

const ProtectedRoute = ({ children, adminRequired }) => {
  const { userInfo, isInitialized, loading } = useSelector((state) => state.user);

  // Wait for the initial profile fetch to complete
  if (!isInitialized || loading) {
    return <Loader fullScreen />;
  }

  if (!userInfo) return <Navigate to="/login" replace />;
  if (adminRequired && userInfo.role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};

const GuestRoute = ({ children }) => {
  const { userInfo, isInitialized, loading } = useSelector((state) => state.user);

  if (!isInitialized || loading) {
    return <Loader fullScreen />;
  }

  // If user is already logged in, they shouldn't be at login/signup pages
  if (userInfo) return <Navigate to="/" replace />;

  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Don't render routes until we've checked if the user is logged in
  if (!isInitialized) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/tv" element={<ProtectedRoute><TVShows /></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
        <Route path="/tv/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
        <Route path="/person/:id" element={<ProtectedRoute><PersonDetails /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route
          path="/favorites"
          element={<ProtectedRoute><Favorites /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><WatchHistory /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute adminRequired><Admin /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
