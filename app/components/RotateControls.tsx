import {View, TouchableOpacity, Text} from 'react-native';
import {CommandProps, RotateProps} from '../util/Types';
import {applyRotate} from '../util/Commands';
import Slider from '@react-native-community/slider';

export default function RotateControls({
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  setCurrentVideoInfo,
  seekbarValue,
  setFrames,
  setRotateInfo,
  rotateInfo,
}: CommandProps & RotateProps) {

  const cancelRotate = () => {
    setRotateInfo(undefined);
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
        zIndex:1
      }}>

      <View style={{flexDirection:'row'}}>
        <Text>0</Text>
        <Slider
            style={{
              width: '100%',
              height: 40,
              overflow: 'scroll',
              marginStart: 5,
              flex:1
            }}
            minimumValue={0}
            maximumValue={360}
            value={rotateInfo}
            onSlidingComplete={degrees => {
              setRotateInfo(prev => degrees);
            }}
            // onValueChange={size=> setTextOverlay(prev=>({...prev,size:size}))}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />  
          <Text>360</Text>
      </View>  
      <TouchableOpacity
        onPress={() => {
          cancelRotate();
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
          applyRotate({
            currentVideoInfo,
            setLoading,
            cacheVideoPath,
            setCurrentVideoInfo,
            seekbarValue,
            setFrames,
            setRotateInfo,
            rotateInfo,
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
