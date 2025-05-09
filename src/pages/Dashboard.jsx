import React, { useEffect, useState } from 'react';
import MapComponent from '../components/admin/MapView';
import sosCoordinatorService from '../services/sos.coordinator.service';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const StatCard = ({ title, mainStat, subStat, color }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 hover:bg-opacity-100 transition-all border-${color}-500`}
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

const SOSCard = ({ sosData }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!sosData?.createdAt) return;

    const calculateTimeLeft = () => {
      const createdAt = new Date(sosData.createdAt);
      const now = new Date();
      const diff = now - createdAt;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [sosData]);

  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
  };

  return (
    <div className="absolute bottom-4 right-5 w-80 max-w-xs bg-white/95 rounded-xl shadow-2xl p-5 flex flex-col gap-3 border border-red-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-red-500">●</span>
          <span className="font-bold text-lg text-red-600">SOS</span>
          <span className="font-bold text-lg text-red-500">
            #{sosData?.id || '---'}
          </span>
        </div>
        <span className="text-gray-500 font-medium">
          {sosData?.location || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>⏰ Waiting time:</span>
        <span className="font-semibold text-black">
          {timeLeft.minutes} min {timeLeft.seconds} sec
        </span>
        <span className="ml-2 text-red-500 text-xs">
          (countdown to 10&apos;)
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>📍 Location:</span>
        <span className="font-semibold text-black">
          {sosData?.latitude && sosData?.longitude
            ? formatCoordinates(sosData.latitude, sosData.longitude)
            : '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>🔥 Severity:</span>
        <span className="font-semibold text-red-500">
          {sosData?.severity || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>👤 Sender:</span>
        <span className="font-semibold text-black">
          {sosData?.sender || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>📝 Description:</span>
        <span className="font-semibold text-black">
          {sosData?.description || '---'}
        </span>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
          ✅ Assign now
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition">
          🗺 View map
        </button>
      </div>
    </div>
  );
};

SOSCard.propTypes = {
  sosData: PropTypes.shape({
    id: PropTypes.string,
    location: PropTypes.string,
    createdAt: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    severity: PropTypes.string,
    sender: PropTypes.string,
    description: PropTypes.string,
  }),
};

const Dashboard = () => {
  const center = [16.0544, 108.2022];
  const zoom = 13;
  const [stats, setStats] = useState([]);
  const [sosData, setSosData] = useState({
    count: 0,
    growth: '',
    latestSOS: null,
  });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sosCoordinatorService.getSosStatistics();
        const rescueTeams =
          await sosCoordinatorService.getAvailableRescueTeams();
        const rescueTeamLocations =
          await sosCoordinatorService.getRescueTeamLocations();

        const mapMarkers = rescueTeamLocations.data.map((team) => ({
          position: [parseFloat(team.latitude), parseFloat(team.longitude)],
          popup: team.name,
          status: team.status,
          color:
            team.status === 'available'
              ? 'green'
              : team.status === 'busy'
                ? 'red'
                : team.status === 'rescuing'
                  ? 'orange'
                  : 'gray',
        }));

        setMarkers(mapMarkers);
        const numberOfRescueTeams = rescueTeams.status.length;
        const { total, pending, completed } = response.status;

        // Giả lập dữ liệu SOS mới nhất (thay thế bằng API thực tế)
        const latestSOS = {
          id: '10345',
          location: 'Hòa Khánh Nam',
          createdAt: new Date().toISOString(),
          latitude: 16.065,
          longitude: 108.213,
          severity: 'Cao',
          sender: 'Nguyễn Văn A',
          description: 'Cháy nhà, người mắc kẹt',
        };

        setSosData({
          count: total,
          growth: '+8% month over month',
          latestSOS,
        });

        setStats([
          {
            title: 'SOS signals',
            mainStat: `${total} request`,
            subStat: '+8% month ',
            color: 'red',
          },
          {
            title: 'Pending SOS',
            mainStat: `${pending} pending`,
            subStat: 'Awaiting response',
            color: 'orange',
          },
          {
            title: 'Completed SOS',
            mainStat: `${completed} completed`,
            subStat: 'Successfully resolved',
            color: 'green',
          },
          {
            title: 'Rescue Teams Available',
            mainStat: `${numberOfRescueTeams} Teams`,
            subStat: '',
            color: 'blue',
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const { socket } = sosCoordinatorService;

    socket.on('case_cancelled', (notification) => {
      console.log('Received notification:', notification);
      alert(notification.message);
      toast.error(notification.message);
    });

    return () => {
      socket.off('case_cancelled');
    };
  }, []);
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const decoded = jwtDecode(accessToken);
    // Tùy backend, userId có thể là decoded.id, decoded.user_id, decoded.sub, ...
    const userId = decoded.id || decoded.user_id || decoded.sub;
    console.log('UserID from token:', userId);
    sosCoordinatorService.registerSocket(userId);
  }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <MapComponent center={center} zoom={zoom} markers={markers} />
      </div>
      <div className="absolute top-100 right-1">
        <SOSCard sosData={sosData.latestSOS} />
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
