import {Platform, ToastAndroid, Alert} from 'react-native';
import RNFS from 'react-native-fs';

export function convertSecondstoTime(given_seconds: number) {
  var hours = Math.floor(given_seconds / 3600);
  var minutes = Math.floor((given_seconds - hours * 3600) / 60);
  var seconds = given_seconds - hours * 3600 - minutes * 60;

  var timeString =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');
  return timeString;
}

export const getFileNameFromTime = () => {
  const d = +new Date();
  return d.toString();
};

export const getFileExtension = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.'));
};

export const clearCache = () => {
  RNFS.unlink(RNFS.CachesDirectoryPath)
    .then(() => {
      console.log('Files Deleted');
    })
    .catch(e => {
      console.log('ERROR clearCache=', e);
    });
};

export function notifyMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}
