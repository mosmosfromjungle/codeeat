import styled, { createGlobalStyle } from 'styled-components'

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  margin: 20px;
  color: #f2ecff;
  text-align: center;
  line-height: 1.5;
  font-size: 28px;
`

export const Comment = styled.div`
  // float: right;
  // right: 10px;
  width: 20%;
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 20px;
  font-family: Font_DungGeun;
`

export const Problem = styled.div`
  color: white;
  border-width: 5px;
  border-color: white;
  border-style: dashed;
  border-radius: 10px;
  text-align: center;
  width: 50%;
  height: 100px;
  margin: 10px auto 10px auto;
  padding: 8px;
`

export const ProblemText = styled.div`
  color: yellow;
  margin-top: 10px;
  font-size: 28px;
  font-family: Font_DungGeun;
`

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const TipArea = styled.div`
  width: 90%;
  height: 15%;
  color: white;
  text-align: center;
  margin: 32px auto 8px auto;
  font-size: 22px;
  font-family: Font_DungGeun;
`

export const YourWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 40px;
`

export const YourPoint = styled.div`
  // width: 30%; 
  text-align: center;
`

export const MyWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
`

export const MyPoint = styled.div`
  // width: 30%;
  text-align: center;
`

export const Moles = styled.div`
  // width: 40%;
  // margin: auto auto;
  list-style: none;
  width: 620px;
  // border-radius: 20px;
`

export const IsWinner = styled.div`
  margin-top: 50px;
  height: 10%;
  font-size: 50px;
  font-weight: bold;
  color: #f2ecff;
  font-family: Font_DungGeun;
`

export const IsHost = styled.div`
  margin-top: 50px;
  height: 10%;
  font-size: 35px;
  font-weight: bold;
  color: #f2ecff;
  font-family: Font_DungGeun;
`

export const CharacterArea = styled.div`
  height: 20%;
`

export const NameArea = styled.div`
  height: 15%;
  font-size: 35px;
  font-weight: bold;
  color: #f2ecff;
  font-family: Font_DungGeun;
`

export const LifeArea = styled.div `
  height: 15%;
  margin: 20px;
`

export const PointArea = styled.div`
  height: 15%;
  font-size: 25px;
  font-weight: bold;
  color: #f2ecff;
`