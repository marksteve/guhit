import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import indentString from 'indent-string'
import { customAlphabet } from 'nanoid'
import { lowercase, numbers } from 'nanoid-dictionary'
import { getOutgoers } from 'react-flow-renderer'
import { asyncRun } from './py-worker'

const elementId = customAlphabet(lowercase + numbers, 10)

async function* processFlow(src, elements) {
  let prevValue = `rv_${src.id}`
  yield src
  let curr = src
  while (true) {
    const outgoers = getOutgoers(curr, elements)
    if (outgoers.length < 1) {
      break
    }
    curr = outgoers[0]
    const currValue = `rv_${curr.id}`
    const { code } = curr.data
    const { results, error } = await asyncRun(
      `
def step_${curr.id}(value):
${indentString(code, 4)}

${currValue} = step_${curr.id}(${prevValue}.copy())

import json
json.dumps({
  "columns": list(${currValue}.columns),
  "head": ${currValue}.head().to_dict(orient="records"),
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
      // FIXME: Should show error for rest
      continue
    }
    prevValue = currValue
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
    const src = elements.find((e) => e.type === 'localFile')
    const processedElements: Record<string, any> = {}
    for await (const element of processFlow(src, elements)) {
      processedElements[element.id] = element
    }
    return processedElements
  }
)

const elementsSlice = createSlice({
  name: 'elements',
  initialState: [],
  reducers: {
    nodeAdded(state, action) {
      const { type, data } = action.payload
      const id = elementId()
      state.push({
        id,
        type,
        data,
        position: { x: 128, y: 128 },
      })
    },
    edgeAdded(state, action) {
      const { source, target } = action.payload
      const id = elementId()
      state.push({
        id,
        source,
        target,
      })
    },
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

export const { nodeAdded, edgeAdded, elementDataUpdated } =
  elementsSlice.actions

export const store = configureStore({
  reducer: {
    elements: elementsSlice.reducer,
  },
})
