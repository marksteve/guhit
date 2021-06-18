import { fileOpen } from 'browser-fs-access'
import React from 'react'
import { FileText } from 'react-feather'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import 'twin.macro'
import Table from '../components/Table'
import { asyncRun } from '../py-worker'
import { edgeAdded, elementDataUpdated } from '../store'
import { NodeContainer, NodeLabel } from './common'

type LocalFileProps = NodeProps<{
  name: string
  columns: string[]
  head: any[]
}>

export default function LocalFile({ id, data, selected }: LocalFileProps) {
  const dispatch = useDispatch()

  async function handleBrowse() {
    const file = await fileOpen()
    const bytes = await file.arrayBuffer()
    const { results } = await asyncRun(
      `
import pandas as pd
import io
import json
from js import bytes
rv = rv_${id} = pd.read_csv(io.BytesIO(bytes.to_py()))
json.dumps({
  "columns": list(rv.columns),
  "head": rv.head().to_dict(orient="records"),
})
        `,
      { bytes }
    )
    const { columns, head } = JSON.parse(results)
    dispatch(
      elementDataUpdated({
        id,
        data: {
          name: file.name,
          columns,
          head,
        },
      })
    )
  }

  function handleConnect(connection) {
    const { source, target } = connection
    dispatch(edgeAdded({ source, target }))
  }

  return (
    <NodeContainer selected={selected}>
      <NodeLabel>
        <FileText /> {data.name || 'Local File'}
      </NodeLabel>
      <button
        tw="bg-gray-100 hover:bg-gray-200 p-2 text-sm"
        onClick={handleBrowse}
      >
        Browse
      </button>
      {data.head ? <Table columns={data.columns} rows={data.head} /> : null}
      <Handle
        type="source"
        position={Position.Right}
        onConnect={handleConnect}
      />
    </NodeContainer>
  )
}
