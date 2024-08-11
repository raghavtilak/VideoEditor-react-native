import {View} from 'react-native';
import {overlayImageDefaultDimensions} from '../../App';
import Drag from '../util/Drag';
import {CropProps} from '../util/Types';

export default function CropView({
  videoPlayerDimensions,
  cropInfo,
  setCropInfo,
}: CropProps) {
  return (
    <View
      style={{
        position: 'absolute',
        height: videoPlayerDimensions.height,
        width: videoPlayerDimensions.width,
      }}>
      <Drag
        style={{
          width: videoPlayerDimensions.width / 3,
          height: videoPlayerDimensions.height / 3,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        height={cropInfo ? cropInfo.height : 0}
        width={cropInfo ? cropInfo.width : 0}
        minHeight={overlayImageDefaultDimensions[1]}
        minWidth={overlayImageDefaultDimensions[0]}
        x={cropInfo ? cropInfo.x : 0}
        y={cropInfo ? cropInfo.y : 0}
        limitationHeight={videoPlayerDimensions.height}
        limitationWidth={videoPlayerDimensions.width}
        onDragEnd={boxPosition => {
          setCropInfo(prev => ({
            ...prev,
            x: boxPosition.x,
            y: boxPosition.y,
            height: boxPosition.height,
            width: boxPosition.width,
          }));
          console.log('onDragEnd', boxPosition.x, boxPosition.y);
        }}
        onResizeEnd={boxPosition => {
          setCropInfo(prev => ({
            ...prev,
            x: boxPosition.x,
            y: boxPosition.y,
            height: boxPosition.height,
            width: boxPosition.width,
          }));
          console.log('onResizeEnd', boxPosition.width, boxPosition.height);
        }}>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            width: '100%',
            height: '100%',
            opacity: 0.9,
          }}>
          <View
            style={{
              width: '100%',
              height: 0.3,
              backgroundColor: 'white',
            }}></View>
          <View
            style={{
              width: '100%',
              height: 0.3,
              backgroundColor: 'white',
            }}></View>
        </View>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            height: '100%',
            opacity: 0.9,
          }}>
          <View
            style={{
              width: 0.3,
              height: '100%',
              backgroundColor: 'white',
            }}></View>
          <View
            style={{
              width: 0.3,
              height: '100%',
              backgroundColor: 'white',
            }}></View>
        </View>
      </Drag>
    </View>
  );
}
