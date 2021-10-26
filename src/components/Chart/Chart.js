import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './Chart.css'

const Chart = ({ dimensions, dataset }) => {
  const d3Chart = useRef()
  useEffect(() => {
    draw(dataset, dimensions.width, dimensions.height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, dimensions])

  const draw = (data, chartWidth, chartHeight) => {
    d3.selectAll('svg > *').remove()
    const margin = { top: 20, right: 30, bottom: 30, left: 30 }
    const offsetWidth = chartWidth - margin.left - margin.right
    const offsetHeight = chartHeight - margin.top - margin.bottom
    const svg = d3
      .select(d3Chart.current)
      .attr('width', offsetWidth + margin.left + margin.right)
      .attr('height', offsetHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.jsdate
        })
      )
      .range([0, offsetWidth])

    svg
      .append('g')
      .attr('transform', 'translate(0,' + offsetHeight + ')')
      .call(d3.axisBottom(x))

    const max = d3.max(data, (d) => {
      return d.value
    })
    const min = d3.min(data, (d) => {
      return d.value
    })
    const y = d3.scaleLinear().domain([min, max]).range([offsetHeight, 0])
    svg.append('g').call(d3.axisLeft(y))

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .attr(
        'd',
        d3
          .line()
          .x((d) => {
            return x(d.jsdate)
          })
          .y((d) => {
            return y(d.value)
          })
      )
  }

  return <svg ref={d3Chart}></svg>
}

export default Chart
