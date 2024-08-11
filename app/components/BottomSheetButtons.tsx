import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import {slowMotion, fastForward, reverse, trimVideo} from '../util/Commands';
import {notifyMessage} from '../util/Util';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {overlayImageDefaultDimensions} from '../../App';
import {BottomSheetButtonsProps, CommandProps} from '../util/Types';

export default function BottomSheetButtons({
  currentVideoInfo,
  seekbarValue,
  setCurrentVideoInfo,
  setLoading,
  setFrames,
  cacheVideoPath,
  setOverlayImagesInfo,
  overlayImagesInfo,
  setTextOverlay,
  textOverlayXY,
  viewShotRef,
  videoPlayerDimensions,
  setCropInfo,
  cropInfo,
  setFlipInfo,
  setRotateInfo,
}: BottomSheetButtonsProps) {
  async function selectOverlayFile() {
    if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
      notifyMessage('Select a video');
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeExtra: true,
      selectionLimit: 0,
    });

    let overlayImages: {
      filePath: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }[] = [];

    result.assets?.forEach(asset => {
      console.log(asset);
      console.log('OVERLAY=', asset.fileName);
      let path = RNFS.CachesDirectoryPath + '/' + asset.fileName;

      RNFS.copyFile(asset.uri, path)
        .then(() => {
          console.log('FILE COPIED TO PATH=', path);
          overlayImages.push({
            filePath: path,
            x: 0,
            y: 0,
            width: overlayImageDefaultDimensions[0],
            height: overlayImageDefaultDimensions[0],
          });
        })
        .catch(err => {
          console.log('ERROR=', err);
        });
    });
    setOverlayImagesInfo(overlayImages);
  }

  const initializeTextOverlay = () => {
    if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
      notifyMessage('Select a video');
      return;
    }
    setTextOverlay({
      text: 'Enter text',
      color: 'black',
      style: 'normal',
      size: 12,
    });
  };

  const initializeCrop = () => {
    if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
      notifyMessage('Select a video');
      return;
    }

    setCropInfo({
      x: 0,
      y: 0,
      width: videoPlayerDimensions.width / 3,
      height: videoPlayerDimensions.height / 3,
    });
  };

  const initializeFlip = () => {
    if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
      notifyMessage('Select a video');
      return;
    }

    setFlipInfo({vertical: false, horizontal: false});
  };
  const initializeRotate = () => {
    if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
      notifyMessage('Select a video');
      return;
    }

    setRotateInfo(0);
  };

  return (
    <ScrollView horizontal>
      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          slowMotion({
            setCurrentVideoInfo,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            seekbarValue,
            setFrames,
          });
        }}>
        <Image
          source={require('../../assets/icon_effect_slow.png')}
          style={{
            width: 40,
            height: 40,
            margin: 5,
            alignContent: 'center',
          }}></Image>
        <Text style={{color: '#ffffff'}}>Slow</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          fastForward({
            setCurrentVideoInfo,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            seekbarValue,
            setFrames,
          });
        }}>
        <Image
          source={require('../../assets/icon_effect_time.png')}
          style={{
            width: 40,
            height: 40,
            margin: 5,
            alignContent: 'center',
          }}></Image>
        <Text style={{color: '#ffffff'}}>Fast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', padding: 10}}
        onPress={() => {
          reverse({
            setCurrentVideoInfo,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            seekbarValue,
            setFrames,
          });
        }}>
        <Image
          source={require('../../assets/icon_effect_repeatedly.png')}
          style={{
            width: 40,
            height: 40,
            margin: 5,
            alignContent: 'center',
          }}></Image>
        <Text style={{color: '#ffffff'}}>Reverse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', padding: 10}}
        onPress={() => {
          selectOverlayFile();
        }}>
        <Image
          source={require('../../assets/icon_effect_overlay.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Overlay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          initializeTextOverlay();
        }}>
        <Image
          source={require('../../assets/icon_text_overlay.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Text</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          trimVideo({
            setCurrentVideoInfo,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            seekbarValue,
            setFrames,
          });
        }}>
        <Image
          source={require('../../assets/icon_trim.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Trim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          initializeCrop();
        }}>
        <Image
          source={require('../../assets/ic_crop.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Crop</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          initializeRotate();
        }}>
        <Image
          source={require('../../assets/ic_rotate.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Rotate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', flex: 1, padding: 10}}
        onPress={() => {
          initializeFlip();
        }}>
        <Image
          source={require('../../assets/ic_flip.png')}
          style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
          tintColor="white"
        />
        <Text style={{color: '#ffffff'}}>Flip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
