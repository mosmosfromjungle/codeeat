import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface
export interface KeywordRain {
    y: number,
    speed: number,
    keyword: string,
    x: number,
    flicker: boolean,
    blind: boolean,
    accel: boolean,
    multifly: boolean,
}
const initialKeywordRain: KeywordRain = {
    y: 0,
    speed: 1,
    keyword: '',
    x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
    flicker: false,
    blind: false,
    accel: false,
    multifly: false,
}

interface RainGameState {
    rainGameOpen: boolean,
    game: KeywordRain[],
    point: number,
    heart: number,
    keywordList: string[],
    period: number
};

// Define initial state
const initialState: RainGameState = {
    rainGameOpen: false,
    game: [initialKeywordRain],
    point: 0,
    heart: 5,
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
            if (state.heart < 1) { return }
            state.rainGameOpen = true
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        closeRainGameDialog: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            state.rainGameOpen = false
        },

        addKeyword: (state, action: PayloadAction<{ keyword: KeywordRain }>) => {
            if (state.heart < 1) { return }
            state.game.push(action.payload.keyword);
        },
        updateSpeed: (state, action: PayloadAction<number>) => {
            state.game.forEach((item) => {
                item.speed = Math.max(item.speed + action.payload, 1);
            });
        },
        updatePeriod: (state, action: PayloadAction<number>) => {
            state.period = Math.max(state.period + action.payload, 1000);
        },

        updateGame: (state, action: PayloadAction<{ lineHeight: number }>) => {
            let shouldDecrementHeart = false;

            state.game.forEach((item) => {
                const newY = item.y + item.speed;
                if (newY > action.payload.lineHeight && item.y <= action.payload.lineHeight) {
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
        Flicker: (state, action: PayloadAction<string>) => {
            const keyword = action.payload;
            const item = state.game.find((item) => item.keyword === keyword);
  

            if (item && item.accel) {
                item.accel = false;
            }
        },
        Blind: (state, action: PayloadAction<string>) => {
            const keyword = action.payload;
            const item = state.game.find((item) => item.keyword === keyword);
  

            if (item && item.accel) {
                item.accel = false;
            }
        },
        Accel: (state, action: PayloadAction<string>) => {
            const keyword = action.payload;
            const item = state.game.find((item) => item.keyword === keyword);
  

            if (item && item.accel) {
                item.accel = false;
            }
        },
        Multifly: (state, action: PayloadAction<string>) => {
            const keyword = action.payload;
            const item = state.game.find((item) => item.keyword === keyword);
  

            if (item && item.accel) {
                item.accel = false;
            }
        },
    },
});


export const { openRainGameDialog, closeRainGameDialog, addKeyword, updateGame, removeKeyword, resetRainGame, updatePeriod, updateSpeed } = rainGameSlice.actions;


export default rainGameSlice.reducer
