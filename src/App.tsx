import React from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
} from 'react-flow-renderer'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalStyles } from 'twin.macro'
import Sidebar from './components/Sidebar'
import CustomCode from './nodes/CustomCode'
import LocalFile from './nodes/LocalFile'
import { runFlow } from './store'

export default function App() {
  const elements = useSelector((state) => state.elements)
  const dispatch = useDispatch()

  function run() {
    dispatch(runFlow())
  }

  return (
    <>
      <GlobalStyles />
      <div tw="h-screen">
        <header tw="fixed inset-x-0 top-0 h-10 p-1">
          <h1 tw="text-2xl">Guhit</h1>
        </header>
        <ReactFlow
          snapToGrid
          snapGrid={[16, 16]}
          elements={elements}
          nodeTypes={nodeTypes}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} />
          <Controls />
        </ReactFlow>
        <Sidebar />
        <div tw="fixed bottom-0 right-0 m-5 z-10">
          <button
            tw="bg-blue-500 hover:bg-blue-600 text-white p-2"
            onClick={run}
          >
            Run
          </button>
        </div>
      </div>
    </>
  )
}

const nodeTypes = {
  customCode: CustomCode,
  localFile: LocalFile,
}
