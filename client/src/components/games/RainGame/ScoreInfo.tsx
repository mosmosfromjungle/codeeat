import React from 'react';

// ScoreInfo 컴포넌트는 점수와 코인을 렌더링합니다.
const ScoreInfo = ({ score, coin }) => (
    <div style={{ display: 'inline-block' }}>
        <span style={{ marginRight: '1vw', position: 'relative', zIndex: 1 }}>
            점수: {score}
        </span>
        <span style={{ marginLeft: '1vw', position: 'relative', zIndex: 1 }}>
            Coin: {coin}
        </span>
    </div>
);

export default ScoreInfo;
