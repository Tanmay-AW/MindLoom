import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSound } from '../../contexts/SoundContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo, setUserInfo } = useAuth();
  const { isPlaying, isBarVisible, currentSound, togglePlay, playNext, playPrev, pauseSound } = useSound();
  const navigate = useNavigate();

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

  const navClass = isScrolled ? 'bg-white shadow-md text-primary-text' : 'bg-transparent text-white';
  const mobileMenuClass = isScrolled ? 'bg-white text-primary-text' : 'bg-primary-text text-white';

  return (
    <nav className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${navClass}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MindLoom</Link>

        {!isBarVisible && currentSound && (
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={playPrev} className="hover:text-primary-blue"><FaStepBackward /></button>
            <button onClick={togglePlay} className="hover:text-primary-blue text-xl">{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <button onClick={playNext} className="hover:text-primary-blue"><FaStepForward /></button>
            <span className="text-sm font-semibold">{currentSound}</span>
          </div>
        )}

        <div className="hidden md:flex items-center space-x-6">
          {userInfo ? (
            <>
              <Link to="/habit-packs" className="hover:text-primary-blue transition-colors duration-300">Habit Packs</Link>
              <Link to="/achievements" className="hover:text-primary-blue transition-colors duration-300">Achievements</Link>
              <Link to="/chat" className="font-bold text-primary-blue hover:underline transition-colors duration-300">Talk to CalmBot</Link>
              <Link to="/journal" className="hover:text-primary-blue transition-colors duration-300">My Journal</Link>
              <Link to="/timeline" className="hover:text-primary-blue transition-colors duration-300">Timeline</Link>
              <Link to="/dashboard" className="flex items-center space-x-2 hover:text-primary-blue"><User /><span className="font-semibold">{userInfo.name}</span></Link>
              <button onClick={logoutHandler} className="bg-cta-orange text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className={`py-2 px-4 rounded-md border ${isScrolled ? 'border-primary-text' : 'border-white'} hover:bg-primary-text hover:text-white`}>Login</button></Link>
              <Link to="/signup"><button className="bg-cta-orange text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">Sign Up</button></Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
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
