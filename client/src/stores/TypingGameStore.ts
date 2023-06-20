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
    a_effect: boolean;
    b_effect: boolean;
    c_effect: boolean;
}

interface TypingGameState {
    typingGameDialogOpen: boolean,
    typinggameId: null | string,
    game: KeywordRain[],
    point: number,
    heart: number,
    level: number,
    goal: number,
    keywordList: string[]
};

// Define initial state
const initialState: TypingGameState = {
    typingGameDialogOpen: false,
    typinggameId: null,
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
    name: "typingGame",
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
        addKeyword: (state, action: PayloadAction<string>) => {
            const keywordToAdd = action.payload;
            state.game.push({
                y: 0,
                speed: 3,
                keyword: keywordToAdd,
                x: 100 + Math.random() * 600,
                a_effect: false,
                b_effect: false,
                c_effect: false,
            });
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


export const { openTypinggameDialog, closeTypinggameDialog, addKeyword, updateGame, removeKeyword } = typinggameSlice.actions;

export default typinggameSlice.reducer
