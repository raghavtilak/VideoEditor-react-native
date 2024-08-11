import React, {useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ToastAndroid,
  Alert,
  Dimensions,
  useWindowDimensions,
  TextInputComponent,
  TextInput,
  FlatList,
} from 'react-native';
import {styles} from '../../App';
import {applyTextOverlay} from '../util/Commands';
import {CommandProps, TextOverlayProps} from '../util/Types';
import Slider from '@react-native-community/slider';

const colors = [
  'black',
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
];
export default function TextOverlayControls({
  setCurrentVideoInfo,
  textOverlayRef,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  viewShotRef,
  videoPlayerDimensions,
  setTextOverlay,
  textOverlay,
  setFrames,
  textOverlayXY,
}: CommandProps & TextOverlayProps) {
  const cancelTextOverlay = () => setTextOverlay(null);
  return (
    <ScrollView
      style={{
        width: '100%',
        height: '100%',
        overflow: 'scroll',
        position: 'absolute',
        marginTop: 10,
      }}>
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          backgroundColor: '#2F2E30',
        }}>
        <TouchableOpacity
          onPress={() => {
            cancelTextOverlay();
          }}
          style={{
            position: 'absolute',
            alignItems: 'center',
            backgroundColor: 'red',
            margin: 2,
            padding: 10,
            top: 0,
            right: 0,
          }}>
          <Text style={{color: '#ffffff'}}>Cancel</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>Text:</Text>
          <TextInput
            style={styles.input}
            onChangeText={str => {
              setTextOverlay(prev => ({...prev, text: str}));
            }}
            value={textOverlay.text}
            placeholder="Enter text"
            keyboardType="default"
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>Style:</Text>
          <TouchableOpacity
            onPress={() => {
              setTextOverlay(prev => ({...prev, style: 'normal'}));
            }}
            style={{
              padding: 5,
              backgroundColor: 'grey',
              borderRadius: 5,
              borderWidth: textOverlay.style === 'normal' ? 2 : 0,
              borderColor: textOverlay.style === 'normal' ? 'green' : 'none',
              marginStart: 10,
            }}>
            <Text>N</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTextOverlay(prev => ({...prev, style: 'bold'}));
            }}
            style={{
              padding: 5,
              backgroundColor: 'grey',
              borderRadius: 5,
              borderWidth: textOverlay.style === 'bold' ? 2 : 0,
              borderColor: textOverlay.style === 'bold' ? 'green' : 'none',
              marginStart: 10,
            }}>
            <Text style={styles.bold}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTextOverlay(prev => ({...prev, style: 'italic'}));
            }}
            style={{
              padding: 5,
              backgroundColor: 'grey',
              borderRadius: 5,
              borderWidth: textOverlay.style === 'italic' ? 2 : 0,
              borderColor: textOverlay.style === 'italic' ? 'green' : 'none',
              marginStart: 10,
            }}>
            <Text style={styles.italic}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTextOverlay(prev => ({...prev, style: 'underline'}));
            }}
            style={{
              padding: 5,
              backgroundColor: 'grey',
              borderRadius: 5,
              borderWidth: textOverlay.style === 'underline' ? 2 : 0,
              borderColor: textOverlay.style === 'underline' ? 'green' : 'none',
              marginStart: 10,
            }}>
            <Text style={styles.underline}>U</Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>Color:</Text>
          <View>
            <FlatList
              data={colors}
              horizontal
              renderItem={info => (
                <TouchableOpacity
                  onPress={() => {
                    setTextOverlay(prev => ({...prev, color: info.item}));
                  }}>
                  <View
                    style={{
                      padding: 12,
                      margin: 5,
                      backgroundColor: info.item,
                      borderRadius: 5,
                      borderWidth: textOverlay.color === info.item ? 2 : 0,
                      borderColor:
                        textOverlay.color === info.item ? 'green' : 'none',
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>Size:</Text>
          <Slider
            style={{
              width: '100%',
              height: 40,
              overflow: 'scroll',
              marginStart: 5,
            }}
            minimumValue={10}
            maximumValue={40}
            value={textOverlay.size}
            onSlidingComplete={size => {
              setTextOverlay(prev => ({...prev, size: size}));
            }}
            // onValueChange={size=> setTextOverlay(prev=>({...prev,size:size}))}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            applyTextOverlay({
              textOverlayRef,
              setCurrentVideoInfo,
              textOverlay,
              currentVideoInfo,
              setLoading,
              cacheVideoPath,
              seekbarValue,
              viewShotRef,
              videoPlayerDimensions,
              setTextOverlay,
              setFrames,
              textOverlayXY,
            });
          }}
          style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            backgroundColor: '#44AF53',
            margin: 2,
            padding: 10,
          }}>
          <Text style={{color: '#ffffff'}}>Apply</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
