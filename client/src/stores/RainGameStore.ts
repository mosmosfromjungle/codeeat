import { createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { Interface } from "readline";

// Define Interface

export interface RainGameUser {
    username: string,
    character: string,
    clientId: string,
}

export interface KeywordRain {
    owner: string,
    y: number,
    speed: number,
    keyword: string,
    x: number,
    flicker: boolean,
    blind: boolean,
    accel: boolean,
    multifly: boolean,
    rendered: boolean,
}
const initialKeywordRain: KeywordRain = {
    owner: '',
    y: 10,
    speed: 1,
    keyword: '',
    x: Math.floor(Math.random() * (550 - 50 + 1)) + 50,
    flicker: false,
    blind: false,
    accel: false,
    multifly: false,
    rendered: false,
}

export interface RainGameState {
    owner : string,
    item: string[],
    point: number,
    heart: number,
    period: number,
    words: KeywordRain[],
    used : string[],
};
export interface RainGameStates{
    states:RainGameState[],
    users: RainGameUser[],
}
export const initialState: RainGameStates = {
    states: [],
    users: [],
};

// Define Slice
export const rainGameSlice = createSlice({
    
    name: "raingame",
    initialState,
    reducers: {
        updateKeywords: (state, action: PayloadAction<{ owner: string }>) => {
            
            const { owner } = action.payload;
            const gameStateIndex = state.states.findIndex((rgs) => rgs.owner === owner);

        
            const lineHeight = 600;
            const gameState = state.states[gameStateIndex];

            let shouldDecrementHeart = false;
         
            for (let i = gameState.words.length - 1; i >= 0; i--) {
                const keywordRain = gameState.words[i];
                const updatedKeywordRain = { ...keywordRain, y: keywordRain.y + keywordRain.speed };
                gameState.words[i] = updatedKeywordRain;
                console.log(updatedKeywordRain.y)


                if (updatedKeywordRain.y > lineHeight) {
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
            const existingUserIndex = state.users.findIndex((user) => user.clientId === newUserData.clientId);
            console.log("6")
        
            if (existingUserIndex !== -1) {
                // 새로운 배열을 만들어서 상태를 변경합니다.
                state.users = [
                    ...state.users.slice(0, existingUserIndex),
                    newUserData,
                    ...state.users.slice(existingUserIndex + 1),
                ];
            } else {
                state.users.push(newUserData);
            }
        },
    },
});



export const { updateKeywords, removeKeyword, setRainGameState, setRainGameUser} = rainGameSlice.actions;

export default rainGameSlice.reducer
