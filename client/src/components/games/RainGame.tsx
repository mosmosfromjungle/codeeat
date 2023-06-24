import React, { useEffect, useRef } from "react";
import typing_Background from "../../../public/assets/game/RainGame/blackboard.png"
import { useSelector, useDispatch } from 'react-redux';
import initialState, { openRainGameDialog, closeRainGameDialog, KeywordRain, addKeyword, resetRainGame, updateGame, removeKeyword, updatePeriod, updateSpeed } from "../../stores/RainGameStore";
import { RootState } from "../../stores";

export function RainGame() {
    const keywordInput = useRef<HTMLInputElement>(null);
    const canvasHeight = 1170;
    const lineHeight = canvasHeight - 500;

    const state = useSelector((state: RootState) => state.raingame);

    const dispatch = useDispatch();

    useEffect(() => {
        const interval1 = setInterval(() => {
            if (state.keywordList) {
                const randomIndex = Math.floor(Math.random() * state.keywordList.length);
                const keyword = state.keywordList[randomIndex];
                console.log(keyword)
                dispatch(addKeyword({ keyword }))
            }
        }, state.period);


        const speedIncreaseInterval = setInterval(() => {
            dispatch(updateSpeed(-50));
        }, 7000);

        const interval2 = setInterval(() => {
            dispatch(updateGame({ lineHeight }));
        }, state.speed);

        const hasReachedLineHeight = state.game.some(item => item.y + item.speed > lineHeight && item.y <= lineHeight);
        if (hasReachedLineHeight) {
            dispatch({ type: 'DECREMENT_HEART' });
            console.log(state.heart)
        }
    }, []);
    const removeNode = (keywordToRemove) => {
        dispatch(removeKeyword(keywordToRemove));
    };

    const keydown = (keyCode) => {
        if (keyCode === 13 && keywordInput.current) {
            const text = keywordInput.current.value;
            if (state.keywordList.includes(text)) {
                removeNode(text);
            }
            keywordInput.current.value = '';
        }
    };

    if (state.heart < 1) {
        return (
            <>
                <h1 style={{ textAlign: 'center' }}>게임 오버 :(</h1>
                {/* <button 
                    onClick={}>종료하기</button> */}
            </>
        );
    }

    if (state.point >= state.goal) {
        return <h1 style={{ textAlign: 'center' }}>성공!</h1>;
    }

    return (
        <>
            <div>
                <div style={{
                    width: "100%", height: lineHeight,
                    backgroundImage: `url(${typing_Background})`,
                    backgroundSize: "50%",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "10px solid white"
                }}>
                    {state.game && state.game.map((item: KeywordRain, index: number) => (
                        <h5
                            key={index}
                            style={{
                                position: "absolute",
                                fontFamily: '',
                                fontSize: 25,
                                letterSpacing: '3px',
                                top: item.y,
                                left: item.x,
                                color: '#FFFFFF',
                                backgroundImage: '',
                                backgroundSize: '10px 10px',
                            }}>
                            {item.keyword}
                        </h5>
                    ))}

                </div>


                <div style={{ textAlign: "center" }}>
                    <input
                        ref={keywordInput}
                        placeholder="text"
                        onKeyPress={(e) => keydown(e.charCode)}
                    />
                    <button onClick={() => keydown(13)}>입력</button>
                    <span style={{ marginRight: "10px" }}>점수: {state.point}</span>
                    <span style={{ marginLeft: "10px" }}>Coin: {state.heart}</span>
                </div>
            </div>
        </>
    );
}

export default RainGame;