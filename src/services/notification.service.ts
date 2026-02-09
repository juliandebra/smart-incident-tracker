import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  },

  async scheduleNotification(title: string, body: string): Promise<void> {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title,
          body,
          schedule: { at: new Date(Date.now() + 100) }, // Immediate
          sound: undefined,
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
        },
      ],
    });
  },
};
