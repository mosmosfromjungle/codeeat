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
  background: lightgray;
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
    color: black;
  }
`

export const Content = styled.div`
  color: black;
`