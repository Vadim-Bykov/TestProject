import PushNotificationIOS from '@react-native-community/push-notification-ios';

export const handleNewForumNotification = (title, creatorName, id) => {
  //   PushNotification.cancelAllLocalNotifications();

  PushNotificationIOS.presentLocalNotification({
    channelId: CHANNEL_ID,
    alertTitle: `New forum ${title.slice(0, 10)}...`,
    alertBody: `Forum created by ${creatorName}`,
  });

  const data = new Date();
  data.setSeconds(data.getSeconds() + 5);

  PushNotificationIOS.scheduleLocalNotification({
    alertTitle: 'Schedule',
    alertBody: 'After 5 sec',
    fireDate: data.toISOString,
  });

  PushNotificationIOS.removeAllDeliveredNotifications();
};
