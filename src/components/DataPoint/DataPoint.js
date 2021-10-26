import React from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../../state/index'
import './DataPoint.css'
const DataPoint = ({ id, value, datetime }) => {
  const dispatch = useDispatch()
  const { removeDataPoint } = bindActionCreators(actionCreators, dispatch)
  const remove = (event) => {
    removeDataPoint(event.target.dataset.id)
  }
  return (
    <tr key={id}>
      <td className="number">
        <output className="datetime">{datetime}</output>
      </td>
      <td className="number">
        <output className="value">{value}</output>
      </td>
      <td>
        <button type="button" onClick={remove} data-id={id}>
          Remove
        </button>
      </td>
    </tr>
  )
}

export default DataPoint
