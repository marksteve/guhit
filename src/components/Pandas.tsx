import React from 'react'
import { Handle, Position } from 'react-flow-renderer'
import { useDispatch } from 'react-redux'
import 'twin.macro'
import { elementDataUpdated } from '../store'
import Table from './Table'

type PandasProps = {
  id: string
  data: {
    name: string
    code: string
    error: string
    columns: string[]
    head: any[]
  }
}

export default function Pandas({ id, data }: PandasProps) {
  const dispatch = useDispatch()

  function handleChange(key) {
    return function (e) {
      dispatch(
        elementDataUpdated({
          id,
          data: { [key]: e.target.value },
        })
      )
    }
  }

  return (
    <div tw="p-2 bg-white border flex flex-col">
      <input
        type="text"
        value={data.name || 'Pandas'}
        onChange={handleChange('name')}
      />
      <Handle type="target" position={Position.Left} />
      <textarea
        tw="p-2 border font-mono"
        cols={40}
        rows={10}
        defaultValue={data.code}
        onBlur={handleChange('code')}
      />
      {data.head ? <Table columns={data.columns} rows={data.head} /> : null}
      {data.error ? (
        <div tw="p-2 bg-red-500 text-white text-xs font-mono whitespace-pre">{data.error}</div>
      ) : null}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
