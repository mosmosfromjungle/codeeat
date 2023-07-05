import styled, { createGlobalStyle } from 'styled-components'
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
  background-color: lightgray;
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
  font-size: 30px;
  margin: 16px 16px 16px 16px;
  position: relative;
  display: flex;
  flex-direction: row;
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
  background-color: gray;
  color: white;
  position: relative;
  // display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 8px 0 0;
  padding: 32px;

  font-size: 25px;
  line-height: 1.15;
`

export const QuizWrapper = styled.div`
  width: 70%;
  background-color: #666666;
  border-radius: 20px;
  margin: 0 0 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 7px solid yellow;
`

export const BottomWrapper = styled.div`
  height: 55%;
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
  background-color: gray;
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

export const ScoreWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

export const OppInfo = styled.div`
  width: 40%;
  position: relative;
  display: flex;
  // flex-direction: column;
  // justify-content: center;
  align-items: center;
`

export const MyInfo = styled.div`
  width: 40%;
  position: relative;
  display: flex;
  // flex-direction: column;
  // justify-content: center;
  align-items: center;
`

export const MyWrapper = styled.div`
  width: 50%;
  border-radius: 20px;
  background-color: #666666;
  color: gray;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between
  // justify-content: center;
  align-items: center;
  margin: 0 8px 0 0;
  padding: 32px;
  border: 7px solid green;
`

export const ImageArrayWrapper = styled.div`
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-bottom: 20px;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
  // width: 100%;
  // height: 100%;
`

export const CommandArrayWrapper = styled.div`
  display: flex;
  // flex-grow: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: lightgray;
  border-radius: 16px;
  color: gray;
  position: relative;
  overflow: auto;
  padding: 16px;
  font-size: 28px;
`

export const ImageContainer = styled.div`
  position: relative;
  margin: 10px;
  height: 100px;
`

export const ImageText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  // background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: 'CustomFont', sans-serif;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0px 0px 12px rgba(0, 0, 0, 0.9);
`

export const MyBracket = styled.div`
  position: relative;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  margin-top: 30px;
`

export const OppBracket = styled.div`
  position: relative;
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  margin-top: 30px;
  color: white
`

export const CustomInput = styled.input`
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
  background-color: black;
  width: 80%;
  // height: 100px;
`

export const CustomButton = styled.text`
  && {
    font-family: 'CustomFont', sans-serif;
    font-size: 32px;
    color: white;
    margin: 10px;
    &:hover {
      color: blue;
  }
`

export const OppOption = styled.div`
  font-family: 'CustomFont', sans-serif;
  font-size: 32px;
  color: white;
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
  font-size: 32px;
  color: white;
  text-align: center;
`

export const Answer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`

export const Left = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Right = styled.div`
  width: 20%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  background-color: white;

  Button {
    font-size: 20px;
    font-family: 'CustomFont', sans-serif;
  }
`

export const CharacterArea = styled.div`
`

export const NameArea = styled.div`
  width: 100%;
  text-align: center;
  font-size: 25px;
`

export const Special = styled.span`
  color: yellow;
`

export const RoundWinnerModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222639;
  border-radius: 24px;
  box-shadow: 0px 10px 24px #0000006f;
  padding: 50px;
  z-index: 1000;
  font-size: 15px;
  color: #eee;
  text-align: center;
  font-family: Font_DungGeun;
  font-size: 30px;
  line-height: 1.5;
`