import React from 'react';
import { ResultArea } from './RainGameStyle'

const RainGameEnd = ({ winner, reason, handleClose }) => {
  if (!winner && !reason) {
    return null;
  }
  console.log("승리 판정 컴포넌트 호출")
  const handleResultClose = () => {
    // Call server and dispatch Redux action here
    // ...

    handleClose(); // Close the result component
  };

  return (
    <ResultArea>
   {winner === 'draw' ? (
      <div>
        {reason}
        <button onClick={handleResultClose}>종료하기</button>
      </div>
    ) : (
      winner && (
        <div>
          {reason}
          <div>
            <span className="winner">{winner}</span>님이 승리하셨습니다!
          </div>
          <button onClick={handleResultClose}>종료하기</button>
        </div>
      )
    )}
  </ResultArea>
  );
};

export default RainGameEnd;