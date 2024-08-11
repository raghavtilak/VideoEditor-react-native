import React, {ReactElement} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
interface Props {
  maxWidth: number;
  maxHeight: number;
  children: JSX.Element;
}

export default function ResizableComponent({
  maxWidth,
  maxHeight,
  children,
}: Props) {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      console.log('onStart', scale.value);
      startScale.value = scale.value;
    })
    .onUpdate(event => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(maxWidth / 100, maxHeight / 100),
      );
      console.log('onUpdate', scale.value);
    })
    .runOnJS(true);

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pinch}>
        <Animated.View style={[boxAnimatedStyles]}>{children}</Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  //   box: {
  //     width: 100,
  //     height: 100,
  //     borderRadius: 20,
  //     backgroundColor: '#b58df1',
  //   },
});
