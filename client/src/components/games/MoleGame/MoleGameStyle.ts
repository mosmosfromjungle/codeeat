import styled, { createGlobalStyle } from 'styled-components'

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  padding: 16px 16px 16px 16px;
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  border-radius: 16px;
  padding: 20px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #0000006f;

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`

export const RoundArea = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 20px;
`

export const Header = styled.div`
  margin-top: 20px;
`

export const Comment = styled.div`
  float: right;
  right: 10px;
  font-size: 20px;
  font-family: Font_DungGeun;
`

export const ProblemText = styled.div`
  margin-top: 10px;
  font-size: 25px;
  font-family: Font_DungGeun;
`

export const Content = styled.div`
  display: flex;
`

export const Moles = styled.div`
  width: 40%;
`

export const MyPoint = styled.div`
  margin-top: 100px;
  width: 30%;
  text-align: center;
`

export const YourPoint = styled.div`
  margin-top: 100px;
  width: 30%;
  text-align: center;
`

export const IsHost = styled.div`
  font-size: 35px;
  font-weight: bold;
  color: #f2ecff;
  font-family: Font_DungGeun;
`

export const CharacterArea = styled.div`
  
`

export const NameArea = styled.div`
  font-size: 35px;
  font-weight: bold;
  color: #f2ecff;
  font-family: Font_DungGeun;
`

export const PointArea = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #f2ecff;
`