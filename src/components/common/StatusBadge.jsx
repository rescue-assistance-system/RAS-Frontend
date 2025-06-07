import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  let colorClass = '';
  let text = status;

  switch (status) {
    case 'completed':
      colorClass = 'bg-blue-100 text-blue-700 border-blue-300';
      text = 'Completed';
      break;
    case 'cancelled':
      colorClass = 'bg-gray-200 text-gray-700 border-gray-400';
      text = 'Cancelled';
      break;
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
      text = 'Pending';
      break;
    case 'ready':
      colorClass = 'bg-indigo-100 text-indigo-700 border-indigo-300';
      text = 'Ready';
      break;
    case 'accepted':
      colorClass = 'bg-purple-100 text-purple-700 border-purple-300';
      text = 'Accepted';
      break;
    case 'expired':
      colorClass = 'bg-red-100 text-red-700 border-red-300';
      text = 'Expired';
      break;
    case 'safe':
      colorClass = 'bg-green-100 text-green-700 border-green-300';
      text = 'Safe';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-600 border-gray-300';
      text = status;
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}
      style={{ display: 'inline-block', minWidth: 80, textAlign: 'center' }}
    >
      {text}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
