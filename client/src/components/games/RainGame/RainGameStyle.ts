import styled, { createGlobalStyle } from 'styled-components'

export const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  padding: 16px;
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #9c8f8b;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
  }
`

export const WaitWrapper = styled.div`
  height: 200px;
`

export const FriendInfo = styled.div`
  position: absolute;
  top: 16px;
  color: white;
  text-align: center;
  left: 50px;
  font-size: 30px;
  font-family: Font_DungGeun;
`

export const MyInfo = styled.div`
  position: absolute;
  top: 16px;
  color: white;
  text-align: center;
  right: 50px;
  font-size: 30px;
  font-family: Font_DungGeun;
`

export const Position = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const CharacterArea = styled.div`
  // height: 40%;
  // width: 30%;
  // padding: 15px;
  display: flex;
  align-items: center;
  margin: 0 8px;
`

export const NameArea = styled.div`
  // height: 30%;
  // width: 70%;
  // margin-top: 30px;
  // flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 8px;
`

export const Name = styled.div`
  margin-top: 16px;
`

export const Comment = styled.div`
  position: absolute;
  top: 20px;
  left: 50px;
  font-size: 25px;
  font-family: Font_DungGeun;
`

export const StartButton = styled.div`
  position: absolute;
  top: 40px;
  right: -30px;
  font-size: 25px;
  font-family: Font_DungGeun;
`

export const ReadyButton = styled.div`
  position: absolute;
  top: 40px;
  right: -30px;
  font-size: 25px;
  font-family: Font_DungGeun;
`

export const TimerArea = styled.div`
  position: absolute;
  top: 40px;
  left: 46%;
  trans-form: translateX(-50%);
  font-size: 35px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  color: #fff;
`

export const GameArea = styled.div`
  display: flex;
  position: relative;
  height: 85%;

  box-shadow: 0px 0px 5px #0000006f;
  background: no-repeat center/cover url('/assets/game/RainGame/blackboard.jpg');
  background-size: 100% 100%;
  border-radius: 20px;
`

export const Left = styled.div`
  width: 50%;
  position: relative;
  overflow: hidden;
  textalign: center;
  font-family: Font_DungGeun;
`

export const Right = styled.div`
  width: 50%;
  position: relative;
  overflow: hidden;
  textalign: center;
  font-family: Font_DungGeun;
`

export const PointArea = styled.div`
  width: 100%;
  height: 15%;
  display: flex;
  position: relative;
  font-size: 25px;
  font-family: Font_DungGeun;
`

export const InputArea = styled.div`
  display: flex;
  position: relative;
  margin: 16px;
  width: 10%;
  text-align: center;
  font-size: 90px;

  TextField {
    padding: 20px;
  }
`

export const PlayArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  // margin: 20px;
  padding: 16px;
`

export const FriendPoint = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20%;
  margin-top: 10px;
  padding: 16px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0px 1px 6px #0000006f;
`

export const MyPoint = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20%;
  margin-top: 10px;
  padding: 12px;
  text-align: center;
  border: 4px solid yellow;
  border-radius: 16px;
  box-shadow: 0px 1px 6px #0000006f;
`

export const Item = styled.div`
    // margin-left: 60px;
    line-height: 1.2;
    color: yellow;
    text-align: center;
    font-size: 20px;
`

