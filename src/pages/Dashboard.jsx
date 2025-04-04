import React from 'react';
import MapComponent from '../components/admin/MapView';

const StatCard = ({ title, mainStat, subStat, color }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 hover:bg-opacity-100 transition-all  border-${color}-500`}
  >
    <h3 className={`text-${color}-600 text-lg font-semibold mb-1`}>{title}</h3>
    <div className="flex items-baseline">
      <span className={`text-2xl font-bold mr-1 text-${color}-600`}>
        {mainStat}
      </span>
      {subStat && <span className="text-sm text-gray-500">{subStat}</span>}
    </div>
  </div>
);

const Dashboard = () => {
  const center = [16.0544, 108.2022]; // Đà Nẵng coordinates
  const zoom = 13;

  const markers = [
    {
      position: [16.0544, 108.2022],
      popupText: 'Location: 123 Nguyen Dinh Chieu, Ngu Hanh Son, Danang',
      time: '13:00 am (20s ago)',
      type: 'Storm and Flood',
      status: 'SOS request',
    },
  ];

  const stats = [
    {
      title: 'SOS signals',
      mainStat: '10,053 request',
      subStat: '+8% month over month',
      color: 'red',
    },
    {
      title: 'Rescuing Process',
      mainStat: '5 is in rescue',
      subStat: '+8% month over month',
      color: 'orange',
    },
    {
      title: 'End Users',
      mainStat: '400 Users',
      subStat: '250 Users online',
      color: 'green',
    },
    {
      title: 'Rescue Teams',
      mainStat: '50 Teams',
      subStat: '+20 Rescue Teams ready',
      color: 'blue',
    },
  ];

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <MapComponent center={center} zoom={zoom} markers={markers} />
      </div>
      <div className="absolute inset-x-32 bottom-25 px-4 z-[1000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
