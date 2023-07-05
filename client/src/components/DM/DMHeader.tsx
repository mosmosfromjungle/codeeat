import styled from 'styled-components';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { ChevronLeft } from 'react-iconly'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setShowDMList, setShowDMRoom } from '../../stores/DMStore';

export function DMHeader() {
  const dispatch = useAppDispatch();
  const friendName = useAppSelector((state) => state.dm.receiverName)
  return (
    <Wrapper>
              <Title>{friendName}</Title>
              <IconButton
                aria-label="close dialog"
                className="back"
                onClick={() => {
                  dispatch(setShowDMList(true));
                  dispatch(setShowDMRoom(false));
                }}
              ><ChevronLeft
              set="bold"
              primaryColor="white"/></IconButton>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowDMRoom(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
        </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  height: 40px;
  background: #004755;
  border-radius: 10px 10px 0px 0px;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
  .back {
    position: absolute;
    top: 2px;
    left: -2px;
  }
`
const Title = styled.div`
  position: absolute;
  color: white;
  font-size: 20px;
  font-weight: bold;
  top: 9px;
  left: 40px;
  font-family: Font_DungGeun;
`