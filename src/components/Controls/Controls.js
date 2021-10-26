import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import DataPoint from '../DataPoint/DataPoint'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../../state/index'
import { nanoid } from 'nanoid'
import './Controls.css'

const Controls = ({ data }) => {
  const dispatch = useDispatch()
  const [newVal, setNewValue] = useState(0)
  const { addDataPoint } = bindActionCreators(actionCreators, dispatch)

  const add = () => {
    addDataPoint({
      id: nanoid(),
      value: Number(newVal),
      datetime: new Date().toISOString(),
      present: true,
    })
  }
  const updateVal = (event) => {
    setNewValue(event.target.value)
  }
  const submit = (event) => {
    event.preventDefault()
    add()
  }
  return (
    <form onSubmit={submit}>
      <label>
        <h3 className="label">Data</h3>
        <input type="number" onChange={updateVal} value={newVal} />
      </label>
      <table>
        <thead>
          <tr>
            <th colSpan="3" className="table-header">
              List of values
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ value, id, datetime }) => {
            return (
              <DataPoint key={id} id={id} value={value} datetime={datetime} />
            )
          })}
        </tbody>
      </table>
    </form>
  )
}

export default Controls
