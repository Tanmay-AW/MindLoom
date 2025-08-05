import React from 'react';
import { Check, X, Calendar } from 'lucide-react';

const DayProgressBar = ({ habitPack }) => {
  if (!habitPack) return null;

  // Default to 21 days if duration is not specified
  const { duration = 21, dailyProgress, currentDay } = habitPack;
  const daysArray = Array.from({ length: duration }, (_, i) => i + 1);

  const getDayStatus = (day) => {
    if (day > currentDay) return 'future';
    if (day === currentDay && dailyProgress.find(p => p.day === day)?.isCompleted) return 'completed';
    if (day < currentDay) {
        const progressForDay = dailyProgress.find(p => p.day === day);
        return (progressForDay && progressForDay.isCompleted) ? 'completed' : 'missed';
    }
    return 'current';
  };

  return (
    <div className="my-8">
        <div className="flex items-center mb-3">
            <Calendar className="mr-2 text-primary-blue" size={20} />
            <h3 className="text-lg font-semibold text-primary-text">Your 21-Day Progress</h3>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center space-x-1 bg-gray-100 p-2 rounded-lg overflow-x-auto">
                {daysArray.map(day => {
                    const status = getDayStatus(day);
                    const isCurrent = day === currentDay;

                    let bgColor = 'bg-gray-300'; // Future days
                    let textColor = 'text-white';
                    let icon = null;
                    
                    if (status === 'current') {
                        bgColor = 'bg-primary-blue';
                        icon = day;
                    }
                    if (status === 'completed') {
                        bgColor = 'bg-accent-green';
                        icon = <Check size={16} />;
                    }
                    if (status === 'missed') {
                        bgColor = 'bg-red-400';
                        icon = <X size={16} />;
                    }

                    return (
                        <div key={day} className="flex-1 text-center min-w-[30px]">
                            <div 
                                className={`w-full h-8 rounded flex items-center justify-center ${textColor} font-bold text-sm transition-all duration-300 ${bgColor} ${isCurrent ? 'scale-110 shadow-lg ring-2 ring-primary-blue ring-opacity-50' : ''}`}
                                title={`Day ${day}: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                            >
                                {icon}
                            </div>
                            {isCurrent && (
                                <div className="text-xs font-semibold text-primary-blue mt-1">Today</div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-accent-green mr-1"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-blue mr-1"></div>
                    <span>Current</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
                    <span>Missed</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                    <span>Future</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DayProgressBar;