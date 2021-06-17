import React from 'react'
import 'twin.macro'

type TableProps = {
  columns: string[]
  rows: any[]
}

export default function Table({ columns, rows }) {
  return (
    <table cellPadding="5" tw="text-sm my-5">
      <thead>
        <tr tw="border-b">
          {columns.map((c, i) => (
            <th key={i} tw="text-left">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} tw="border-b">
            {columns.map((c, j) => (
              <td key={j}>{r[c]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
