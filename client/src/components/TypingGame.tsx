import { url } from "inspector";
import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from 'styled-components';
import Background from "../scenes/Background";
import typing_Background from "../../public/img/typinggame/blackboard.png"


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


interface KeywordRain {
    y: number;
    speed: number;
    keyword: string;
    x: number;
}

export function TypingGame() {
    const [game, setGame] = useState<KeywordRain[]>([]);
    const [point, setPoint] = useState<number>(0);
    const [heart, setHeart] = useState<number>(5);
    const [level, setLevel] = useState<number>(1);
    const [goal, setGoal] = useState<number>(10);
    const [keywordList, setKeywordList] = useState<string[]>([
        "abs",
        "print",
        "list",
        "row",
        "col",
        "set",
        "style",
        "font",
        "div",
        "h1",
        "h2",
        "body"
    ]);
    const keywordInput = useRef<HTMLInputElement>(null);
    const canvasHeight = 1170;
    const lineHeight = canvasHeight - 500;

    useEffect(() => {
        const interval1 = setInterval(() => {
            const keyword =
                keywordList[Math.floor(Math.random() * keywordList.length)];
            setGame((game) => [
                ...game,
                { y: 0, speed: Math.random() * 2, keyword, x: Math.random() * 800},
            ]);
        }, 1000);

        const interval2 = setInterval(() => {
            setGame((game) =>
                game.map((item) => {
                    const newY = item.y + item.speed;
                    if (newY > lineHeight && item.y <= lineHeight) {
                        setHeart(prevHeart => prevHeart - 1);
                    }
                    return { ...item, y: newY }
                })
            );
        }, 15);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, [keywordList]);

    const removeNode = (keywordToRemove: string) => {
        setGame((game) => game.filter((item) => item.keyword !== keywordToRemove));
        setKeywordList((keywords) =>
            keywords.filter((keyword) => keyword !== keywordToRemove)
        );
    };

    const keydown = (keyCode: number) => {
        if (keyCode === 13 && keywordInput.current) {
            const text = keywordInput.current.value;
            if (keywordList.includes(text)) {
                removeNode(text);
                setPoint(point + 1);

                setKeywordList((prevKeywords) =>
                    prevKeywords.filter(keyword => keyword !== text)
                );

            }
            keywordInput.current.value = "";
        }
    };

    if (heart < 1) {
        return <h1 style={{textAlign: "center"}}>게임 오버 :(</h1>;
    }

    if (point >= goal) {
        return <h1 style={{ textAlign: "center"}}>성공!</h1>;
    }

    return (
        <>
            <GlobalStyle />
            <div>
                <div style={{
                    width: "1250px", height: lineHeight,
                    backgroundImage : `url(${typing_Background})`,
                    backgroundSize : "cover",
                    backgroundPositionY : "-63px",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "2px solid white"
                }}>
                    {game.map((item, index) => (
                        <h5 
                            key={index} 
                            style={{
                                position: "absolute", 
                                fontFamily : 'CustomFont',
                                fontSize : 25,
                                letterSpacing :'3px',
                                top: item.y, 
                                left: item.x, 
                                color : '#FFFFFF',
                                backgroundImage : '',
                                backgroundSize : '100px 100px',
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
                    <span style={{ marginRight: "10px" }}>점수: {point}</span>
                    <span style={{ marginLeft: "10px" }}>Coin: {heart}</span>
                </div>
            </div>
        </>
    );
}
