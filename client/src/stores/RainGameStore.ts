import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface

export interface RainGameUser {
    name: String,
    anim: String,
}

export interface KeywordRain {
    owner: String,
    y: Number,
    speed: Number,
    keyword: String,
    x: number,
    flicker: Boolean,
    blind: Boolean,
    accel: Boolean,
    multifly: Boolean,
}
const initialKeywordRain: KeywordRain = {
    owner: '',
    y: 0,
    speed: 1,
    keyword: '',
    x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
    flicker: false,
    blind: false,
    accel: false,
    multifly: false,
}

export interface RainGameState {
    owner : String,
    rainGameOpen: Boolean,
    item: String[],
    point: Number,
    heart: Number,
    period: Number,
    words: KeywordRain[],
};

export interface RainGameStates {
    states: RainGameState[],
};

// Define initial state
export const initialState: RainGameStates = {
    states: [],
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

        updateKeywords: (state, action: PayloadAction<{ owner: string }>) => {
            const { owner } = action.payload;
            const gameStateIndex = state.states.findIndex((rgs) => rgs.owner === owner);
        
            if (gameStateIndex === -1) return;

            const lineHeight = window.innerHeight * 0.8;
        
            const gameState = state.states[gameStateIndex];
            let shouldDecrementHeart = false;
            for (let i = gameState.words.length - 1; i >= 0; i--) {
                gameState.words[i].y += gameState.words[i].speed;

                if (gameState.words[i].y > lineHeight) {
                    gameState.words.splice(i, 1);
                    shouldDecrementHeart = true;
            }
        }
        if (shouldDecrementHeart) {
            gameState.heart -= 1;
        }
    },
        
        removeKeyword: (state, action: PayloadAction<{ keyword:string, owner: string }>) => {
            const { keyword, owner } = action.payload;
            const gameStateIndex = state.states.findIndex(rgs => rgs.owner === owner);

            if(gameStateIndex === -1) return;

            const gameState = state.states[gameStateIndex];
            const indexToRemove = gameState.words.findIndex(
                item => item.keyword === keyword);

            if (indexToRemove !== -1) {
                const removedItem = gameState.words.splice(indexToRemove, 1)[0];
                gameState.point += 1;

            if (removedItem.flicker) {
                gameState.item.push('f');
            }
            if (removedItem.blind) {
                gameState.item.push('b');
            }
            if (removedItem.accel) {
                gameState.item.push('a');
            }
            if (removedItem.multifly) {
                gameState.item.push('m');
            }
            }   
        },


        Flicker: (state, action: PayloadAction<{ keyword: string, owner: string }>) => {
            const { keyword, owner } = action.payload;
            const gameStateIndex = state.states.findIndex(rgs => rgs.owner === owner);
            
            if (gameStateIndex === -1) return; // 주인과 일치하는 게임 상태가 없을 경우 종료
            
            const gameState = state.states[gameStateIndex];
            const itemIndex = gameState.item.findIndex(item => item === keyword);
            
            if (itemIndex !== -1) {
                gameState.item.splice(itemIndex, 1);
            // Flicker의 추가 효과
            // 여기에 Flicker의 추가 효과를 구현해주세요.
            }
        },
            
        Blind: (state, action: PayloadAction<{ keyword: string, owner: string }>) => {
            const { keyword, owner } = action.payload;
            const gameStateIndex = state.states.findIndex(rgs => rgs.owner === owner);
            
            if (gameStateIndex === -1) return; // 주인과 일치하는 게임 상태가 없을 경우 종료
            
            const gameState = state.states[gameStateIndex];
            const itemIndex = gameState.item.findIndex(item => item === keyword);
            
            if (itemIndex !== -1) {
                gameState.item.splice(itemIndex, 1);
            // Blind의 추가 효과
            // 여기에 Blind의 추가 효과를 구현해주세요.
            }
        },
            
        Accel: (state, action: PayloadAction<{ keyword: string, owner: string }>) => {
            const { keyword, owner } = action.payload;
            const gameStateIndex = state.states.findIndex(rgs => rgs.owner === owner);
            
            if (gameStateIndex === -1) return; // 주인과 일치하는 게임 상태가 없을 경우 종료
            
            const gameState = state.states[gameStateIndex];
            const itemIndex = gameState.item.findIndex(item => item === keyword);
            
            if (itemIndex !== -1) {
            gameState.item.splice(itemIndex, 1);
            // Accel의 추가 효과
            // 여기에 Accel의 추가 효과를 구현해주세요.
            }
        },
            
        Multiply: (state, action: PayloadAction<{ keyword: string, owner: string }>) => {
            const { keyword, owner } = action.payload;
            const gameStateIndex = state.states.findIndex(rgs => rgs.owner === owner);
            
            if (gameStateIndex === -1) return; // 주인과 일치하는 게임 상태가 없을 경우 종료
            
            const gameState = state.states[gameStateIndex];
            const itemIndex = gameState.item.findIndex(item => item === keyword);
            
            if (itemIndex !== -1) {
                gameState.item.splice(itemIndex, 1);
            // Multiply의 추가 효과
            // 여기에 Multiply의 추가 효과를 구현해주세요.
            }
        },
        
        setRainGameState: (state, action: PayloadAction<RainGameState>) => {
            const receivedState = action.payload;
      
            const existingStateIndex = state.states.findIndex((rgs) => rgs.owner === receivedState.owner);
            if (existingStateIndex !== -1) {
                state.states[existingStateIndex] = receivedState;
            } else {
                state.states.push(receivedState);
            }
            console.log("받은 변화 적용하는 함수 호출됌")
        },
        
    },
});



export const { updateKeywords,openRainGameDialog, closeRainGameDialog, removeKeyword, setRainGameState} = rainGameSlice.actions;


export default rainGameSlice.reducer
