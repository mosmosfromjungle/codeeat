import { createSlice } from '@reduxjs/toolkit';
import phaserGame from '../PhaserGame';
import Game from '../scenes/Game';

const rainGameDialogSlice = createSlice({
    name: 'rainGamedialog',
    initialState: {
        rainGameOpen: false,
    },
    reducers: {
        openRainGameDialog: (state) => {
            state.rainGameOpen = true;
            const game = phaserGame.scene.keys.game as Game;
            game.disableKeys();
        },
        closeRainGameDialog: (state) => {
            state.rainGameOpen = false;
            const game = phaserGame.scene.keys.game as Game;
            game.enableKeys();
        },
    },
});

export const { openRainGameDialog, closeRainGameDialog } = rainGameDialogSlice.actions;

export default rainGameDialogSlice.reducer;