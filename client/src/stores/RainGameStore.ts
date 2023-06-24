import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface
export interface KeywordRain {
    y: number;
    speed: number;
    keyword: string
    x: number;
    a_effect: boolean;
    b_effect: boolean;
    c_effect: boolean;
}

interface RainGameState {
    rainGameOpen: boolean,
    game: KeywordRain[],
    point: number,
    heart: number,
    level: number,
    goal: number,
    keywordList: string[],
    paused: boolean,
    speed: number,
    period: number
};

// Define initial state
const initialState: RainGameState = {
    rainGameOpen: false,
    game: [],
    point: 0,
    heart: 5,
    level: 1,
    goal: 100,
    paused: false,
    speed: 1,
    period: 2000,
    keywordList: [
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
        "body",
    ] as string[],
};

// Define Slice
export const rainGameSlice = createSlice({
    name: "raingame",
    initialState,
    reducers: {
        openRainGameDialog: (state) => {
            state.rainGameOpen = true
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        closeRainGameDialog: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            state.rainGameOpen = false
        },

        addKeyword: (state, action: PayloadAction<{ keyword: string }>) => {
            const { keyword } = action.payload;
            state.game.push({
                y: 0,
                speed: state.speed,
                keyword: keyword,
                x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
                a_effect: false,
                b_effect: false,
                c_effect: false,
            });
        },
        updateSpeed: (state, action: PayloadAction<number>) => {
            state.speed = Math.max(state.speed + action.payload, 1);
        },
        updatePeriod: (state, action: PayloadAction<number>) => {
            state.period = Math.max(state.period + action.payload, 1000);
        },

        updateGame: (state, action: PayloadAction<{ lineHeight: number }>) => {
            if (state.paused) {
                return;
            }
            const lineHeight = action.payload.lineHeight;
            let shouldDecrementHeart = false;

            state.game.forEach((item) => {
                const newY = item.y + item.speed;
                if (newY > lineHeight && item.y <= lineHeight) {
                    shouldDecrementHeart = true;
                }
                item.y = newY;
            });

            if (shouldDecrementHeart) {
                state.heart -= 1;
            }
        },
        removeKeyword: (state, action: PayloadAction<string>) => {
            const keywordToRemove = action.payload;
            const indexToRemove = state.game.findIndex(
                (item) => item.keyword === keywordToRemove
            );

            if (indexToRemove !== -1) {
                state.game.splice(indexToRemove, 1);
                state.point += 1;
            }
        },
        resetRainGame: (state) => {
            Object.assign(state, initialState);
        },
    },
});


export const { openRainGameDialog, closeRainGameDialog, addKeyword, updateGame, removeKeyword, resetRainGame, updatePeriod, updateSpeed } = rainGameSlice.actions;


export default rainGameSlice.reducer
