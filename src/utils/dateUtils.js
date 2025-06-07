export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  date.setHours(date.getHours() + 7);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
};
