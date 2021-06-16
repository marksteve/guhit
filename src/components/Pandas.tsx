import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'
import styles from './Pandas.module.css'
import { useDispatch } from 'react-redux'
import { elementDataUpdated } from '../store'

type PandasProps = {
  id: string
  data: {
    code: string
  }
}

export default function Pandas({ id, data }: PandasProps) {
  const dispatch = useDispatch()
  function handleChange(e) {
    dispatch(
      elementDataUpdated({
        id,
        data: { code: e.target.value },
      })
    )
  }
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Left} />
      <TextareaAutosize cols={40} value={data.code} onChange={handleChange} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
