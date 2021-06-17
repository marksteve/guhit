import { fileOpen } from 'browser-fs-access'
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import 'twin.macro'
import { asyncRun } from '../py-worker'
import { elementDataUpdated } from '../store'
import Table from './Table'

type LocalFileProps = {
  data: {
    name: string
    columns: string[]
    head: any[]
  }
  onChange: (blob: Blob) => void
}

export default function LocalFile({ id, data }: LocalFileProps) {
  const dispatch = useDispatch()

  async function handleButtonClick() {
    const file = await fileOpen()
    const bytes = await file.arrayBuffer()
    const { results } = await asyncRun(
      `
        import pandas as pd
        import io
        import json
        from js import bytes
        df = df_${id} = pd.read_csv(io.BytesIO(bytes.to_py()))
        json.dumps({
          "columns": list(df.columns),
          "head": df.head().to_dict(orient="records"),
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

  return (
    <div tw="p-2 bg-white border flex flex-col items-start">
      {data.name || 'Local File'}
      <button
        tw="bg-gray-100 hover:bg-gray-200 p-2 text-sm"
        onClick={handleButtonClick}
      >
        Browse
      </button>
      {data.head ? <Table columns={data.columns} rows={data.head} /> : null}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
