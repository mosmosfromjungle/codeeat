import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { sanitizeId } from '../util'

interface DataStructureState {
  datastructureDialogOpen: boolean
  datastructureId: null | string
  
}
const initialState: DataStructureState = {
  datastructureDialogOpen: false,
  datastructureId: null,
}
export const datastructureSlice = createSlice({
  name: 'datastructure',
  initialState,
  reducers: {
    openDataStructureDialog: (state, action: PayloadAction<string>) => {
      state.datastructureDialogOpen = true
      state.datastructureId = action.payload
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeDataStructureDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromDataStructure(state.datastructureId!)
      state.datastructureDialogOpen = false
      state.datastructureId = null
    }
  },
})

export const { openDataStructureDialog, closeDataStructureDialog } =
datastructureSlice.actions

export default datastructureSlice.reducer