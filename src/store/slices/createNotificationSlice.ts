import type { StoreSlice, NotificationSlice } from './types';
import type { AppNotification } from '../../types';

export const createNotificationSlice: StoreSlice<NotificationSlice> = (set) => ({
  notifications: [],
  addNotification: (data) => set((state) => {
    const newNotif: AppNotification = {
      ...data,
      id: `n${Date.now()}`,
      time: new Date().toISOString(),
      read: false
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),

  markNotificationRead: (notificationId) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    return { notifications: updated };
  }),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
});
