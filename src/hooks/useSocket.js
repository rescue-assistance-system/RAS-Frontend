import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import sosCoordinatorService from '../services/sos.coordinator.service';

export const useSocket = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const userId = decoded.id || decoded.user_id || decoded.sub;
      sosCoordinatorService.registerSocket(userId);
    }
  }, []);

  useEffect(() => {
    const { socket } = sosCoordinatorService;

    const handleCaseCancelled = (notification) => {
      const notiList = JSON.parse(
        localStorage.getItem('notifications') || '[]',
      );
      notiList.unshift({
        message: notification.message,
        time: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notiList));
      alert(notification.message);
      toast.error(notification.message);
    };

    socket.on('case_cancelled', handleCaseCancelled);

    return () => {
      socket.off('case_cancelled', handleCaseCancelled);
    };
  }, []);
};
