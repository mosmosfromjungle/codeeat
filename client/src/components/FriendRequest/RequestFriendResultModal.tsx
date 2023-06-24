import react, { useState } from 'react';
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Close';
import logo from '../../images/logo.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../../hooks';

import Cookies from 'universal-cookie';
const cookies = new Cookies();
interface Props {
  message: string;
}

export default function RequestFriendResultModal(props) {

  const handleClick = () => {
    props.setAddFriendResult(0);
  };

  const addFriendResult = props.addFriendResult;

  switch (addFriendResult) {
    case 1: //친구요청을 성공했을 때
      return (
        <Wrapper className="requestResultWrapper">
          <RequestResultHeader>
            <TitleImage src={logo} width="30" />
            <TitleText>친구 요청 성공</TitleText>
            <ButtonWrapper onClick={handleClick}>
              <ClearIcon fontSize="large" />
            </ButtonWrapper>
          </RequestResultHeader>

          <RequestResultBody>
            <div>
              <Textbox>친구요청을 보냈어요</Textbox>
            </div>
            <Buttons>
              <MyButton onClick={handleClick}>확인</MyButton>
            </Buttons>
          </RequestResultBody>
        </Wrapper>
      );
    case 2:
      return (
        <Wrapper className="requestResultWrapper">
          <RequestResultHeader>
            <TitleImage src={logo} width="30" />
            <TitleText>친구 요청 실패</TitleText>
            <ButtonWrapper onClick={handleClick}>
              <ClearIcon fontSize="large" />
            </ButtonWrapper>
          </RequestResultHeader>

          <RequestResultBody>
            <div>
              <Textbox> 이미 친구요청을 보냈어요 </Textbox>
              <Textbox>친구가 수락하면 채팅이 가능해요</Textbox>
            </div>
            <Buttons>
              <MyButton onClick={handleClick}>확인</MyButton>
            </Buttons>
          </RequestResultBody>
        </Wrapper>
      );
    default:
      return (
        <>
          <Wrapper className="requestResultWrapper">
          <RequestResultHeader>
            <TitleImage src={logo} width="30" />
            <TitleText>친구 요청 실패</TitleText>
            <ButtonWrapper onClick={handleClick}>
              <ClearIcon fontSize="large" />
            </ButtonWrapper>
          </RequestResultHeader>

          <RequestResultBody>
            <div>
              <Textbox> 이미 친구요청을 보냈어요 </Textbox>
              <Textbox>친구가 수락하면 채팅이 가능해요</Textbox>
            </div>
            <Buttons>
              <MyButton onClick={handleClick}>확인</MyButton>
            </Buttons>
          </RequestResultBody>
        </Wrapper>   
        </>
      );
  }
}

const Wrapper = styled.div`
  position: fixed;
  left: 400px;
  background-color:white;
  gap: 10px;
  bottom: 200px;
  height: 250px;
  width: 370px;
  border-radius: 25px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
  font-style: normal;
  font-weight: 400;
`;

const RequestResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  height: 60px;
  position: relative;
  // display: grid;
  grid-template-columns: 90% 10%;
  background-color: blue;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  align-items: center;
`;

const TitleText = styled.div`
  font-weight: 600;
  font-size: 24px;
  font-size: 1.5rem;
`;
const TitleImage = styled.img`
  margin-left: 3px;
  margin-right: 13px;
  width: 28px;
`;
const ButtonWrapper = styled.button`
  background: none;
  border: none;
  padding: 0px 10px 0px 0px;
`;

const RequestResultBody = styled.div`
  font-weight: 600;
  font-size: 24px;
  font-size: 1.5rem;
  background-color: 'white;
  padding: 30px 15px 20px 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 190px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
`;

const MyButton = styled.button`
  width: 120px;
  height: 40px;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: 'Ycomputer-Regular';
  border-radius: 10px;
  border: none;
  background-color: blue;
  margin: 15px 10px 10px 10px;

  &:hover {
    background-color: blue;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Textbox = styled.div`
  font-size: 20px;
  text-align: center;
  margin: 5px;
`;
