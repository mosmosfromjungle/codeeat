import React, { useEffect, useRef, useState } from "react";
import rain_Background from "../../../public/assets/game/RainGame/blackboard.png";
import { useSelector, useDispatch } from 'react-redux';
import { KeywordRain, removeKeyword, updateKeywords } from "../../stores/RainGameStore";
import { RootState } from "../../stores";
import flicker from "../../../public/assets/game/RainGame/flicker.png";
import blind from "../../../public/assets/game/RainGame/blind.png";
import accel from "../../../public/assets/game/RainGame/accel.png";
import multiply from "../../../public/assets/game/RainGame/multify.png";
import Bootstrap from '../../scenes/Bootstrap';
import phaserGame from '../../PhaserGame';

const calculateWinner = (rainGameStateA, rainGameStateB, time) => {
    if (rainGameStateA && rainGameStateB) {
        if (time <= 0) {
            return rainGameStateA.points > rainGameStateB.points ? 'A' : 'B';
        } else if (rainGameStateA.heart <= 0) {
            return 'B';
        } else if (rainGameStateB.heart <= 0) {
            return 'A';
        }
    }
    return null;
};

const ScoreInfo = ({ score, coin }) => (
    <>
        <span style={{ marginRight: "1vw", position: "relative", zIndex: 1 }}>점수: {score}</span>
        <span style={{ marginLeft: "1vw", position: "relative", zIndex: 1 }}>Coin: {coin}</span>
    </>
);

export function RainGame() {
    const dispatch = useDispatch();
    const keywordInput = useRef<HTMLInputElement>(null);
    const rainGameState = useSelector((state: RootState) => state.raingame);
    const rainGameDialogState = useSelector((state: RootState) => state.rainGameDialog);
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    
    const rainGameStateA = rainGameState.states.find(rgs => rgs.owner === 'A');
    const rainGameStateB = rainGameState.states.find(rgs => rgs.owner === 'B');

    const [time, setTime ] = useState(100);
    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log("RainGame component mounted");
        bootstrap.gameNetwork.MakingWord();
        
        const timeInterval = setInterval(() => {
            setTime(prevTime => Math.max(prevTime -1, 0));
            }, 1000);

        

        const updateKeywordsInterval = setInterval(() => {
            dispatch(updateKeywords({ owner : 'A' }));
            dispatch(updateKeywords({ owner : 'B' }));
    
            if (time <= 0 || rainGameStateA?.heart <= 0 || rainGameStateB?.heart <= 0) {
                clearInterval(updateKeywordsInterval);
            }
        }, 50);

    }, []);

    const winner = calculateWinner(rainGameStateA, rainGameStateB, time);

    const keydown = (keyCode) => {
        if (keyCode === 13 && keywordInput.current) {
            const text = keywordInput.current.value;
            dispatch(removeKeyword({ keyword: text, owner: "A" }));
            keywordInput.current.value = '';
        }
    };
    console.log("RainGame component rendering");

    console.log("Words array:", rainGameStateA?.words);
    console.log("Words array:", rainGameStateB?.words);
    return (
        <>
            {/* Time Section */}
            <div
                id="timer"
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "20px",
                }}
            >
                {String(time).padStart(3, "0")}
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
                    <div style={{ position: "absolute", top: "1vh", left: "1vw", color: '#FFFFFF', fontSize: '1.5vw' }}>나</div>
                    {rainGameStateA && rainGameStateA.words.map((item: KeywordRain, index :number)=> {
                        if(item.y > window.innerHeight*0.8){
                            return null;
                        }
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
                    <div style={{ position: "absolute", top: "1vh", left: "1vw", color: '#FFFFFF', fontSize: '1.5vw' }}>상대편</div>
                    {rainGameStateB && rainGameStateB.words.map((item: KeywordRain, index: number) => {
                        if(item.y > window.innerHeight*0.8){
                            return null;
                        }
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
                                    left: `${item.x + 300}px`,
                                    color: '#FF7F00',
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

            {/* Winner Section */}
            {winner && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 30, color: 'red' }}>
                    {winner} is the winner!
                </div>
            )}

            {/* Input and Score Section */}
            <div style={{ display: "flex", fontSize: "1vw", position: "relative" }}>
                {/* Input Section - Left Side */}
                <div style={{ flex: 1, textAlign: "center" }}>
                    <input
                        ref={keywordInput}
                        placeholder="text"
                        onKeyPress={(e) => keydown(e.charCode)}
                        style={{ marginRight: "1vw", fontSize: "1vw" }}
                    />
                    <button onClick={() => keydown(13)} style={{ marginRight: "1vw", fontSize: "1vw" }}>입력</button>
                    <ScoreInfo score={rainGameState.states[0].point} coin={rainGameState.states[0].heart} />
                </div>
                {/* Score Section - Right Side */}
                <div style={{ flex: 1, textAlign: "center" }}>
                <ScoreInfo score={rainGameState.states[0].point} coin={rainGameState.states[0].heart} />
                </div>
            </div>
        </>
    );
}
export default RainGame;