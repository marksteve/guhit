import React, { ChangeEvent } from 'react'
import { Terminal } from 'react-feather'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import 'twin.macro'
import Table from '../components/Table'
import { edgeAdded, elementDataUpdated } from '../store'
import { NodeContainer, NodeLabel } from './common'

type CustomCodeProps = NodeProps<{
  name: string
  code: string
  error: string
  columns: string[]
  head: any[]
}>

export default function CustomCode({ id, data, selected }: CustomCodeProps) {
  const dispatch = useDispatch()

  function handleChange(key: string) {
    return function (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      dispatch(
        elementDataUpdated({
          id,
          data: { [key]: e.target.value },
        })
      )
    }
  }

  function handleConnect(connection) {
    const { source, target } = connection
    dispatch(edgeAdded({ source, target }))
  }

  return (
    <NodeContainer selected={selected}>
      <NodeLabel>
        <Terminal />
        <input
          type="text"
          value={data.name || 'Custom Code'}
          onChange={handleChange('name')}
          tw="flex-grow"
        />
      </NodeLabel>
      <div tw="font-mono">def step(value):</div>
      <textarea
        className="nodrag"
        tw="p-0 ml-9 border font-mono focus:outline-none"
        cols={40}
        rows={10}
        defaultValue={data.code}
        onBlur={handleChange('code')}
      />
      {data.head ? <Table columns={data.columns} rows={data.head} /> : null}
      {data.error ? (
        <div tw="p-2 bg-red-500 text-white text-xs font-mono whitespace-pre">
          {data.error}
        </div>
      ) : null}
      <Handle type="target" position={Position.Left} />
      <Handle
        type="source"
        position={Position.Right}
        onConnect={handleConnect}
      />
    </NodeContainer>
  )
}
