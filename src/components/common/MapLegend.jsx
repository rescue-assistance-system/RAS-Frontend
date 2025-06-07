import React from 'react';

const MapLegend = () => {
  return (
    <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-30 text-sm">
      <h4 className="font-bold mb-2">Legend</h4>

      {/* Team Legend */}
      <div className="mb-3">
        <div className="font-semibold mb-1">Rescue Teams:</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Busy (Rescuing)</span> {/* ✅ Gộp chung */}
        </div>
      </div>

      {/* Case Legend */}
      <div>
        <div className="font-semibold mb-1">SOS Cases:</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>⚠️ Pending</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>🔄 Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>🚨 Ready</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
