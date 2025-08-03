import React from 'react';

// A simple function to get initials from a name
const getInitials = (name = '') => {
  const words = name.split(' ');
  if (words.length > 1) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// A simple hash function to get a consistent color for a user
const nameToColor = (name = '') => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
  ];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const ProfileAvatar = ({ name }) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${nameToColor(name)}`}>
      {getInitials(name)}
    </div>
  );
};

export default ProfileAvatar;
