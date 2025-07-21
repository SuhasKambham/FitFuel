import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import MealLog from './pages/MealLog';
import Calendar from './pages/Calendar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaDumbbell, FaUtensils, FaCalendarAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(15, 15, 35, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>F</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>FitFuel</span>
            </Link>
          </div>

          {/* Navigation Links */}
      {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  ...(isActive('/') 
                    ? { 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      } 
                    : { 
                        color: '#a0aec0',
                        background: 'transparent'
                      })
                }}
                onMouseEnter={e => !isActive('/') && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={e => !isActive('/') && (e.currentTarget.style.background = 'transparent')}
              >
                <FaHome style={{ marginRight: '8px' }} />
                Dashboard
              </Link>
              <Link
                to="/workouts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  ...(isActive('/workouts') 
                    ? { 
                        background: 'rgba(34, 197, 94, 0.1)', 
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      } 
                    : { 
                        color: '#a0aec0',
                        background: 'transparent'
                      })
                }}
                onMouseEnter={e => !isActive('/workouts') && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={e => !isActive('/workouts') && (e.currentTarget.style.background = 'transparent')}
              >
                <FaDumbbell style={{ marginRight: '8px' }} />
                Workouts
              </Link>
              <Link
                to="/meals"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  ...(isActive('/meals') 
                    ? { 
                        background: 'rgba(168, 85, 247, 0.1)', 
                        color: '#a855f7',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      } 
                    : { 
                        color: '#a0aec0',
                        background: 'transparent'
                      })
                }}
                onMouseEnter={e => !isActive('/meals') && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={e => !isActive('/meals') && (e.currentTarget.style.background = 'transparent')}
              >
                <FaUtensils style={{ marginRight: '8px' }} />
                Meals
              </Link>
              <Link
                to="/calendar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  ...(isActive('/calendar') 
                    ? { 
                        background: 'rgba(249, 115, 22, 0.1)', 
                        color: '#f97316',
                        border: '1px solid rgba(249, 115, 22, 0.3)'
                      } 
                    : { 
                        color: '#a0aec0',
                        background: 'transparent'
                      })
                }}
                onMouseEnter={e => !isActive('/calendar') && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={e => !isActive('/calendar') && (e.currentTarget.style.background = 'transparent')}
              >
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                Calendar
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  marginLeft: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  color: '#a0aec0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}
              >
                <FaSignInAlt style={{ marginRight: '8px' }} />
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaUserPlus style={{ marginRight: '8px' }} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <AuthProvider>
    <Router>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><WorkoutLog /></ProtectedRoute>} />
        <Route path="/meals" element={<ProtectedRoute><MealLog /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop 
          closeOnClick 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  </AuthProvider>
);

export default App; 