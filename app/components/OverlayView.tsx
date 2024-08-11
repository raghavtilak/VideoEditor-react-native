import {View, TouchableOpacity, Image} from 'react-native';
import {overlayImageDefaultDimensions} from '../../App';
import Drag from '../util/Drag';
import {OverlayProps} from '../util/Types';

export default function OverlayView({
  overlayImagesInfo,
  setOverlayImagesInfo,
  videoPlayerDimensions,
}: OverlayProps) {
  const onRemoveOverlayImage = (index: number) => {
    overlayImagesInfo.splice(index, 1);

    setOverlayImagesInfo([...overlayImagesInfo]);

    console.log('onRemoveOverlayImage=', JSON.stringify(overlayImagesInfo));
  };
  return (
    <View
      style={{
        position: 'absolute',
        height: videoPlayerDimensions.height,
        width: videoPlayerDimensions.width,
      }}>
      {overlayImagesInfo.map((value, index) => {
        return (
          <Drag
            height={value.height}
            width={value.width}
            minHeight={overlayImageDefaultDimensions[1]}
            minWidth={overlayImageDefaultDimensions[0]}
            x={value.x}
            y={value.y}
            limitationHeight={videoPlayerDimensions.height}
            limitationWidth={videoPlayerDimensions.width}
            onDragEnd={boxPosition => {
              const _boxArray = [...overlayImagesInfo];
              const _box = _boxArray[index];
              _boxArray[index] = {
                ..._box,
                x: boxPosition.x,
                y: boxPosition.y,
                height: boxPosition.height,
                width: boxPosition.width,
              };
              setOverlayImagesInfo(_boxArray);
              console.log('onDragEnd', boxPosition.x, boxPosition.y);
            }}
            onResizeEnd={boxPosition => {
              const _boxArray = [...overlayImagesInfo];
              const _box = _boxArray[index];
              _boxArray[index] = {
                ..._box,
                x: boxPosition.x,
                y: boxPosition.y,
                height: boxPosition.height,
                width: boxPosition.width,
              };
              setOverlayImagesInfo(_boxArray);
              console.log('onResizeEnd', boxPosition.width, boxPosition.height);
            }}>
            <View>
              <TouchableOpacity onPress={() => onRemoveOverlayImage(index)}>
                <Image
                  source={require('../../assets/icon_close.png')}
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -8,
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
              <Image
                source={{uri: 'file://' + value.filePath}}
                style={{width: value.width, height: value.height}}
              />
            </View>
          </Drag>
        );
      })}
    </View>
  );
}
