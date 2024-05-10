import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Homepage from './components/common/Homepage';
import JobRequest from './components/blast/JobRequest';
import VMStatus from './components/blast/VMStatus';
import DashboardPage from './components/common/DashboardPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ProfilePage from './components/profile/ProfilePage';
import CreditsOffersPage from './components/payment/CreditsOffersPage';
import SuccessPage from './components/payment/SuccessPage';
import CancelledPage from './components/payment/CancelledPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChangePasswordPage from './components/auth/ChangePasswordPage';
import AuthGuard from './components/auth/AuthGuard';
import { ToastContainer, notify } from './utils/notificationUtils';
import { invalidateToken, logoutUserLocally } from './services/userService';
import RecoverPasswordPage from './components/auth/RecoverPassword';
import { fetchUserCredits } from './services/userService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedAuthStatus = !!localStorage.getItem('token');
      setIsAuthenticated(updatedAuthStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const message = sessionStorage.getItem('postLogoutMessage');
    if (message) {
      notify(message, 'error');
      sessionStorage.removeItem('postLogoutMessage');
    }
  }, []);

  // New useEffect for handling credits update
  useEffect(() => {
    const handleCreditsUpdate = async () => {
      if (isAuthenticated) {
        const updatedCredits = await fetchUserCredits();
        setUserCredits(updatedCredits);
      } else {
        setUserCredits(null);
      }
    };

    handleCreditsUpdate();

    // Subscribe to storage event
    window.addEventListener('storage', handleCreditsUpdate);

    return () => {
      window.removeEventListener('storage', handleCreditsUpdate);
    };
  }, [isAuthenticated, location]); // Now this effect depends on both authentication status and location


  const handleLogout = async () => {
    let isTokenInvalid = false; // Flag to check if the token is invalid

    try {
      // Attempt to invalidate the server-side session first
      await invalidateToken();
    } catch (error) {
      console.error('Logout error:', error);
      notify('Logout failed. Please try again.', 'error');
      isTokenInvalid = true;  //  Set the flag to true if the token is invalid
    }

    // Clear local storage
    logoutUserLocally();

    if (isTokenInvalid) {
      sessionStorage.setItem('postLogoutMessage', 'Session expired or token invalid. Please log in again.');
      window.location.href = '/login';  // Redirect to login page
    } else {
      window.location.href = '/';  // Redirect to home page

    }
  };

  return (
    <Router>
      <div className="flex flex-col bg-gray-100 min-h-screen">
        <nav className="bg-blue dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/images/Brand/Brand_hero.webp" className="h-8" alt="BioCloudLabs Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white overflow-hidden text-ellipsis" style={{ maxWidth: '200px' }}>BioCloudLabs</span>
            </a>
            {/*Toggle Button - Adjust the breakpoint for the toggle visibility */}

            <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">

            </div>

            <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
              {/* Move Credits Link Outside of the Button Div for Consistent Visibility */}
              {isAuthenticated ? (
                <Link to="/credits-offers" className="flex items-center mr-4 text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>
                  {userCredits}
                  <object type="image/svg+xml" data="/images/Credits/coin-2159.svg" className="filter w-8 h-8 ml-2" width="32" height="32"></object>
                </Link>
              ) : null}


              <button
                onClick={() => setIsOpen(!isOpen)}
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}>
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>


            {/* User Controls - Improved Styling and Positioning */}
            <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex items-center justify-between w-full lg:w-auto`}>
              <div className="flex items-center space-x-4">
                <ul className="flex flex-col lg:flex-row p-4 lg:p-0 font-medium space-y-4 lg:space-y-0 lg:space-x-8 bg-gray-50 dark:bg-gray-900 lg:bg-transparent rounded-lg lg:rounded-none">                  <li><Link to="/" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Home</Link></li>
                  {isAuthenticated ? (
                    <>
                      <li><Link to="/dashboard" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                      <li><Link to="/vm-request" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Request VM</Link></li>
                      <li><Link to="/profile" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Profile</Link></li>
                      <li><button onClick={handleLogout} className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500">Logout</button></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/login" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Login</Link></li>
                      <li><Link to="/register" className="text-blue-700 hover:text-blue-800 dark:text-white md:dark:hover:text-blue-500" onClick={() => setIsOpen(false)}>Register</Link></li>
                    </>
                  )}
                </ul>
              </div>
            </div>



          </div>
        </nav>

        <div className="flex-grow pt-8">
          <Routes>
            <Route path="/" element={<><Homepage /></>} /> {/* This is the default route, it will render Homepage component when the path is correct */}
            <Route path="/vm-request" element={<ProtectedRoute isAuthenticated={isAuthenticated}><JobRequest /></ProtectedRoute>} />
            <Route path="/vm-status" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VMStatus /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/recoverpassword" element={<RecoverPasswordPage />} />
            <Route path="/credits-offers" element={<CreditsOffersPage />} />
            <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
            <Route path="/success" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SuccessPage /> </ProtectedRoute>} />
            <Route path="/cancelled" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelledPage /> </ProtectedRoute>} />Ç
           
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
