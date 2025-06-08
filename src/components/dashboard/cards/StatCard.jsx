import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, mainStat, subStat, color }) => (
  <div
    className={`bg-white p-10 rounded-lg w-75 shadow-lg backdrop-blur-sm bg-opacity-90 hover:bg-opacity-100 transition-all border-l-1 border-${color}-500`}
  >
    <h3 className={`text-${color}-600 text-lg font-semibold mb-2`}>{title}</h3>
    <div className="flex flex-col space-y-1">
      <span className={`text-2xl font-bold text-${color}-600`}>{mainStat}</span>
      {subStat && <span className="text-sm text-gray-500">{subStat}</span>}
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  mainStat: PropTypes.string.isRequired,
  subStat: PropTypes.string,
  color: PropTypes.string.isRequired,
};

export default StatCard;
