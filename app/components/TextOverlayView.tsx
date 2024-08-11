import {View, Text} from 'react-native';
import Draggable from 'react-native-draggable';
import ViewShot from 'react-native-view-shot';
import {TextOverlayProps} from '../util/Types';

export default function TextOverlayView({
  setTextOverlay,
  textOverlay,
  textOverlayXY,
  videoPlayerDimensions,
  viewShotRef,
  textOverlayRef,
}: TextOverlayProps) {
  return (
    <View
      style={{
        position: 'absolute',
        height: videoPlayerDimensions.height,
        width: videoPlayerDimensions.width,
      }}>
      <Draggable
        x={0}
        y={0}
        maxX={videoPlayerDimensions.width}
        minX={0}
        minY={0}
        maxY={videoPlayerDimensions.height}
        onDragRelease={(b, a, bounds) => {
          console.log(
            'BOUNDS=',
            bounds.left,
            bounds.top,
            bounds.right,
            bounds.bottom,
          );
          textOverlayXY.current.x = bounds.left;
          textOverlayXY.current.y = bounds.top;

          // overlayImageCoordinates.current = {x:bounds.left,y:bounds.top}
        }}>
        <ViewShot
          ref={viewShotRef}
          options={{
            fileName: 'overlay',
            format: 'png',
            quality: 0.9,
          }}>
          <Text
            onLayout={e => {
              console.log('TEXT VIEW');
              textOverlayRef.current.width = e.nativeEvent.layout.width;
              textOverlayRef.current.height = e.nativeEvent.layout.height;
              console.log(
                'TEXT VIEW=',
                textOverlayRef.current.width,
                textOverlayRef.current.height,
              );
            }}
            style={{
              fontSize: textOverlay.size,
              color: textOverlay.color,
              fontWeight: textOverlay.style === 'bold' ? 'bold' : 'normal',
              textDecorationLine:
                textOverlay.style === 'underline' ? 'underline' : 'none',
              fontStyle: textOverlay.style === 'italic' ? 'italic' : 'normal',
              includeFontPadding: false,

              //just for testing purpose
              // backgroundColor:"red",
              // marginVertical:0,
              // paddingVertical:0
            }}>
            {textOverlay.text}
          </Text>
        </ViewShot>
      </Draggable>
    </View>
  );
}
