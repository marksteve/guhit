import { createSlice, configureStore } from '@reduxjs/toolkit'

const elementsSlice = createSlice({
  name: 'elements',
  initialState: [
    {
      id: '1',
      type: 'localFile',
      data: {},
      position: { x: 32, y: 128 },
    },
    {
      id: '2',
      type: 'pandas',
      data: {
        code: `
import pandas as pd
from js import blob
df = pd.DataFrame(blob)
        `.trim(),
      },
      position: { x: 256, y: 128 },
    },
    { id: 'e1-2', source: '1', target: '2' },
  ],
  reducers: {
    elementDataUpdated(state, action) {
      const { id, data } = action.payload
      const i = state.findIndex((node) => node.id === id)
      state[i].data = { ...state[i].data, ...data }
    },
  },
})

export const { elementDataUpdated } = elementsSlice.actions

export const store = configureStore({
  reducer: {
    elements: elementsSlice.reducer,
  },
})
