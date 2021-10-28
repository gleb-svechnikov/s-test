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
    height: chartWrapperRef.current ? chartWrapperRef.current.clientHeight : 0,
    width: chartWrapperRef.current ? chartWrapperRef.current.clientWidth : 0,
  })
  const defaultSidebarWidth = 250
  const [leftBarWidth, setLeftBarWidth] = useState(defaultSidebarWidth)
  const [rightBarWidth, setRightBarWidth] = useState(defaultSidebarWidth)
  useEffect(() => {
    generateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: chartWrapperRef.current.clientHeight,
        width: chartWrapperRef.current.clientWidth,
      })
    }
    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setDimensions({
      height: chartWrapperRef.current.clientHeight,
      width: chartWrapperRef.current.clientWidth,
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
  const hideLeftBar = (event) => {
    event.target.parentElement.classList.remove('move-in')
    event.target.parentElement.classList.add('move-out')
    setLeftBarWidth(0)
  }
  const showLeftBar = (event) => {
    event.target.parentElement.classList.remove('move-out')
    event.target.parentElement.classList.add('move-in')
    setLeftBarWidth(defaultSidebarWidth)
  }

  const hideRightBar = (event) => {
    event.target.parentElement.classList.remove('move-in')
    event.target.parentElement.classList.add('move-out')
    setRightBarWidth(0)
  }
  const showRightBar = (event) => {
    event.target.parentElement.classList.remove('move-out')
    event.target.parentElement.classList.add('move-in')
    setRightBarWidth(defaultSidebarWidth)
  }

  return (
    <div className="App">
      <aside className="sidebar left" style={{ width: leftBarWidth + 'px' }}>
        {leftBarWidth === 0 ? (
          <button onClick={showLeftBar} className="show">
            ▶
          </button>
        ) : (
          <button onClick={hideLeftBar} className="hide">
            ◀
          </button>
        )}
      </aside>

      <main className="main-flex">
        <section ref={chartWrapperRef}>
          <Chart dataset={parsedData} dimensions={dimensions}></Chart>
        </section>
        <aside>
          <Controls data={onlyNewValues}></Controls>
        </aside>
      </main>
      <aside className="sidebar right" style={{ width: rightBarWidth + 'px' }}>
        {rightBarWidth === 0 ? (
          <button onClick={showRightBar} className="show">
            ◀
          </button>
        ) : (
          <button onClick={hideRightBar} className="hide">
            ▶
          </button>
        )}
      </aside>
    </div>
  )
}

export default App
