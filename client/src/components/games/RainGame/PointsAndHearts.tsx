// PointsAndHearts.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores';

// PointsAndHearts 컴포넌트는 Redux store로부터 raingame 상태를 가져와서 포인트와 하트를 렌더링합니다.
const PointsAndHearts = () => {
    // raingame 상태 가져오기
    const rainGameState = useSelector((state: RootState) => state.raingame);

    // rainGameState에서 points와 heart를 추출
    const points = rainGameState?.points;
    const hearts = rainGameState?.heart;

    return(
        <div>
            <span>{points}</span>
            <span>{hearts}</span>
        </div>
    )
};

export default PointsAndHearts;
