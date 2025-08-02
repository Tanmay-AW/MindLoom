import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; // Import the X icon
import heroImage from '../assets/images/hero-image.jpg';
import API from '../api';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import the useAuth hook

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAuth(); // Get the setUserInfo function from our context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/users/register', formData);
      
      // --- THIS IS THE NEW PART ---
      // After successful signup, save the user info to our global state
      setUserInfo(data);
      // --- END OF NEW PART ---
      
      setLoading(false);
      navigate('/'); 

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
         <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-primary-text transition-colors z-10">
          <X size={28} />
        </Link>
        
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-primary-text mb-2">Create Your Account</h2>
          <p className="text-primary-text text-opacity-70 mb-8">
            Start your journey with MindLoom today.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-text">Name</label>
              <input 
                type="text" 
                id="name" 
                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition-all"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
              />
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
              <input 
                type="password" 
                id="password" 
                className="mt-1 block w-full px-4 py-3 bg-gray-100 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition-all"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cta-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta-orange transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-primary-text text-opacity-70">
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
