import React, { useEffect, useRef, useState } from "react";
import rain_Background from "../../../public/assets/game/RainGame/blackboard.png"
import { useSelector, useDispatch } from 'react-redux';
import { KeywordRain, addKeyword, updateGame, removeKeyword, updatePeriod, updateSpeed } from "../../stores/RainGameStore";
import { RootState } from "../../stores";
import flicker from "../../../public/assets/game/RainGame/flicker.png"
import blind from "../../../public/assets/game/RainGame/blind.png"
import accel from "../../../public/assets/game/RainGame/accel.png"
import multiply from "../../../public/assets/game/RainGame/multify.png"


export function RainGame() {
    const keywordInput = useRef<HTMLInputElement>(null);
    const canvasHeight = 1170; // 맵 높이 설정
    const lineHeight = canvasHeight - 500; // 바닥 설정
    const initialTime = 100; // 초기 시간
    const [time, setTime] = useState(initialTime);

    const state = useSelector((state: RootState) => state.raingame);

    const dispatch = useDispatch();

    useEffect(() => {
        // 게임 시간 100초 카운트
        const countdownInterval = setInterval(() => {
            setTime((prevTime) => prevTime -1);
        }, 1000);

        // 7초마다 0.05씩 단어 속도 증가
        const speedIncreaseInterval = setInterval(() => {
            dispatch(updateSpeed(0.05));
        }, 7000);

        // 7초마다 단어 생성 주기 50ms씩 감소
        const periodDecreaseInterval = setInterval(() => {
            dispatch(updatePeriod(-50));
        }, 7000)

        // 단어 생성 함수, 아이템 확률 10%
        const interval1 = setInterval(() => {
            if (state.keywordList) {
                const randomIndex = Math.floor(Math.random() * state.keywordList.length);
                const keywordText = state.keywordList[randomIndex];
                const flickerRandom = 0.1;
                const blindRandom = 0.1;
                const accelRandom = 0.1;
                const multiflyRandom = 0.1;
                const keyword = {
                    y: 0,
                    speed: 1,
                    keyword: keywordText,
                    x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
                    flicker: Math.random() < flickerRandom,
                    blind: Math.random() < blindRandom,
                    accel: Math.random() < accelRandom,
                    multifly: Math.random() < multiflyRandom,
                };
                dispatch(addKeyword({ keyword }));
            }
        }, state.period);

        // 바닥에 닿는지 20ms마다 확인
        const interval2 = setInterval(() => {
            dispatch(updateGame({ lineHeight }));
        }, 20);

        // 인터벌 정리
        return () => {
            clearInterval(interval1);
            clearInterval(speedIncreaseInterval)
            clearInterval(periodDecreaseInterval)
            clearInterval(interval2)
            clearInterval(countdownInterval)
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
            </>
        );
    }

    if (state.point >= state.goal) {
        return <h1 style={{ textAlign: 'center' }}>성공!</h1>;
    }

    return (
        <>
        {/* Timer Section */}
        <div style={{ display: "flex", justifyContent: "center", borderBottom: "6px solid black" }}>
            <div style={{ border: "2px solid black", padding: "0.5vw", fontSize: "2vw", color: "white", fontWeight: "bold" }}>
                {time}
            </div>
        </div>

        {/* Game Section */}
        <div style={{ display: "flex", position: "relative" }}>
            {/* Left Side (내것) */}
            <div style={{
    width: "50vw", height: "calc(75vh - 6px)",
    backgroundImage: `url(${rain_Background})`,
    backgroundSize: "50%",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden"
}}>
    <div style={{ position: "absolute", top: "1vh", left: "1vw", color: '#FFFFFF', fontSize: '1.5vw' }}>내것</div>
    {state.game && state.game.map((item: KeywordRain, index: number) => {
        let backgroundImage = '';
        if (item.flicker) {
            backgroundImage = `url(${flicker})`;
        } else if (item.blind) {
            backgroundImage = `url(${blind})`;
        } else if (item.accel) {
            backgroundImage = `url(${accel})`;
        } else if (item.multifly) {
            backgroundImage = `url(${multiply})`;
        }
        return (
            <h5
                key={index}
                style={{
                    position: "absolute",
                    fontSize: "1.4vw",
                    letterSpacing: '0.3vw',
                    top: `${item.y}px`,
                    left: `${item.x}px`,
                    color: '#FFFFFF',
                    backgroundImage: backgroundImage,
                    backgroundSize: '150% 150%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    zIndex: 2,
                }}
            >
                {item.keyword}
            </h5>
        );
    })}
</div>

            {/* Right Side (상대편) */}
            <div style={{
    width: "50vw", height: "calc(75vh - 6px)",
    backgroundImage: `url(${rain_Background})`,
    backgroundSize: "50%",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden"
}}>
    <div style={{ position: "absolute", top: "1vh", left: "1vw", color: '#FFFFFF', fontSize: '1.5vw' }}>내것</div>
    {state.game && state.game.map((item: KeywordRain, index: number) => {
        let backgroundImage = '';
        if (item.flicker) {
            backgroundImage = `url(${flicker})`;
        } else if (item.blind) {
            backgroundImage = `url(${blind})`;
        } else if (item.accel) {
            backgroundImage = `url(${accel})`;
        } else if (item.multifly) {
            backgroundImage = `url(${multiply})`;
        }
        return (
            <h5
                key={index}
                style={{
                    position: "absolute",
                    fontSize: "1.4vw",
                    letterSpacing: '0.3vw',
                    top: `${item.y}px`,
                    left: `${item.x}px`,
                    color: '#FFFFFF',
                    backgroundImage: backgroundImage,
                    backgroundSize: '150% 150%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    zIndex: 2,
                }}
            >
                {item.keyword}
            </h5>
        );
    })}
</div>

            {/* Black separator line */}
            <div style={{ position: "absolute", top: "75vh", left: 0, right: 0, height: "6px", background: "black", zIndex: 1 }}></div>
            
            {/* White separator line */}
            <div style={{ position: "absolute", top: "calc(75vh + 6px)", left: 0, right: 0, height: "10px", background: "white", zIndex: 0 }}></div>
        </div>
        
        {/* Input and Score Section */}
        <div style={{ display: "flex", fontSize: "1vw", position: "relative" }}> {/* 글씨 크기를 지금의 절반으로 변경 */}
            {/* Input Section - Left Side */}
            <div style={{ flex: 1, textAlign: "center" }}>
                <input
                    ref={keywordInput}
                    placeholder="text"
                    onKeyPress={(e) => keydown(e.charCode)}
                    style={{ marginRight: "1vw", fontSize: "1vw" }}
                />
                <button onClick={() => keydown(13)} style={{ marginRight: "1vw", fontSize: "1vw" }}>입력</button>
                <span style={{ marginRight: "1vw", position: "relative", zIndex: 1 }}>점수: {state.point}</span>
                <span style={{ marginLeft: "1vw", position: "relative", zIndex: 1 }}>Coin: {state.heart}</span>
            </div>
            {/* Score Section - Right Side */}
            <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ marginRight: "1vw", position: "relative", zIndex: 1 }}>점수: {state.point}</span>
                <span style={{ marginLeft: "1vw", position: "relative", zIndex: 1 }}>Coin: {state.heart}</span>
            </div>
        </div>
        </>
    );
}

export default RainGame;