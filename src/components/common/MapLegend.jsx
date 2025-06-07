import React from 'react';

const MapLegend = () => {
  return (
    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-20">
      <h3 className="text-sm font-semibold mb-2">Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs">Busy</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xs">Rescuing</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
