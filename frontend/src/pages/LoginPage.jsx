import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff } from 'lucide-react'; // Import eye icons
import heroImage from '../assets/images/hero-image.webp';
import API from '../api';
import { useAuth } from '../contexts/AuthContext.jsx';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const { setUserInfo } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/users/login', formData);
      setUserInfo(data);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
          <h2 className="text-3xl font-bold text-primary-text mb-2">Welcome Back</h2>
          <p className="text-primary-text text-opacity-70 mb-8">
            Log in to continue your journey with MindLoom.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Google Log In Button */}
            <button type="button" >
              <a href="http://localhost:5000/api/users/google" className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50">
                <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-3" />
                Log in with Google
              </a>
            </button>

            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-text">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition-all"
                placeholder="you@example.com"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-text">Password</label>
              {/* Password container with relative positioning */}
              <div className="relative mt-1">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className="block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition-all"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                />
                {/* Toggle button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cta-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta-orange transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-primary-text text-opacity-70">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-blue hover:underline">
              Sign up
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

export default LoginPage;