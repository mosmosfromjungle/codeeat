import React, { useEffect } from 'react';
import blind from '/assets/game/RainGame/blind.png'

const RainGameItemB = ({ show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    show && (
      <img
        src= {blind}
        alt="blind image"
        style={{
          position: 'absolute',
          top: '50%',
          left:'10%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          width: '90%',
          height: '90%',
        }}
      />
    )
  );
};

export default RainGameItemB;
