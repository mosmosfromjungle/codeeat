import React, { useEffect } from 'react';
import cloud from '/assets/game/RainGame/baby.png'

const RainGameItemB = ({ show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    show && (
      <img
        src= {cloud} // 여기에 이미지 URL을 입력하세요.
        alt="cloud image"
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          zIndex: 3,
        }}
      />
    )
  );
};

export default RainGameItemB;
