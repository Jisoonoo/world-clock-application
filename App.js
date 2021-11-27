/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import London from './src/assets/ldn.mp4'
import Seoul from './src/assets/seo.mp4'
import Ulaanbaatar from './src/assets/ub.mp4'
import Tokyo from './src/assets/tk.mp4'
import Video from 'react-native-video';
import { TextStroke } from './src/components/TextStroke';

const cities = [
  {
    name: 'ulaanbaatar',
    timezone: '+8',
    videoAsset: Ulaanbaatar,
    nativeName: 'Улаанбаатар'
  },
  {
    name: 'seoul',
    timezone: '+9',
    videoAsset: Seoul,
    nativeName: '서울'
  },
  {
    name: 'tokyo',
    timezone: '+9',
    videoAsset: Tokyo,
    nativeName: '東京'
  },
  {
    name: 'london',
    timezone: '+0',
    videoAsset: London,
    nativeName: 'London'
  },
]

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const { width, height } = Dimensions.get('window')

  const [Refresh, setRefresh] = useState(false)

  const [Index, setIndex] = useState([0, null])
  const [Disabled, setDisabled] = useState(false)

  const expand = useRef(new Animated.Value(width / 5)).current
  const collapse = useRef(new Animated.Value(width / 5 * 2)).current

  const getHours = (timezone) => {
    const newDate = new Date();
    return `${newDate.getUTCHours() + parseInt(timezone)}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()}`
  }

  const getDate = (t) => {
    const date = new Date()
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    var nd = new Date(utc + (3600000 * t))

    return nd.toLocaleString().slice(0, 10)
  }
  
  const changeIndex = (i) => {
    let newArr = [...Index]
    newArr[1] = i
    setIndex(newArr)
    setDisabled(true)

    if(i != Index[0]){
      Animated.parallel([
        Animated.timing(collapse, {
          toValue: width / 5,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(expand, {
          toValue: width / 5 * 2,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start(({finished}) => {
        if(finished) {
          expand.setValue(width / 5)
          collapse.setValue(width / 5 * 2)
          setIndex([i, null])
          setDisabled(false)
        } else {
          console.log(finished)
        }
      })

      // Animated.timing(collapse, {
      //   toValue: width / 5,
      //   duration: 300,
      //   useNativeDriver: false
      // }).start(({finished}) => {
      //   if(finished) {
      //     Animated.timing(expand, {
      //       toValue: width / 5 * 2,
      //       duration: 300,
      //       useNativeDriver: false
      //     }).start(({finished}) => {
      //       if(finished) {
      //         expand.setValue(width / 5)
      //         collapse.setValue(width / 5 * 2)
      //         setIndex([i, null])
      //         setDisabled(false)
      //       }
      //     })
      //   }
      // })
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{flex: 1, flexDirection: 'row'}}>
        {cities.map((e, i) => {

          return (
            <Animated.View style={{width: Index[0] == i ? collapse : Index[1] == i ? expand : width / 5, height: '100%'}} key={i}>
              <Pressable
                style={{flex: 1}}
                onPress={() => Disabled ? null : changeIndex(i)}>
                <Video
                  source={e.videoAsset}
                  style={{width: '100%', height: '100%', position: 'absolute'}}
                  muted={true}
                  paused={Index[1] == i ? false : Index[0] != i ? true : false}
                  resizeMode='cover'
                  repeat={true}
                  seek={0}
                  
                />
                <Animated.View style={{
                  width: height / 3,
                  height: width / 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  opacity: Index[0] == i ? collapse.interpolate({
                    inputRange: [width / 5, width / 5 * 2],
                    outputRange: [1, 0]
                  }) : Index[1] == i ? expand.interpolate({
                    inputRange: [width / 5, width / 5 * 2],
                    outputRange: [1, 0]
                  }) : 1,
                  transform: [{
                    rotateZ: '90deg'
                  }],
                  top: 94
                }}>
                  <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold', textTransform: 'capitalize'}}>{e.name}</Text>
                </Animated.View>
                <Animated.View style={{
                  opacity: Index[0] == i ? collapse.interpolate({
                    inputRange: [width / 5, width / 5 * 2],
                    outputRange: [0, 1]
                  }) : Index[1] == i ? expand.interpolate({
                    inputRange: [width / 5, width / 5 * 2],
                    outputRange: [0, 1]
                  }) : 0,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>{getHours(e.timezone)}</Text>
                  <Text style={{color: 'white'}}>{e.nativeName}</Text>
                  <Text style={{
                      color: 'white'
                  }}>{getDate(e.timezone)}</Text>
                </Animated.View>
              </Pressable>
            </Animated.View>
          )
        })}
      </View>
      <View style={{flex: 2}}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
