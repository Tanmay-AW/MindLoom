import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, AlertCircle, Eye, EyeOff } from 'lucide-react'; // Added Eye icons
import heroImage from '../assets/images/hero-image.webp';
import API from '../api';
import { useAuth } from '../contexts/AuthContext.jsx';

// --- Password Strength Meter Component (Unchanged) ---
const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' });

  useEffect(() => {
    let score = 0;
    let text = 'Weak';
    let color = 'bg-red-500';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score > 4) {
      text = 'Very Strong';
      color = 'bg-green-500';
    } else if (score > 3) {
      text = 'Strong';
      color = 'bg-green-400';
    } else if (score > 2) {
      text = 'Medium';
      color = 'bg-yellow-500';
    }

    if (password.length === 0) {
        setStrength({ score: 0, text: '', color: '' });
    } else {
        setStrength({ score, text, color });
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">{strength.text}</p>
    </div>
  );
};


const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password toggle
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await API.post('/users/send-otp', { email: formData.email });
      setMessage('Code sent!');
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  // --- FINAL FIX: Simplified handleSubmit function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Now we send all data to the single /register endpoint
      const { data } = await API.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp, // Include the OTP in the request
      });
      
      setUserInfo(data);
      navigate('/dashboard'); // Redirect to dashboard on success

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-primary-text transition-colors z-10">
          <X size={28} />
        </Link>
        
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-primary-text mb-2">Create Your Account</h2>
          <p className="text-primary-text text-opacity-70 mb-8">
            Start your journey with MindLoom today.
          </p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Google Sign Up Button */}
            <a href="http://localhost:5000/api/users/google" className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50">
              <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-3" />
              Sign up with Google
            </a>

            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">or with Email</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-text">Name</label>
              <input 
                type="text" 
                id="name" 
                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-text">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="you@example.com"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            {/* OTP Field */}
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-primary-text">Verification Code</label>
                <div className="flex space-x-2 mt-1">
                    <input 
                        type="text" 
                        id="otp" 
                        className="block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                        placeholder="Enter 6-digit code"
                        onChange={handleChange}
                        value={formData.otp}
                    />
                    <button 
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-opacity-90 disabled:opacity-50"
                        disabled={loading || otpSent}
                    >
                        {otpSent ? 'Sent!' : 'Send Code'}
                    </button>
                </div>
                {message && <p className="text-green-600 text-sm mt-1">{message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-text">Password</label>
              <div className="relative mt-1">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  className="block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Create your password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
            </div>
            
            {error && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{error}</p>}

            {/* Final Submit Button */}
            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cta-orange hover:bg-opacity-90 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-primary-text text-opacity-70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-blue hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div 
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
