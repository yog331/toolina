
import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderTool: React.FC = () => {
  const location = useLocation();
  const toolName = location.pathname.split('/')[1].replace('-', ' ').toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-4xl animate-bounce">
        🏗️
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{toolName}</h2>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          This tool is currently in development and will be available in the next update.
        </p>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="text-orange-500 font-bold hover:underline"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default PlaceholderTool;
