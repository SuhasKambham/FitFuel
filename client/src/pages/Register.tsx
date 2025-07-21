import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { register as registerApi } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await registerApi(name, email, password);
      login(data.token);
      setLoading(false);
      navigate('/');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            FitFuel
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            color: '#a0aec0',
            margin: 0,
            fontWeight: '400',
            lineHeight: '1.5'
          }}>
            Create your account
          </p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: 'clamp(24px, 5vw, 40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Name Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px'
              }}>
                Full Name
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaUser style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#718096',
                  fontSize: '16px',
                  zIndex: 1
                }} />
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px'
              }}>
                Email
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#718096',
                  fontSize: '16px',
                  zIndex: 1
                }} />
                <input
                  type="email"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#718096',
                  fontSize: '16px',
                  zIndex: 1
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#718096',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a0aec0'}
                  onMouseLeave={e => e.currentTarget.style.color = '#718096'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px'
              }}>
                Confirm Password
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#718096',
                  fontSize: '16px',
                  zIndex: 1
                }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#718096',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a0aec0'}
                  onMouseLeave={e => e.currentTarget.style.color = '#718096'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  padding: '16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#4a5568' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                marginTop: '8px'
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
          </button>
        </form>

          {/* Sign In Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '32px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <p style={{
              color: '#a0aec0',
              margin: '0 0 20px 0',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              Already have an account?
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#3b82f6',
                textDecoration: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '32px'
          }}
        >
          <p style={{
            color: '#718096',
            fontSize: '13px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Start your fitness journey with FitFuel
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #718096;
        }
        
        @media (max-width: 480px) {
          .register-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register; 