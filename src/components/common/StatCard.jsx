import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, mainStat, subStat, color, icon }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 ${
      color === 'red'
        ? 'border-red-400'
        : color === 'orange'
          ? 'border-orange-400'
          : color === 'green'
            ? 'border-green-400'
            : color === 'blue'
              ? 'border-blue-400'
              : 'border-gray-300'
    }`}
  >
    <div className="flex-1 flex flex-col items-center justify-center">
      <div
        className={`text-base font-semibold mb-1 ${
          color === 'red'
            ? 'text-red-500'
            : color === 'orange'
              ? 'text-orange-500'
              : color === 'green'
                ? 'text-green-500'
                : color === 'blue'
                  ? 'text-blue-500'
                  : 'text-gray-700'
        }`}
      >
        {title}
      </div>
      <div
        className={`text-3xl font-bold mb-1 ${
          color === 'red'
            ? 'text-red-600'
            : color === 'orange'
              ? 'text-orange-600'
              : color === 'green'
                ? 'text-green-600'
                : color === 'blue'
                  ? 'text-blue-600'
                  : 'text-gray-800'
        }`}
      >
        {mainStat}
      </div>
      {subStat && <div className="text-sm text-gray-400">{subStat}</div>}
    </div>
    <div className="text-4xl">{icon}</div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  mainStat: PropTypes.string.isRequired,
  subStat: PropTypes.string,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default StatCard;
