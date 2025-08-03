import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSound } from '../../contexts/SoundContext.jsx';
import ProfileAvatar from '../common/ProfileAvatar.jsx'; // 1. Import the new Avatar component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo, setUserInfo } = useAuth();
  const { isPlaying, isBarVisible, currentSound, togglePlay, playNext, playPrev, pauseSound } = useSound();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  // Your dynamic color logic is preserved
  const textColorClass = (isHomePage && !isScrolled) ? 'text-white' : 'text-primary-text';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    if (isPlaying) pauseSound();
    setUserInfo(null);
    navigate('/login');
  };

  const navClass = isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
  const mobileMenuClass = isScrolled ? 'bg-white text-primary-text' : 'bg-primary-blue text-white';

  return (
    <nav className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${navClass}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${textColorClass}`}>MindLoom</Link>

        {!isBarVisible && currentSound && (
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={playPrev} className={`hover:text-primary-blue ${textColorClass}`}><FaStepBackward /></button>
            <button onClick={togglePlay} className={`hover:text-primary-blue text-xl ${textColorClass}`}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <button onClick={playNext} className={`hover:text-primary-blue ${textColorClass}`}><FaStepForward /></button>
            <span className={`text-sm font-semibold ${textColorClass}`}>{currentSound}</span>
          </div>
        )}

        <div className="hidden md:flex items-center space-x-6">
          {userInfo ? (
            <>
              <Link to="/habit-packs" className={`hover:text-primary-blue transition-colors duration-300 ${textColorClass}`}>Habit Packs</Link>
              <Link to="/achievements" className={`hover:text-primary-blue transition-colors duration-300 ${textColorClass}`}>Achievements</Link>
              <Link to="/chat" className={`font-bold text-primary-blue hover:underline transition-colors duration-300`}>Talk to CalmBot</Link>
              <Link to="/journal" className={`hover:text-primary-blue transition-colors duration-300 ${textColorClass}`}>My Journal</Link>
              <Link to="/timeline" className={`hover:text-primary-blue transition-colors duration-300 ${textColorClass}`}>Timeline</Link>
              
              {/* --- THIS IS THE NEW PART --- */}
              <Link to="/dashboard" className="flex items-center space-x-2">
                <ProfileAvatar name={userInfo.name} />
              </Link>
              {/* --- END OF NEW PART --- */}

              <button onClick={logoutHandler} className="bg-cta-orange text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className={`py-2 px-4 rounded-md border ${isScrolled ? 'border-primary-text' : 'border-white'} hover:bg-primary-text hover:text-white ${textColorClass}`}>Login</button>
              </Link>
              <Link to="/signup">
                <button className="bg-cta-orange text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">Sign Up</button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className={textColorClass}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden shadow-lg mx-2 rounded-lg ${mobileMenuClass}`}>
          <div className="flex flex-col items-start space-y-2 p-4">
            {userInfo ? (
              <>
                <Link to="/habit-packs" className="w-full text-lg p-2 rounded-md">Habit Packs</Link>
                <Link to="/achievements" className="w-full text-lg p-2 rounded-md">Achievements</Link>
                <Link to="/chat" className="w-full text-lg p-2 rounded-md">Talk to CalmBot</Link>
                <Link to="/dashboard" className="w-full text-lg p-2 rounded-md">Dashboard</Link>
                <Link to="/journal" className="w-full text-lg p-2 rounded-md">My Journal</Link>
                <Link to="/timeline" className="w-full text-lg p-2 rounded-md">Timeline</Link>
                <button onClick={logoutHandler} className="w-full text-lg p-2 rounded-md text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-lg p-2 rounded-md">Login</Link>
                <Link to="/signup" className="w-full text-lg p-2 rounded-md">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
