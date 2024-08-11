import {View, TouchableOpacity, Image, Text} from 'react-native';
import { CommandProps, FlipProps } from '../util/Types';
import { notifyMessage } from '../util/Util';
import { applyFlip } from '../util/Commands';

export default function FlipControls({ currentVideoInfo, setLoading, cacheVideoPath, setCurrentVideoInfo, setFlipInfo, seekbarValue, flipInfo, setFrames}:(CommandProps & FlipProps)) {

  const cancelFlip = () => {
    setFlipInfo(undefined)
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height:'100%',
        overflow: 'hidden',
        position: 'absolute',
        flexDirection: 'column',
        backgroundColor: '#2F2E30',
        zIndex: 1,
      }}>
      <View style={{flexDirection:'row',flex:1,width: '100%',height:'100%'}}>
        <TouchableOpacity
          style={{alignItems: 'center', flex: 1, padding: 10}}
          onPress={() => {
            setFlipInfo(prev => ({...prev, horizontal: !prev?.horizontal}));
          }}>
          <Image
            source={require('../../assets/ic_flip_horizontal.png')}
            style={{width: 40, height: 40, margin: 5, transform:[{rotate:'270deg'}], alignContent: 'center'}}
            tintColor="white"
          />
          <Text style={{color: '#ffffff'}}>Horizontal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{alignItems: 'center', flex: 1, padding: 10}}
          onPress={() => {
            setFlipInfo(prev => ({...prev, vertical: !prev?.vertical}));
          }}>
          <Image
            source={require('../../assets/ic_flip_horizontal.png')}
            style={{width: 40, height: 40, margin: 5, alignContent: 'center'}}
            tintColor="white"
          />
          <Text style={{color: '#ffffff'}}>Vertical</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row',width: '100%'}}>  
        <TouchableOpacity
          onPress={() => {
            cancelFlip();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: 'red',
            margin: 5,
            padding: 15,flex:1
          }}>
          <Text style={{color: '#ffffff'}}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if(!flipInfo?.horizontal && !flipInfo?.vertical)
              cancelFlip()
            else
              applyFlip({ currentVideoInfo, setLoading,seekbarValue, cacheVideoPath, setCurrentVideoInfo, setFlipInfo, flipInfo, setFrames});
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#44AF53',
            margin: 5,
            padding: 15,flex:1
          }}>
          <Text style={{color: '#ffffff'}}>Apply</Text>
        </TouchableOpacity>
      </View>  
    </View>
  );
}
