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
    background: #9C8F8B;
    border-radius: 16px;
    padding: 16px;
    color: #eee;
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: max-content;

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;
    }
`

export const WaitWrapper = styled.div`
    height: 200px;
`

export const StartButton = styled.button`
    width: 120px;
    height: 40px;
    margin: auto;
    font-size: 18px;
    font-weight: bold;
    transition: opacity 0.3s;
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
    height: 30%;
`

export const CharacterArea = styled.div`
    height: 40%;
    padding: 20px;
`

export const NameArea = styled.div`
    height: 30%;
`

export const Comment = styled.div`
    text-align: center;
    font-size: 30px;
    font-family: Font_DungGeun;
`

export const TimerArea = styled.div`
    position: absolute;
    top: 20px;
    left: 46%;
    trans-form: translateX(-50%);
    font-size: 35px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    color: #fff;
`

export const GameArea = styled.div`
    display: flex;
    position: relative;
    height: 85%;

    box-shadow: 0px 0px 5px #0000006f;
    background: no-repeat center/cover url('/assets/game/RainGame/blackboard_crop.png');
    background-size: 100% 100%;
    border-radius: 20px;
`

export const Left = styled.div`
    width: 50%;
    position: relative;
    overflow: hidden;
    textAlign: center;
`

export const Right = styled.div`
    width: 50%;
    position: relative;
    overflow: hidden;
    textAlign: center;
`

export const PointArea = styled.div`
    height: 15%;
    display: flex;
    position: relative;
    font-size: 25px;
    font-family: Font_DungGeun;
`

export const FriendPoint = styled.div`
    margin: 10px;
    width: 40%;
    text-align: center;
`

export const InputArea = styled.div`
    display: flex;
    position: relative;
    margin: 20px;
    width: 20%;
    text-align: center;
`

export const MyPoint = styled.div`
    margin: 10px;
    width: 40%;
    text-align: center;
`