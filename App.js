import React, {useState, useEffect, useRef} from 'react'
import { FlatList, Animated, View, Image, Button, Linking} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {LinearGradient} from 'expo-linear-gradient'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import styled from 'styled-components/native';
import Rating from './components/Rating'
import Genre from './components/Genre'
import {getMovies} from './api'
import * as CONSTANTS from './constants/constants'


const Container = styled.View`
  flex: 1;
  padding-top: 50px;
  background-color: #000; 
`
const PosterContainer = styled.View`
  width: ${CONSTANTS.ITEM_SIZE}px;
  margin-top: ${CONSTANTS.TOP}px;
`
const Poster = styled.View`
  margin-horizontal: ${CONSTANTS.SPACING}px;
  padding: ${CONSTANTS.SPACING * 2}px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1)
  border-radius: 10px;
`
const PosterImage = styled.Image`
  width: 100%;
  height: ${CONSTANTS.ITEM_SIZE * 1.2}px;
  resize-mode: cover;
  border-radius: 10px;
  margin: 0 0 10px 0;
`
const PosterTitle = styled.Text`
  font-family: Syne-Mono;
  font-size: 18px;
  color: #FFF;
`
const PosterDescription = styled.Text`
  font-family: Syne-Mono;
  font-size: 12px;
  color: #FFF;
`
const DummyContainer = styled.View`
    width: ${CONSTANTS.SPACER_ITEM_SIZE}px;
`
const BackdropContainer = styled.View`
  width: ${CONSTANTS.WIDTH}px;
  position: absolute;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
  overflow: hidden;
  
`
const BackdropImage = styled.Image`
  position: absolute;
  width: ${CONSTANTS.WIDTH}px;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
  
  `
const ContentContainer = styled.View `
  position: absolute;
  width: ${CONSTANTS.WIDTH}px;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
`

export default function App() {
  
const [movies, setMovies] = useState([])
const [loaded, setLoaded] = useState(false)
let [fontLoaded] = useFonts({
  'Syne-Mono': require('./assets/fonts/SyneMono-Regular.ttf')
})
const scrollX = useRef(new Animated.Value(0)).current
useEffect(() => {
  const fetchdata = async () => {
    const data = await getMovies()
    setMovies([{key: 'left-spacer'}, ...data, {key: 'right-spacer'}])
    setLoaded(true)
  }
  fetchdata()
}, [])

if(!loaded || !fontLoaded) {
  return <AppLoading />
}

const learnMore = () => { 
  Linking.openURL("https://es.wikipedia.org/wiki/Wikipedia:Portada")
}
const Backdrop = ({movies, scrollX}) => {
  return(
    <ContentContainer>
      <FlatList
        data={movies}
        keyExtractor={item => `${item.key}-back`}
        removeClippedSubviews={false}
        contentContainerStyle={{width: CONSTANTS.WIDTH, height: CONSTANTS.BACKDROP_HEIGHT}}
        renderItem={({item, index}) => {
          if(!item.backdropPath) {
            return null
          }
        const translateX = scrollX.interpolate({
          inputRange: [(index -1) * CONSTANTS.ITEM_SIZE, index * CONSTANTS.ITEM_SIZE],
          outputRange: [0, CONSTANTS.WIDTH]
        })
        return (
          <BackdropContainer
            as={Animated.View}
            style={{transform:[{translateX: translateX}]}}
          >

          <BackdropImage source={{uri:item.backdropPath}} />
          </BackdropContainer>
        )
        }}
      />
      <LinearGradient
      colors={['rgba(0, 0, 0, 0)', 'black']}
      style={{
        height: CONSTANTS.BACKDROP_HEIGHT,
        width: CONSTANTS.WIDTH,
        position: 'absolute',
        bottom: 0,
      }}
    />
    </ContentContainer>
  )
}
return (
  <Container>
    <Backdrop movies={movies} scrollX={scrollX}/>
    <StatusBar />
    <Animated.FlatList
    onScroll={Animated.event(
      [{nativeEvent: {contentOffset: {x: scrollX}}}],
      {useNativeDriver: true}
    )}
    scrollEventThrottle={16}
    snapToInterval={CONSTANTS.ITEM_SIZE}
    decelerationRate={0}
    showsHorizontalScrollIndicator={false}
    data={movies}
    keyExtractor={item => item.key}
    horizontal
    contentContainerStyle={{
      alignItems: 'center'
    }}
    renderItem={({item, index}) => {
      if(!item.originalTitle){
        return <DummyContainer />
      }
      const inputRange = [
        (index -2) * CONSTANTS.ITEM_SIZE,
        (index -1) * CONSTANTS.ITEM_SIZE,
        index * CONSTANTS.ITEM_SIZE,
      ]
      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [0, -50, 0]
      })
      return (
        <PosterContainer>
          <Poster as ={Animated.View} style={{transform: [{translateY}]}}>
            <PosterImage source={{ uri: item.posterPath}} />
            <PosterTitle numberOfLines={1}>{item.originalTitle}</PosterTitle>
            <Rating rating={item.voteAverage} />
            <Genre genres={item.genres} 
            style={{marginBottom:'5%'}}/>
            <PosterDescription>
              <Button
                onPress={learnMore}
                title="Learn More"
                color="#841584"
                marginTop="20"
              />
            </PosterDescription>
          </Poster>
        </PosterContainer>
      )
    }}
    />
    
  </Container>
);

}