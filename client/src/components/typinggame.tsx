import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import typing_Background from "../../public/img/typinggame/blackboard.png"
import styled, { createGlobalStyle } from 'styled-components';
import { addKeyword, updateGame, removeKeyword } from "../stores/TypingGameStore";
import * as Colyseus from "colyseus.js";


const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('/assets/fonts/neodgm_code.woff') format('woff');
  }

  body {
    font-family: 'CustomFont', sans-serif;
    font-size: 24px;
    color : #000000;
  }
`;

export function TypingGame() {
    const keywordInput = useRef<HTMLInputElement>(null);
    const canvasHeight = 1170;
    const lineHeight = canvasHeight - 500;

    const state = useSelector((state: any) => state.typingGame)

    const dispatch = useDispatch();

    useEffect(() => {
        let wordCreationInterval = 1000;
        const interval1 = setInterval(() => {

            const unusedkeywords = state.keywordList.filter(keyword => {
                // game 배열에서 해당 키워드가 이미 있는지 확인
                return !state.game.some(item => item.keyword === keyword);
            });
            if (unusedkeywords.length > 0) {
                const randomIndex = Math.floor(Math.random() * unusedkeywords.length);
                const keyword = unusedkeywords[randomIndex];

                // 중복된 키워드가 아니라면 추가
                dispatch(addKeyword(keyword));
            }
        }, wordCreationInterval);

        const speedIncreaseInterval = setInterval(() => {
            wordCreationInterval = Math.max(wordCreationInterval - 50, 100);
        }, 7000);

        const interval2 = setInterval(() => {
            dispatch(updateGame({ lineHeight }));
        }, 15);


        const hasReachedLineHeight = state.game.some(item => item.y + item.speed > lineHeight && item.y <= lineHeight);
        if (hasReachedLineHeight) {
            dispatch({ type: 'DECREMENT_HEART' });
            console.log(state.heart)
        }


        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(speedIncreaseInterval);
        };
    }, [state.game, state.keywordList, lineHeight, dispatch]);

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
            <GlobalStyle />
            <div>
                <div style={{
                    width: "1250px", height: lineHeight,
                    backgroundImage: `url(${typing_Background})`,
                    backgroundSize: "cover",
                    backgroundPositionY: "-63px",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "2px solid white"
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
                                backgroundSize: '100px 100px',
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