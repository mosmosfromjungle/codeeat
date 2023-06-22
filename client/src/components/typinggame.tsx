import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import typing_Background from "../../public/img/typinggame/blackboard.png"
import styled from 'styled-components';
import { addKeyword, updateGame, removeKeyword } from "../stores/TypingGameStore";
import * as Colyseus from "colyseus.js";


export function TypingGame() {
    const keywordInput = useRef<HTMLInputElement>(null);
    const canvasHeight = 1170;
    const lineHeight = canvasHeight - 500;

    const state = useSelector((state: any) => state.typingGame)

    const dispatch = useDispatch();

    useEffect(() => {
        if (state.heart <= 0){
            return;
        }
        // 초기 speed, period 설정
        let speed = 0.5;
        let period = 2000;

        // 7초마다 speed 변경, 최대 1
        const interval3 = setInterval(() => {
            speed = Math.max(speed + 0.005, 1);
        }, 7000);
        
        // 7초마다 period 변경, 최대 1000
        const interval4 = setInterval(() => {
            period = Math.max(period - 50, 1000);
        }, 7000);

        // period 마다 단어 생성
        const interval1 = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * state.keywordList.length);
            const keyword = state.keywordList[randomIndex];
            dispatch(addKeyword({keyword, speed}));
        },period);

        // 15ms 마다 게임 상태를 업데이트
        const interval2 = setInterval(() => {
            dispatch(updateGame({ lineHeight }));
        }, 15);
    },[]);

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
        return <h1 style={{ textAlign: 'center' }}>게임 오버 :(</h1>;

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
                    {state.game.map((item, index) => (
                        <h5
                            key={index}
                            style={{
                                position: "absolute",
                                fontFamily: 'CustomFont',
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

export default TypingGame;