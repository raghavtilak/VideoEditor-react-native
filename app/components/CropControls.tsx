import {View, TouchableOpacity, Text} from 'react-native';
import {applyCrop} from '../util/Commands';
import {CommandProps, CropProps} from '../util/Types';

export default function CropControls({
  currentVideoInfo,
  seekbarValue,
  setLoading,
  cacheVideoPath,
  setCurrentVideoInfo,
  cropInfo,
  setCropInfo,
  videoPlayerDimensions,
  setFrames,
}: CommandProps & CropProps) {
  const cancelCrop = () => {
    setCropInfo(undefined);
  };
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: '#2F2E30',
        zIndex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          cancelCrop();
        }}
        style={{
          alignItems: 'center',
          backgroundColor: 'red',
          margin: 5,
          padding: 15,
        }}>
        <Text style={{color: '#ffffff'}}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          applyCrop({
            seekbarValue,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            setCurrentVideoInfo,
            cropInfo,
            setCropInfo,
            videoPlayerDimensions,
            setFrames,
          });
        }}
        style={{
          alignItems: 'center',
          backgroundColor: '#44AF53',
          margin: 5,
          padding: 15,
        }}>
        <Text style={{color: '#ffffff'}}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}
