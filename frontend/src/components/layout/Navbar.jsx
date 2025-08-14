import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
// --- CHANGE 1: Import the new Avatar components ---
import { Avatar, AvatarImage, AvatarFallback } from '../common/Avatar.jsx';

const NavLink = ({ to, children, className, onClick }) => (
  <Link to={to} className={`transition-colors duration-300 ${className}`} onClick={onClick}>
    {children}
  </Link>
);

// --- CHANGE 2: Add a helper function to get user initials ---
const getInitials = (name) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  const textColorClass = (isHomePage && !isScrolled) ? 'text-white [text-shadow:0_0_6px_rgba(0,0,0,0.5)]' : 'text-gray-800';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    setUserInfo(null);
    navigate('/login');
    setIsOpen(false);
  };

  const navClass = isScrolled 
    ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20' 
    : 'bg-transparent';

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navClass}`}>
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className={`text-2xl font-bold ${textColorClass}`}>MindLoom</Link>

          <div className="hidden md:flex items-center space-x-6">
            {userInfo ? (
              <>
                <NavLink to="/habit-packs" className={`hover:text-teal-500 ${textColorClass}`}>Habit Packs</NavLink>
                <NavLink to="/achievements" className={`hover:text-teal-500 ${textColorClass}`}>Achievements</NavLink>
                <NavLink to="/journal" className={`hover:text-teal-500 ${textColorClass}`}>My Journal</NavLink>
                <NavLink to="/timeline" className={`hover:text-teal-500 ${textColorClass}`}>Timeline</NavLink>
                <NavLink to="/chat" className={`hover:text-teal-500 ${textColorClass}`}>Talk to CalmBot</NavLink>
                
                {/* --- CHANGE 3: Replace ProfileAvatar with the new Avatar component --- */}
                <Link to="/dashboard">
                  <Avatar>
                    {/* The src can be updated later to use a real user image URL */}
                    <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
                    <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                  </Avatar>
                </Link>

                <button onClick={logoutHandler} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-opacity-90">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={`font-semibold hover:text-teal-500 ${textColorClass}`}>Login</NavLink>
                <Link to="/signup"><button className="bg-teal-500 text-white font-semibold py-2 px-5 rounded-full hover:bg-teal-600">Sign Up</button></Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={textColorClass}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-6 pt-24 text-center">
          <nav className="flex flex-col space-y-6 text-2xl text-white">
            {userInfo ? (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/habit-packs" onClick={() => setIsOpen(false)}>Habit Packs</NavLink>
                <NavLink to="/achievements" onClick={() => setIsOpen(false)}>Achievements</NavLink>
                <NavLink to="/journal" onClick={() => setIsOpen(false)}>My Journal</NavLink>
                <NavLink to="/timeline" onClick={() => setIsOpen(false)}>Timeline</NavLink>
                <NavLink to="/chat" className="text-teal-300" onClick={() => setIsOpen(false)}>Talk to CalmBot</NavLink>
                <button onClick={logoutHandler} className="text-orange-400">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setIsOpen(false)}>Login</NavLink>
                <Link to="/signup" onClick={() => setIsOpen(false)}><button className="bg-teal-500 text-white font-semibold py-3 px-6 rounded-full w-full">Sign Up</button></Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
