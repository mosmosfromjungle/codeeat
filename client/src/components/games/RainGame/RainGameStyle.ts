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
    background: #222639;
    border-radius: 16px;
    padding: 16px;
    color: #eee;
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: max-content;

    .close {
    position: absolute;
    top: 0px;
    right: 0px;
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

    &:hover {
    opacity: 0;
    }
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