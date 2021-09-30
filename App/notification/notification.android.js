import PushNotification from 'react-native-push-notification';
import {CHANNEL_ID} from './configuration';

export const handleNewForumNotification = (title, creatorName, id) => {
  //   PushNotification.cancelAllLocalNotifications();

  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    title: `New forum ${title.slice(0, 10)}...`,
    message: `Forum created by ${creatorName}`,
    id, //replace previous notification (if it's the same) with a new one
    bigText: `Full name: ${title}`, //android
    color: 'red', //android
  });

  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    title: 'Schedule',
    message: 'After 5 sec',
    date: new Date(Date.now() + 5 * 1000),
  });
};
