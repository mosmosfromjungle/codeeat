import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const AudioSlice = createSlice({
  name: 'Audio',
  initialState: {
    MainBgm: true,
    MoleGameBgm: false,
    BrickGameBgm: false,
    RainGameBgm: false,
  },
  reducers: {
      toggleMainBgm: (state) => {
        state.MainBgm = !state.MainBgm
      },
      playMainBgm: (state, action: PayloadAction<boolean>) => {
        state.MainBgm = action.payload
      },
      playMoleGameBgm: (state, action: PayloadAction<boolean>) => {
        state.MoleGameBgm = action.payload
      },
      playBrickGameBgm: (state, action: PayloadAction<boolean>) => {
        state.BrickGameBgm = action.payload
      },
      playRainGameBgm: (state, action: PayloadAction<boolean>) => {
        state.RainGameBgm = action.payload
      },
  },
});

export const {
    toggleMainBgm,
    playMainBgm,
    playMoleGameBgm,
    playBrickGameBgm,
    playRainGameBgm
} = AudioSlice.actions;

export default AudioSlice.reducer;
