import React from "react";
import styled from "styled-components";
import {MaterialCommunityIcons} from '@expo/vector-icons'

const Container = styled.View`
    flex-direction: row;
    margin-vertical: 4px;
    align-item: center;
    justify-content: center;

`
export default function Rating({rating}){
    const totalOfFullStars = Math.floor(rating / 2)
    const starOutLineArray = Array(5 - totalOfFullStars).fill('star-outline')
    const fullStarsArray = Array(totalOfFullStars).fill('star')
    const ratingStars = [...fullStarsArray, ...starOutLineArray]

    return (
        <Container>
            {ratingStars.map((icon, index) => {
                return <MaterialCommunityIcons key={index} name={icon} size={16} color="gray" />;
            })}
        </Container>
    )
}

const totalOfFullStars = Math.floor(rating / 2)
const starOutLineArray = Array(5 - totalOfFullStars).fill('star-outline')
const fullStarArray = Array(totalOfFullStars).fill('star')
const ratingStars = [...fullStarArray, ...starOutLineArray]