import Fab from '@material-ui/core/Fab'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import React, { useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
} from 'react-flow-renderer'
import { useSelector } from 'react-redux'
import styles from './App.module.css'
import LocalFile from './components/LocalFile'
import Pandas from './components/Pandas'
import { asyncRun } from './py-worker'

export default function App() {
  const [version, setVersion] = useState(null)
  const elements = useSelector((state) => state.elements)

  useEffect(() => {
    asyncRun(`
      import sys
      sys.version
    `).then(({ results, error }) => {
      if (error) {
        console.error(error)
      } else {
        setVersion(results)
      }
    })
  }, [])

  async function run() {}

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Laminar</h1>
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
      <div className={styles.run}>
        <Fab color="primary">
          <PlayArrowIcon onClick={run} />
        </Fab>
      </div>
      <footer className={styles.footer}>Python version: {version}</footer>
    </div>
  )
}

const nodeTypes = {
  pandas: Pandas,
  localFile: LocalFile,
}
