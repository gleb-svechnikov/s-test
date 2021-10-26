import { nanoid } from 'nanoid'
export const loadData = (dataset) => {
  return (dispatch) =>
    dispatch({
      type: 'LOAD_DATA',
      payload: dataset,
    })
}

export const addDataPoint = (datapoint) => {
  return (dispatch) =>
    dispatch({
      type: 'ADD_POINT',
      payload: datapoint,
    })
}
export const removeDataPoint = (datapoint) => {
  return (dispatch) =>
    dispatch({
      type: 'REMOVE_POINT',
      payload: datapoint,
    })
}

export const fetchData = () => {
  return (dispatch) => {
    return fetch('data.json')
      .then((response) => response.json())
      .then((dataset) => {
        dispatch({ type: 'LOAD_DATA', payload: dataset })
      })
  }
}

const getRandomInRange = (myMin, myMax) => {
  return Math.floor(Math.random() * (myMax - myMin + 1) + myMin)
}
export const generateData = () => {
  return (dispatch) => {
    var generatedDataset = []
    for (var i = 0; i < 10; i++) {
      const now = Date.now()
      generatedDataset.push({
        id: nanoid(),
        value: getRandomInRange(-20, 20),
        datetime: new Date(now - 30 * 1000 * i).toISOString(),
        present: false,
      })
    }
    return dispatch({ type: 'LOAD_DATA', payload: generatedDataset })
  }
}
