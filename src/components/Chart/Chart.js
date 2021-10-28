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
    let activePointId = ''
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

    const focus = svg
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none')

    focus.append('circle').attr('r', 6).attr('class', 'circle')
    focus
      .append('text')
      .attr('x', 20)
      .attr('y', 6)
      .text('')
      .attr('class', 'tooltip')

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
    const bisect = d3.bisector((d) => {
      return d.jsdate
    }).left
    function mousemove(event) {
      const pointerPosition = d3.pointer(event)
      const xPointer = x.invert(pointerPosition[0])
      const pointIndex = bisect(data, xPointer)
      const isLast = pointIndex === data.length
      const point = isLast ? data[pointIndex - 1] : data[pointIndex]
      const xPointPosition = x(point.jsdate)
      const yPointPosition = y(point.value)

      if (point.present) {
        if (activePointId.length > 0 && activePointId !== point.id) {
          document.getElementById(activePointId).classList.remove('active')
          document.getElementById(point.id).classList.add('active')
          activePointId = point.id
        } else {
          document.getElementById(point.id).classList.add('active')
          activePointId = point.id
        }
      } else {
        if (activePointId.length > 0) {
          document.getElementById(activePointId).classList.remove('active')
        }
      }
      focus.attr('transform', `translate(${xPointPosition},${yPointPosition})`)
      const closeToRight = chartWidth - pointerPosition[0] < 200
      focus
        .select('text')
        .attr('x', closeToRight ? -40 : 20)
        .text(point.value)
    }
    svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', chartWidth)
      .attr('height', chartWidth)
      .style('opacity', 0)
      .on('mouseover', () => {
        focus.style('display', 'block')
      })
      .on('mouseout', () => {
        focus.style('display', 'none')
        if (activePointId.length > 0) {
          document.getElementById(activePointId).classList.remove('active')
        }
      })
      .on('mousemove', mousemove)
  }

  return <svg ref={d3Chart}></svg>
}

export default Chart
