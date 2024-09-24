import "./Table.css"

interface TableProps {
  columns: {
    name: string
    key: string
  }[]
  data: {
    [key: string]: any
  }[]
}

function Table({ columns, data }: TableProps) {
  return (
    <table className="ccip-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column, index) => (
              <td key={index}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
