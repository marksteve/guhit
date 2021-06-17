import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getOutgoers } from 'react-flow-renderer'
import { asyncRun } from './py-worker'

async function* processFlow(src, elements) {
  let df = `df_${src.id}`
  yield src
  let curr = src
  while (true) {
    const outgoers = getOutgoers(curr, elements)
    if (outgoers.length < 1) {
      break
    }
    curr = outgoers[0]
    const currDf = `df_${curr.id}`
    const { code } = curr.data
    const { results, error } = await asyncRun(
      `
import json
df = ${df}
${code}
${currDf} = df
json.dumps({
  "columns": list(df.columns),
  "head": df.head().to_dict(orient="records"),
})
`,
      {}
    )
    if (error) {
      console.log(error)
      yield {
        ...curr,
        data: { ...curr.data, error },
      }
      continue
    }
    const { columns, head } = JSON.parse(results)
    yield {
      ...curr,
      data: { ...curr.data, columns, head, error: null },
    }
  }
}

export const runFlow = createAsyncThunk(
  'elements/runFlow',
  async (_, thunkAPI) => {
    const { elements } = thunkAPI.getState() as any
    const processedElements: Record<string, any> = {}
    for await (const element of processFlow(elements[0], elements)) {
      processedElements[element.id] = element
    }
    return processedElements
  }
)

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
        name: 'Convert to PHP',
        code: `
df["CostPHP"] = df["CostUSD"] * 50
        `.trim(),
      },
      position: { x: 512, y: 128 },
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
  extraReducers: {
    [runFlow.fulfilled]: (state, action) => {
      const processedElements = action.payload
      return state.map((element) => processedElements[element.id] || element)
    },
  },
})

export const { elementDataUpdated } = elementsSlice.actions

export const store = configureStore({
  reducer: {
    elements: elementsSlice.reducer,
  },
})
