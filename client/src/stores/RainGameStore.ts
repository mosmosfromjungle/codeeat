import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface

export interface RainGameUser {
    username: String,
    character: String,
    owner: string,
}

export interface KeywordRain {
    owner: String,
    y: number,
    speed: number,
    keyword: String,
    x: number,
    flicker: Boolean,
    blind: Boolean,
    accel: Boolean,
    multifly: Boolean,
    rendered: Boolean,
}
const initialKeywordRain: KeywordRain = {
    owner: '',
    y: 0,
    speed: 0.2,
    keyword: '',
    x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
    flicker: false,
    blind: false,
    accel: false,
    multifly: false,
    rendered: false,
}

export interface RainGameState {
    owner : String,
    item: String[],
    point: number,
    heart: number,
    period: Number,
    words: KeywordRain[],
    used : string[],
};
export interface RainGameStates{
    states:RainGameState[],
}
export const initialState: RainGameStates = {
    states: [],
};

// Define Slice
export const rainGameSlice = createSlice({
    
    name: "raingame",
    initialState,
    reducers: {
        updateKeywords: (state, action: PayloadAction<{ owner: string }>) => {
            const { owner } = action.payload;
            const gameStateIndex = state.states.findIndex((rgs) => rgs.owner === owner);
        
            if (gameStateIndex === -1) return;

            const lineHeight = 600;
            const gameState = state.states[gameStateIndex];
            let shouldDecrementHeart = false;
                     
            for (let i = gameState.words.length - 1; i >= 0; i--) {
                const keywordRain = gameState.words[i];
                keywordRain.y += keywordRain.speed;
        
                if(!keywordRain.rendered){
                    keywordRain.rendered=true;  
                } 
                if (keywordRain.y > lineHeight) {
                    gameState.words.splice(i,1);
                    shouldDecrementHeart = true;
                }       
            }
            
        if(shouldDecrementHeart) {
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
                // 기존 words 목록을 가져오고, 배열이 아닌 경우 빈 배열로 설정
                const existingWords = state.states[existingStateIndex].words || [];

                // receivedState.words도 배열인지 확인하고, 배열이 아닌 경우 빈 배열로 설정
                const newWords = receivedState.words || [];
    
                state.states[existingStateIndex].words = [...existingWords, ...newWords];

                state.states[existingStateIndex] = {
                    ...state.states[existingStateIndex],
                    ...receivedState,
                    words: state.states[existingStateIndex].words

                }
            } else {
                state.states.push(receivedState);
            }
        },
        setRainGameUser: (state, action: PayloadAction<RainGameUser>) => {
            const newUserData = action.payload;
            const existingStateIndex = state.states.findIndex((rgs) => rgs.owner === newUserData.clientId);

            if (existingStateIndex !== -1) {
                state.states[existingStateIndex].username = newUserData.username;
                state.states[existingStateIndex].character = newUserData.character;
                state.states[existingStateIndex].owner = newUserData.owner;
            } else {
                const newRainGameState: RainGameState = {
                    owner: newUserData.clientId,
                    item: [],
                    point: 0,
                    heart: 3,
                    period: 0,
                    words: [],
                    used: []
                };
                state.states.push(newRainGameState);
            }
        },
    },
});



export const { updateKeywords, removeKeyword, setRainGameState, setRainGameUser} = rainGameSlice.actions;

export default rainGameSlice.reducer
