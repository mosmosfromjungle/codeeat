import styled, { createGlobalStyle } from 'styled-components'
import classroom from '../../images/game/brickGame/classroom.png'
import playground from '../../images/game/brickGame/playground.png'
import Button from '@mui/material/Button'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('/assets/fonts/neodgm_code.woff') format('woff');
  }

  body {
    font-family: 'CustomFont', sans-serif;
  }
`

export const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px;
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  // background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  background-color: beige;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #0000006f;
  // justify-content: center;
  // align-items: center;

  .close {
    position: absolute;
    color: black;
    top: 4px;
    right: 4px;
  }
`

export const RoundWrapper = styled.div`
  color: black;
  font-size: 28px;
  margin: 16px 16px 8px 16px;
  padding: 8px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const TopWrapper = styled.div`
  // width: 100%;
  height: 20%;
  background-color: gray;
  border-radius: 20px;
  margin: 8px 16px 8px 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const MidWrapper = styled.div`
  height: 30%;
  // width: 100%;
  margin: 8px 16px 8px 16px;
  display: flex;
  flex-direction: row;
  position: relative;
  // padding: 16px;
`

export const HelperWrapper = styled.div`
  width: 30%;
  border-radius: 20px;
  background-color: lightgray;
  color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 8px 0 0;
  padding: 32px;

  font-size: 30px;
`

export const QuizWrapper = styled.div`
  width: 70%;
  background-color: gray;
  border-radius: 20px;
  margin: 0 0 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const BottomWrapper = styled.div`
  height: 40%;
  // width: 100%;
  margin: 8px 16px 8px 16px;
  display: flex;
  flex-direction: row;
  position: relative;
  // padding: 16px;
`

export const OpponentWrapper = styled.div`
  width: 50%;
  border-radius: 20px;
  background-color: lightgray;
  color: gray;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between
  // justify-content: center;
  align-items: center;
  margin: 0 8px 0 0;
  padding: 32px;
`

export const MyWrapper = styled.div`
  width: 50%;
  background-color: gray;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0 8px;
  padding: 32px;
`

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
  width: 100%;
  height: 100%;
`

export const CommandArrayWrapper = styled.div`
  display: flex;
  // flex-grow: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: beige;
  color: gray;
  position: relative;
  overflow: auto;
`

export const ImageContainer = styled.div`
  position: relative;
  margin: 10px;
`
export const ImageText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  // background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: 'CustomFont', sans-serif;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0px 0px 12px rgba(0, 0, 0, 0.9);
`
export const CustomBracket = styled.div`
  position: relative;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  margin-top: 60px;
`
export const CustomInput = styled.input`
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
  background-color: black;
  width: 80%;
  // height: 100px;
`
export const CustomButton = styled(Button)`
  && {
    font-family: 'CustomFont', sans-serif;
    font-size: 32px;
    color: white;
    &:hover {
      color: blue;
  }
`
export const CustomResetButton = styled(Button)`
  && {
    font-family: 'CustomFont', sans-serif;
    font-size: 24px;
    color: white;
    &:hover {
      color: blue;
  }
`
export const CustomList = styled.div`
  font-family: 'CustomFont', sans-serif;
  font-size: 28px;
  color: white;
  width: 80%;
  line-height: 1.5;
  text-align: center;
`

