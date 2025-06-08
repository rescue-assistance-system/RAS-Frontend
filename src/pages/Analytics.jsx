import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import analyticsService from '../services/analytics.service';
import {
  FaClipboardList,
  FaUsers,
  FaStopwatch,
  FaUserClock,
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 5 },
      grid: { color: '#f3f4f6' },
    },
    x: {
      grid: { color: '#f3f4f6' },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
  },
};

const stats = [
  {
    value: '24.15M',
    label: 'Overall Visitor',
    change: '+2.43%',
    color: 'text-blue-500',
  },
  {
    value: '12:38',
    label: 'Visitor Duration',
    change: '+12.65%',
    color: 'text-green-500',
  },
  {
    value: '639.82',
    label: 'Pages/Visit',
    change: '+5.62%',
    color: 'text-indigo-500',
  },
];

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sosStats, setSosStats] = useState([]);
  const [caseReportStats, setCaseReportStats] = useState(null);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getDashboard();
        setDashboard(res.data);
        setError(null);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchSosStats = async () => {
      try {
        const res = await analyticsService.getSosStats();
        setSosStats(res.data || []);
      } catch {
        setSosStats([]);
      }
    };
    fetchSosStats();
  }, []);

  useEffect(() => {
    const fetchCaseReportStats = async () => {
      try {
        const res = await analyticsService.getCaseReportStats();
        setCaseReportStats(res.data);
      } catch {
        setCaseReportStats(null);
      }
    };
    fetchCaseReportStats();
  }, []);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await analyticsService.getLocationData();
        setLocationData(res.data|| []);
        console.log('API locationData:', res.data);
      } catch {
        setLocationData([]);
      }
    };
    fetchLocationData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!dashboard) return null;

  // Map API data to UI
  const {
    currentCaseReportCount,
    averageResponseTime,
    availableTeams,
    busyTeams,
    slowestTeam,
    slowestCase,
  } = dashboard;

  // Cards data
  const cards = [
    {
      label: 'Total Case Reports',
      value: currentCaseReportCount?.total ?? '-',
      sub: `${currentCaseReportCount?.completed ?? 0} Completed`,
      color: 'blue',
      icon: <FaClipboardList className="text-blue-600" />,
    },
    {
      label: 'Rescue Teams Available',
      value: availableTeams ?? '-',
      sub: `${busyTeams ?? 0} Busy`,
      color: 'pink',
      icon: <FaUsers className="text-violet-500" />,
    },
    {
      label: 'Average Response Time',
      value: averageResponseTime
        ? `${averageResponseTime.value} ${averageResponseTime.unit}`
        : '-',
      sub: slowestTeam ? `Slowest: ${slowestTeam.teamName}` : '',
      color: 'green',
      icon: <FaStopwatch className="text-green-500" />,
    },
    {
      label: 'Slowest Case',
      value: slowestCase
        ? `${slowestCase.responseTime} ${slowestCase.unit}`
        : '-',
      sub: slowestCase ? `Case #${slowestCase.caseId}` : '',
      color: 'yellow',
      icon: <FaUserClock className="text-yellow-500" />,
    },
  ];

 
  const now = new Date();
  const currentMonthIdx = now.getMonth(); 
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].slice(0, currentMonthIdx + 1); 
  const statsByMonth = {};
  sosStats.forEach((item) => {
    statsByMonth[item.month] = item;
  });
  const completedData = months.map((m) => statsByMonth[m]?.completed || 0);
  const cancelledData = months.map((m) => statsByMonth[m]?.cancelled || 0);

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Completed',
        data: completedData,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: 'Cancelled',
        data: cancelledData,
        backgroundColor: '#fbbf24',
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const totalStatus = sosStats.reduce(
    (acc, item) => {
      acc.completed += item.completed || 0;
      acc.cancelled += item.cancelled || 0;
      acc.pending += item.pending || 0;
      acc.expired += item.expired || 0;
      acc.ready += item.ready || 0;
      acc.safe += item.safe || 0;
      return acc;
    },
    { completed: 0, cancelled: 0, pending: 0, expired: 0, ready: 0, safe: 0 },
  );

  const doughnutData = {
    labels: ['Completed', 'Cancelled', 'Pending', 'Expired', 'Safe', 'Ready'],
    datasets: [
      {
        label: 'Case Status',
        data: [
          totalStatus.completed,
          totalStatus.cancelled,
          totalStatus.pending,
          totalStatus.expired,
          totalStatus.safe,
          totalStatus.ready,
        ],
        backgroundColor: [
          '#3b82f6', // Completed - blue
          '#fbbf24', // Cancelled - yellow
          '#f97316', // Pending - orange
          '#ef4444', // Expired - red
          '#22c55e', // Safe - green
          '#6366f1', // Ready - indigo
        ],
        borderWidth: 1,
      },
    ],
  };

  const topN = 3;
  const sortedLocations = [...locationData].sort((a, b) => (b.count || 0) - (a.count || 0));
  const topLocations = sortedLocations.slice(0, topN).map(loc => loc.location);

  return (
    <div className="min-h-screen bg-[#f7f7ff] py-6 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-xl shadow-lg p-5 flex items-center gap-4 border-l-4 border-${card.color}-400`}
            >
              <div className="flex-1">
                <div className={`text-gray-500 text-sm`}>{card.label}</div>
                <div className={`text-3xl font-bold text-${card.color}-500`}>
                  {card.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
              </div>
              <div
                className={`bg-gradient-to-br from-${card.color}-400 to-${card.color}-500 rounded-full p-3 text-white text-2xl shadow`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Overview */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">SOS Status Overview</h2>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>{' '}
                  Completed
                </span>
                <span className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>{' '}
                  Cancelled
                </span>
              </div>
            </div>
            <div className="h-72 w-full">
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-t mt-6 divide-x">
              {/* Top 3 Completed Teams */}
              <div className="flex flex-col items-center py-4">
                <div className="text-base font-semibold text-blue-500 mb-2">
                  Top 3 Completed Teams
                </div>
                <ul className="w-full">
                  {(caseReportStats?.topCompletedTeams || [])
                    .slice(0, 3)
                    .map((team, idx) => (
                      <li
                        key={team.teamId}
                        className="flex justify-between items-center py-1 px-2"
                      >
                        <span className="truncate max-w-[250px]">
                          {idx + 1}. {team.teamName}
                        </span>
                        <span className="font-bold text-blue-500">
                          {team.completedCount}
                        </span>
                      </li>
                    ))}
                  {(!caseReportStats?.topCompletedTeams ||
                    caseReportStats.topCompletedTeams.length === 0) && (
                    <li className="text-gray-400 text-sm">No data</li>
                  )}
                </ul>
              </div>
              {/* Top 3 Cancelled Teams */}
              <div className="flex flex-col items-center py-4">
                <div className="text-base font-semibold text-yellow-500 mb-2">
                  Top 3 Cancelled Teams
                </div>
                <ul className="w-full">
                  {(caseReportStats?.topCancelledTeams || [])
                    .slice(0, 3)
                    .map((team, idx) => (
                      <li
                        key={team.teamId}
                        className="flex justify-between items-center py-1 px-2"
                      >
                        <span className="truncate max-w-[250px]">
                          {idx + 1}. {team.teamName}
                        </span>
                        <span className="font-bold text-yellow-500">
                          {team.cancelledCount}
                        </span>
                      </li>
                    ))}
                  {(!caseReportStats?.topCancelledTeams ||
                    caseReportStats.topCancelledTeams.length === 0) && (
                    <li className="text-gray-400 text-sm">No data</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* SOS Status Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col ">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">SOS Status Distribution</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <i className="bx bx-dots-horizontal-rounded text-xl"></i>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                height={100}
              />
            </div>
            <ul className="mb-6 grid grid-cols-2 gap-x-10 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                Completed
                <span className="ml-auto font-bold text-blue-500">
                  {totalStatus.completed}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                Cancelled
                <span className="ml-auto font-bold text-yellow-500">
                  {totalStatus.cancelled}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                Pending
                <span className="ml-auto font-bold text-orange-500">
                  {totalStatus.pending}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                Expired
                <span className="ml-auto font-bold text-red-500">
                  {totalStatus.expired}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                Safe
                <span className="ml-auto font-bold text-green-500">
                  {totalStatus.safe}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
                Ready
                <span className="ml-auto font-bold text-indigo-500">
                  {totalStatus.ready}
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* SOS Hotspot Map */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col col-span-1 lg:col-span-3 mt-6">
          <h2 className="text-lg font-semibold mb-4">SOS Hotspot Map</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Map focus Đà Nẵng */}
            <div className="flex-1 min-h-[320px] rounded-lg overflow-hidden">
              {console.log('Render locationData:', locationData)}
              <MapContainer
                center={[16.0471, 108.2068]}
                zoom={12}
                style={{ height: '320px', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Hiển thị marker từ locationData */}
                {locationData && Array.isArray(locationData) && locationData.map((loc, idx) => {
                  const [lat, lng] = (loc.location || '').split(',').map(Number);
                  if (isNaN(lat) || isNaN(lng)) return null;

                  // Chọn màu theo cấp độ count
                  let markerColor = 'rgba(107,114,128,0.8)'; // xám
                  let borderColor = '#6b7280';
                  if (loc.count >= 15) {
                    markerColor = 'rgba(239,68,68,0.8)'; // đỏ
                    borderColor = '#dc2626';
                  } else if (loc.count >= 10) {
                    markerColor = 'rgba(251,191,36,0.8)'; // cam
                    borderColor = '#f59e42';
                  } else if (loc.count >= 5) {
                    markerColor = 'rgba(253,224,71,0.8)'; // vàng
                    borderColor = '#fde047';
                  } else if (loc.count >= 2) {
                    markerColor = 'rgba(59,130,246,0.8)'; // xanh dương
                    borderColor = '#2563eb';
                  }

                  let iconSize = 30;
                  if (loc.count >= 10) iconSize = 48;
                  else if (loc.count >= 5) iconSize = 38;
                  else if (loc.count >= 2) iconSize = 34;

                  const customIcon = L.divIcon({
                    className: '',
                    html: `<div style="background:${markerColor};border-radius:50%;width:${iconSize}px;height:${iconSize}px;display:flex;align-items:center;justify-content:center;border:2px solid ${borderColor};box-shadow:0 2px 8px ${borderColor}33;"></div>`,
                    iconSize: [iconSize, iconSize],
                    iconAnchor: [iconSize / 2, iconSize / 2],
                  });

                  return (
                    <Marker key={idx} position={[lat, lng]} icon={customIcon}>
                      <Popup>
                        <div>
                          <div className="font-bold">{lat.toFixed(6)}, {lng.toFixed(6)}</div>
                          <div>SOS Count: {loc.count}</div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            {/* Top Locations List */}
            <div className="w-full md:w-80 flex flex-col gap-2">
              <h3 className="font-semibold mb-2">SOS Marker Legend</h3>
              <ul>
                <li className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500 mr-2"></span>
                  <span className="flex-1 truncate">&gt;= 15 SOS</span>
                </li>
                <li className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-orange-400 mr-2"></span>
                  <span className="flex-1 truncate">10 - 14 SOS</span>
                </li>
                <li className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-yellow-300 mr-2"></span>
                  <span className="flex-1 truncate">5 - 9 SOS</span>
                </li>
                <li className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                  <span className="flex-1 truncate">2 - 4 SOS</span>
                </li>
                <li className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-gray-400 mr-2"></span>
                  <span className="flex-1 truncate">1 SOS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
