import Button from '@material-ui/core/Button'
import { fileOpen } from 'browser-fs-access'
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'
import styles from './LocalFile.module.css'

type LocalFileProps = {
  data: {
    name: string
    blob: Blob
  }
  onChange: (blob: Blob) => void
}

export default function LocalFile({ data, onChange }: LocalFileProps) {
  async function handleButtonClick() {
    onChange(await fileOpen())
  }
  return (
    <div className={styles.node}>
      <Button onClick={handleButtonClick}>Open</Button>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
