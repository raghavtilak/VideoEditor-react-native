import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Modal,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Video from 'react-native-video';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import * as Progress from 'react-native-progress';
import BottomSheetButtons from './app/components/BottomSheetButtons';
import TextOverlayControls from './app/components/TextOverlayControls';
import OverlayControls from './app/components/OverlayControls';
import RotateControls from './app/components/RotateControls';
import FlipControls from './app/components/FlipControls';
import OverlayView from './app/components/OverlayView';
import TextOverlayView from './app/components/TextOverlayView';
import CropView from './app/components/CropView';
import CropControls from './app/components/CropControls';
import {
  clearCache,
  convertSecondstoTime,
  getFileExtension,
  getFileNameFromTime,
  notifyMessage,
} from './app/util/Util';
import {updateVideoTimelineFrames} from './app/util/Commands';

export const overlayImageDefaultDimensions = [50, 50];

function App(): React.JSX.Element {

  const {SAFModule} = NativeModules

  const [currentVideoInfo, setCurrentVideoInfo] = useState<{
    width: number;
    height: number;
    path: string;
    duration: number;
  }>();
  const [loading, setLoading] = useState({
    isLoading: false,
    message: '',
    progress: 0.1,
  });

  const videoPlayer = useRef(null);
  const [widthSeekBar, setWidthSeekBar] = useState(0);

  const [endTimeString, setEndTimeString] = useState('00:00:00');
  const [startTimeString, setStartTimeString] = useState('00:00:00');

  const [overlayImagesInfo, setOverlayImagesInfo] = useState<
    {filePath: string; x: number; y: number; width: number; height: number}[]
  >([]);
  const [videoPlayerParentDimensions, setVideoPlayerParentDimensions] =
    useState({x: 0, y: 0, width: 0, height: 0});
  const [videoPlayerDimensions, setVideoPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [frames, setFrames] = useState<string[]>([]);

  const [textOverlay, setTextOverlay] = useState<{
    text: string;
    color: string;
    size: number;
    style: 'italic' | 'bold' | 'normal' | 'underline';
  } | null>(null); //{text:"Enter text",color:"black",style:"normal",size:12})

  const textOverlayXY = useRef({x: 0, y: 0});
  const textOverlayRef = useRef({width: 0, height: 0});

  const viewShotRef = useRef();
  const [cropInfo, setCropInfo] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();
  const [rotateInfo, setRotateInfo] = useState<number | undefined>();
  const [flipInfo, setFlipInfo] = useState<{
    vertical: boolean;
    horizontal: boolean;
  }>();

  const [seekbarValue, setSeekbarValue] = useState([0, 1]);

  const seekbarValueChange = values => {
    setSeekbarValue(values);
    setStartTimeString(convertSecondstoTime(values[0]));
    setEndTimeString(convertSecondstoTime(values[1]));
  };

  const cacheVideoPath = useRef('');

  useEffect(() => {
    videoPlayer.current.seek(seekbarValue[0]);
  }, [seekbarValue]);

  const getSizeSeekBar = event => {
    setWidthSeekBar(event.nativeEvent.layout.width);
    console.log('size', event.nativeEvent.layout);
  };

  const onProgress = e => {
    if (Math.trunc(e.currentTime) === seekbarValue[1])
      videoPlayer.current.seek(seekbarValue[0]);
  };

  const onLoadMedia = e => {
    console.log('onLoadMedia DURATION=', e);

    const aspectRatioView =
      videoPlayerParentDimensions.width / videoPlayerParentDimensions.height;
    const aspectRatioVideo = +e.naturalSize.width / +e.naturalSize.height;

    let scaledWidth, scaledHeight;

    if (aspectRatioView > aspectRatioVideo) {
      console.log('CASE 1');
      scaledHeight = videoPlayerParentDimensions.height;
      scaledWidth = videoPlayerParentDimensions.height * aspectRatioVideo;
    } else {
      console.log('CASE 2');
      scaledWidth = videoPlayerParentDimensions.width;
      scaledHeight = videoPlayerParentDimensions.width / aspectRatioVideo;
    }

    console.log('Scaled DIM=', scaledWidth, scaledHeight);
    setVideoPlayerDimensions({width: scaledWidth, height: scaledHeight});

    setCurrentVideoInfo(prev => ({
      ...prev,
      width: +e.naturalSize.width,
      height: +e.naturalSize.height,
    }));

    setLoading({isLoading: false, message: '', progress: 0});
    setSeekbarValue([0, e.duration]);
    setEndTimeString(convertSecondstoTime(e.duration));
  };

  const selectVideo = async () => {
    setLoading({isLoading: true, message: 'Loading media..', progress: 90});

    clearCache();

    const result = await launchImageLibrary({
      mediaType: 'mixed',
      includeExtra: true,
    });
    console.log(result);

    if (result.didCancel === true) {
      setLoading({isLoading: false, message: '', progress: 0});
      return true;
    }

    console.log(result.assets[0].fileName);
    console.log('FILE EXT=', getFileExtension(result.assets[0].fileName));
    cacheVideoPath.current =
      RNFS.CachesDirectoryPath + '/' + result.assets[0].fileName;

    RNFS.copyFile(result.assets[0].uri, cacheVideoPath.current)
      .then(() => {
        console.log('FILE COPIED TO PATH=', cacheVideoPath.current);

        console.log(
          'DIMESIONS VIDEOPLAYER=',
          videoPlayerParentDimensions.x,
          videoPlayerParentDimensions.y,
          videoPlayerParentDimensions.width,
          videoPlayerParentDimensions.height,
        );
        console.log(
          'DIMENSIONS VIDEO=',
          result.assets[0].width,
          result.assets[0].height,
        );

        updateVideoTimelineFrames(
          setLoading,
          cacheVideoPath,
          setFrames,
          result.assets[0].duration,
          () => {
            setCurrentVideoInfo({
              width: result.assets[0].width,
              height: result.assets[0].height,
              path: cacheVideoPath.current,
              duration: result.assets[0].duration,
            });
            setLoading({isLoading: false, message: '', progress: 0});
          },
        );
      })
      .catch(err => {
        console.log('ERROR=', err);
      });
  };

  
  const saveFile = async () => {

    if (cacheVideoPath.current === '') {
        notifyMessage('No video to saved');
        return;
    }

    let savePath = '';

    console.log("VERSION=",Platform.Version)
    //if its Android 10
    if(Platform.Version===29){
      try {
        savePath = await SAFModule.launchSAFPicker('filename.mp4')
        console.log(`FINALLY GOT URI ${savePath}`);
      } catch (e) {
        console.error('ERROR=',e);
        return;
      }
    }else{

      if (Platform.OS === 'android') {
        savePath =
          RNFS.DownloadDirectoryPath +
          '/' +
          getFileNameFromTime() +
          getFileExtension(cacheVideoPath.current);
      } else if (Platform.OS === 'ios') {
        savePath =
          RNFS.LibraryDirectoryPath +
          '/' +
          getFileNameFromTime() +
          getFileExtension(cacheVideoPath.current);
      }
    }
    
    RNFS.copyFile(cacheVideoPath.current, savePath)
      .then(() => {
        console.log('FILE COPIED TO PATH=', savePath);
        notifyMessage('Saved at ' + savePath);
      })
      .catch(err => {
        console.log('ERROR=', err);
        notifyMessage("Couldn't save file" + err);
      });
  };

  //instead of user everytime open app, app should clear cache
  //we can clear the cache when user selects a new video
  // useEffect(()=>{
  //   return clearCache()
  // },[])

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', backgroundColor: '#000000'}}>
        <TouchableOpacity
          onPress={() => {
            selectVideo();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#08B5F6',
            margin: 5,
            padding: 15,
            flex: 1,
          }}>
          <Text style={{color: '#ffffff'}}>SELECT VIDEO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            saveFile();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#44AF53',
            margin: 5,
            padding: 15,
          }}>
          <Text style={{color: '#ffffff'}}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <View
        onLayout={event => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setVideoPlayerParentDimensions({
              x: x,
              y: y,
              width: width,
              height: height,
            });
          });
        }}
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}>
        <Video
          ref={videoPlayer}
          source={{
            uri: currentVideoInfo !== undefined ? currentVideoInfo.path : '',
          }}
          style={{
            transform: [
              {
                rotateX: flipInfo
                  ? flipInfo.vertical
                    ? '180deg'
                    : '0deg'
                  : '0deg',
              }, //horizontally
              {
                rotateY: flipInfo
                  ? flipInfo.horizontal
                    ? '180deg'
                    : '0deg'
                  : '0deg',
              }, //vertically,
            ],
            backgroundColor: 'black',
            height: videoPlayerDimensions.height,
            width: videoPlayerDimensions.width,
          }}
          resizeMode={'contain'}
          repeat={true}
          paused={false}
          onLoad={onLoadMedia}
          onProgress={onProgress}
        />

        {overlayImagesInfo.length > 0 && (
          <OverlayView
            overlayImagesInfo={overlayImagesInfo}
            videoPlayerDimensions={videoPlayerDimensions}
            setOverlayImagesInfo={setOverlayImagesInfo}
          />
        )}

        {textOverlay && (
          <TextOverlayView
            viewShotRef={viewShotRef}
            textOverlayRef={textOverlayRef}
            videoPlayerDimensions={videoPlayerDimensions}
            textOverlayXY={textOverlayXY}
            setTextOverlay={setTextOverlay}
            textOverlay={textOverlay}
          />
        )}

        {cropInfo && (
          <CropView
            cropInfo={cropInfo}
            setCropInfo={setCropInfo}
            videoPlayerDimensions={videoPlayerDimensions}
          />
        )}
      </View>
      <View
        onLayout={getSizeSeekBar}
        style={{backgroundColor: '#2F2E30', flexDirection: 'column'}}>
        {cropInfo && (
          <CropControls
            currentVideoInfo={currentVideoInfo}
            seekbarValue={seekbarValue}
            setCurrentVideoInfo={setCurrentVideoInfo}
            setLoading={setLoading}
            setFrames={setFrames}
            cacheVideoPath={cacheVideoPath}
            cropInfo={cropInfo}
            setCropInfo={setCropInfo}
            videoPlayerDimensions={videoPlayerDimensions}
          />
        )}
        {flipInfo && (
          <FlipControls
            currentVideoInfo={currentVideoInfo}
            seekbarValue={seekbarValue}
            setCurrentVideoInfo={setCurrentVideoInfo}
            setLoading={setLoading}
            setFrames={setFrames}
            cacheVideoPath={cacheVideoPath}
            setFlipInfo={setFlipInfo}
            flipInfo={flipInfo}
          />
        )}
        {rotateInfo && (
          <Text>Raghav</Text>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: '#ffffff'}}>{startTimeString}</Text>
          <Text style={{color: '#ffffff'}}>{endTimeString}</Text>
        </View>

        <View style={{marginTop: 8}}>
          {frames.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                height: 50,
                width: '100%',
              }}>
              {frames.map((uri, index) => {
                return (
                  <Image
                    key={index}
                    source={{uri: 'file://' + uri}}
                    style={{height: 50, flex: 1}}
                  />
                );
              })}
            </View>
          )}
          <MultiSlider
            values={[seekbarValue[0], seekbarValue[1]]}
            sliderLength={widthSeekBar}
            onValuesChange={seekbarValueChange}
            min={0}
            max={Math.trunc(seekbarValue[1])}
            step={1}
            allowOverlap={false}
            snapped={false}
            minMarkerOverlapDistance={10}
            trackStyle={{height: 0, backgroundColor: 'transparent'}}
            isMarkersSeparated={true}
            customMarkerLeft={e => {
              return (
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 10,
                    height: 50,
                    padding: 0,
                    margin: 0,
                    borderRadius: 2,
                  }}>
                  <Image
                    style={{
                      transform: [{rotateY: '180deg'}],
                      width: 10,
                      height: 50,
                    }}
                    source={require('./assets/ic_arrow.png')}
                    resizeMode="contain"
                  />
                </View>
              );
            }}
            customMarkerRight={e => {
              return (
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 10,
                    height: 50,
                    padding: 0,
                    margin: 0,
                    borderRadius: 2,
                  }}>
                  <Image
                    style={{width: 10, height: 50}}
                    source={require('./assets/ic_arrow.png')}
                    resizeMode="contain"
                  />
                </View>
              );
            }}
          />
        </View>

        <View style={{flexDirection: 'row', padding: 5}}>
          <BottomSheetButtons
            cropInfo={cropInfo}
            setCropInfo={setCropInfo}
            videoPlayerDimensions={videoPlayerDimensions}
            viewShotRef={viewShotRef}
            textOverlayXY={textOverlayXY}
            setTextOverlay={setTextOverlay}
            overlayImagesInfo={overlayImagesInfo}
            setOverlayImagesInfo={setOverlayImagesInfo}
            setFlipInfo={setFlipInfo}
            setRotateInfo={setRotateInfo}
            currentVideoInfo={currentVideoInfo}
            seekbarValue={seekbarValue}
            setCurrentVideoInfo={setCurrentVideoInfo}
            setLoading={setLoading}
            setFrames={setFrames}
            cacheVideoPath={cacheVideoPath}
          />

          {textOverlay && (
            <TextOverlayControls
              currentVideoInfo={currentVideoInfo}
              seekbarValue={seekbarValue}
              setCurrentVideoInfo={setCurrentVideoInfo}
              setLoading={setLoading}
              setFrames={setFrames}
              cacheVideoPath={cacheVideoPath}
              viewShotRef={viewShotRef}
              videoPlayerDimensions={videoPlayerDimensions}
              textOverlayXY={textOverlayXY}
              setTextOverlay={setTextOverlay}
              textOverlay={textOverlay}
              textOverlayRef={textOverlayRef}
            />
          )}

          {overlayImagesInfo.length > 0 && (
            <OverlayControls
              currentVideoInfo={currentVideoInfo}
              seekbarValue={seekbarValue}
              setCurrentVideoInfo={setCurrentVideoInfo}
              setLoading={setLoading}
              setFrames={setFrames}
              cacheVideoPath={cacheVideoPath}
              overlayImagesInfo={overlayImagesInfo}
              videoPlayerDimensions={videoPlayerDimensions}
              setOverlayImagesInfo={setOverlayImagesInfo}
            />
          )}
        </View>
      </View>

      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading.isLoading}
        style={{zIndex: 1100}}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {/* <ActivityIndicator size='large' animating={loading.isLoading} color="black" /> */}
            <Text style={{padding: 10, marginStart: 5}}>{loading.message}</Text>
            <Progress.Bar
              progress={loading.progress > 1 ? 0.98 : loading.progress}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: '#ffffff',
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  bold: {fontWeight: 'bold'},
  italic: {fontStyle: 'italic'},
  underline: {textDecorationLine: 'underline'},
});

export default App;
