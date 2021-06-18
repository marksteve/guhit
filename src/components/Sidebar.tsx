import React from 'react'
import { FileText, Terminal } from 'react-feather'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { nodeAdded } from '../store'

const NodeButton = tw.button`
  p-2
  bg-gray-100
  hover:bg-gray-200
  flex
  items-center
  gap-x-2
  cursor-pointer
`

export default function Sidebar() {
  const dispatch = useDispatch()

  function addLocalFile() {
    dispatch(nodeAdded({ type: 'localFile', data: {} }))
  }

  function addCustomCode() {
    dispatch(nodeAdded({ type: 'customCode', data: { code: '' } }))
  }

  return (
    <div tw="z-10 fixed top-1/2 -translate-y-1/2 bg-white border flex flex-col gap-y-2 p-2">
      <NodeButton onClick={addLocalFile}>
        <FileText />
        Local File
      </NodeButton>
      <NodeButton onClick={addCustomCode}>
        <Terminal />
        Custom Code
      </NodeButton>
    </div>
  )
}
