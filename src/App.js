import { useSelector, useDispatch } from 'react-redux'
import './App.css'
import Chart from './components/Chart/Chart'
import Controls from './components/Controls/Controls'
import { bindActionCreators } from 'redux'
import { actionCreators } from './state/index'
import { useEffect } from 'react'
import { DateTime } from 'luxon'
import React, { useRef, useState } from 'react'

function App() {
  const dispatch = useDispatch()
  const { pointReducer } = useSelector((state) => state)
  const { generateData } = bindActionCreators(actionCreators, dispatch)
  const chartWrapperRef = useRef(null)
  const [dimensions, setDimensions] = useState({
    height: chartWrapperRef.current ? chartWrapperRef.current.offsetHeight : 0,
    width: chartWrapperRef.current ? chartWrapperRef.current.offsetWidth : 0,
  })

  useEffect(() => {
    generateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: chartWrapperRef.current.offsetHeight,
        width: chartWrapperRef.current.offsetWidth,
      })
    }
    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setDimensions({
      height: chartWrapperRef.current.offsetHeight,
      width: chartWrapperRef.current.offsetWidth,
    })
  }, [chartWrapperRef])

  const parsedData = pointReducer.data
    .map((point) => {
      const datetime = DateTime.fromISO(point.datetime).toLocaleString(
        DateTime.DATETIME_SHORT
      )
      const jsdate = DateTime.fromISO(point.datetime).toJSDate()
      const value = point.value
      const id = point.id
      const present = point.present
      return { datetime, jsdate, value, id, present }
    })
    .sort((a, b) => a.jsdate - b.jsdate)
  const onlyNewValues = parsedData.filter((point) => point.present)
  return (
    <div className="App">
      <section ref={chartWrapperRef}>
        <Chart dataset={parsedData} dimensions={dimensions}></Chart>
      </section>
      <aside>
        <Controls data={onlyNewValues}></Controls>
      </aside>
    </div>
  )
}

export default App
