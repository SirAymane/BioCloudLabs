import { useEffect, useState } from 'react';  
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Homepage from './components/common/Homepage';
import BlastPage from './components/common/BlastPage';
import DashboardPage from './components/common/DashboardPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import LogoutButton from './components/auth/LogoutButton';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ProfilePage from './components/profile/ProfilePage';
import CreditsOffersPage from './components/payment/CreditsOffersPage';
import SuccessPage from './components/payment/SuccessPage';
import CancelledPage from './components/payment/CancelledPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <div className="nav-left">
            <Link to="/">Home</Link>
            <Link to="/credits-offers">Credits Offers</Link>
            {isAuthenticated && (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/blast">BLAST</Link>
              </>
            )}
          </div>
          <div className="nav-right">
            {isAuthenticated ? (
              <LogoutButton onLogout={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }} />
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/blast" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BlastPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage /></ProtectedRoute>} />
          <Route path="/credits-offers" element={<CreditsOffersPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancelled" element={<CancelledPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
