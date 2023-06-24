import React from 'react';
import styled from 'styled-components';
import { InsideDMRoom } from '../DM/DMRoom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DMList } from './DMList';

const Wrapper = styled.div`
  position: relative;
  top: 0;
  left: 0;
`;
const DMwrapper = styled.div`
  position: fixed;
  bottom: 60px;
  left: 0px;
  background: none;
  gap: 10px;
  height: 580px;
  width: 370px;
  border-radius: 25px;
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
`;

/* DMbox */
function DMbox() {

  return (
    <DMwrapper className="DMwrapper">
      <DMList />
    </DMwrapper>
  );
}

/* DMboxButton, something pop-up when clicks it */

const UnreadBadge = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin-right: -11px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: red;
  color: white;
  font-size: 12px;
`;
