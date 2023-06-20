import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface
interface KeywordRain {
    y: number;
    speed: number;
    keyword: string;
    x: number;
    used: boolean;
    a_effect: boolean;
    b_effect: boolean;
    c_effect: boolean;
}

interface TypingGameState {
    typingGameDialogOpen: boolean,
    typinggameId: null | string,
    typinggameUrl: null | string,
    urls: Map<string, string>,
    game: KeywordRain[],
    point : number,
    heart: number,
    level: number,
    goal: number,
    keywordList: string[]
};

// Define initial state
const initialState: TypingGameState = {
    typingGameDialogOpen: true,
    typinggameId: null,
    typinggameUrl: null,
    urls: new Map(),
    game: [],
    point: 0,
    heart: 5,
    level: 1,
    goal: 100,
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
export const typinggameSlice = createSlice({
    name: "typinggame",
    initialState,
    reducers: {
        openTypinggameDialog: (state, action: PayloadAction<string>) => {
            state.typingGameDialogOpen = true
            const game = phaserGame.scene.keys.game as Game
            game.disableKeys()
        },
        closeTypinggameDialog: (state) => {
            const game = phaserGame.scene.keys.game as Game
            game.enableKeys()
            game.network.disconnectFromTypinggame(state.typinggameId!)
            state.typingGameDialogOpen = false
            state.typinggameId = null
        },
        setTypinggameUrls:(state, action: PayloadAction<{ typeinggameId:string; roomId: string}>) => {
            state.urls.set(
                action.payload.typeinggameId,
                `https://타이핑게임서버-${action.payload.roomId}`
            )
        },
        addKeyword: (state, action: PayloadAction<string>) => {
            const keyword = action.payload;

            const isKeywordUsed = state.game.some(
                item => item.keyword === keyword && item.used === true
            );

            if(!isKeywordUsed) {
             state.game.push({
                y: 0,
                speed: Math.random() * 2,
                keyword,
                x: 100 + Math.random() * 600,
                used: true,
                a_effect: false,
                b_effect: false,
                c_effect: false,
                });   
            }
        },
        updateGame: (state, action: PayloadAction<{ lineHeight: number }>) => {
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
    },
});


export const { openTypinggameDialog, closeTypinggameDialog,addKeyword, updateGame, removeKeyword } = typinggameSlice.actions;

export default typinggameSlice.reducer
