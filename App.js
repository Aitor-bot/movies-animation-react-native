import React, {useState, useEffect} from 'react'
import { FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {AppLoading} from 'expo';
import { useFonts } from 'expo-font';
import styled from 'styled-components';
//import Rating from './components/Rating'
import Genre from './components/Genre'
import {getMovies} from './api'
import * as CONSTANTS from './constants/contants'

const Container = styled.View `
  flex: 1;
`
const PosterContainer = styled.View`
  width: ${CONSTANTS.ITEM_SIZE}px;
`
const Poster = styled.View`
  margin-horizontal: ${CONSTANTS.SPACING}px;
  padding: ${CONSTANTS.SPACING * 2}px;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 10px;
`
const PosterImage = styled.Image`
  width: 100%;
  height; ${CONSTANTS.ITEM_SIZE * 1.2}px;
  resize-mode: cover;
  border-radius: 10px;
  margin: 0 0 10px 0;
`
const PosterTitle = styled.Text`
  font-family: Syne-Mono;
  font-size: 18px;
`
const PosterDescription = styled.Text`
  font-family: Syne-Mono;
  font-size: 12px;
`
export default function App() {
  
const [movies, setMovies] = useState([])
const [loaded, setLoaded] = useState(false)
let [fontLoaded] = useFonts({
  'Syne-Mono': require('./assets/fonts/SyneMono-Regular.ttf')
})
useEffect(() => {
  const fetchdata = async () => {
    const data = await getMovies()
    setMovies(data)
    setLoaded(true)
  }
  fetchdata()
}, [])

if(!loaded || !fontLoaded) {
  return <AppLoading />
}

return (
  <Container>
    <StatusBar />
    <FlatList
    showsHorizontalScrollIndicator={false}
    data={movies}
    keyExtractor={item => item.key}
    horizontal
    contentContainerStyle={{
      alignItems: 'center'
    }}
    renderItem={({item}) => {
      return (
        <PosterContainer>
          <Poster>
            <PosterImage source={{ uri: item.posrtPath}} />
            <PosterTitle numberOfLines={1}>{item.originalTitle}</PosterTitle>
            <Rating rating={item.voteAverage} />
            <Genre genres={item.genres} />
            <PosterDescription numberOfLines={5}>{item.description}</PosterDescription>
          </Poster>
        </PosterContainer>
      )
    }}
    />
  </Container>
);

}