import {View, TouchableOpacity, Text} from 'react-native';
import {CommandProps, OverlayProps, TextOverlayProps} from '../util/Types';
import {overlay} from '../util/Commands';

export default function OverlayControls({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  overlayImagesInfo,
  setFrames,
  setOverlayImagesInfo,
  videoPlayerDimensions,
}: CommandProps & OverlayProps) {
  const cancelOverlay = () => {
    setOverlayImagesInfo([]);
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
      }}>
      <TouchableOpacity
        onPress={() => {
          cancelOverlay();
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
          overlay({
            setCurrentVideoInfo,
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            seekbarValue,
            overlayImagesInfo,
            setFrames,
            setOverlayImagesInfo,
            videoPlayerDimensions,
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
