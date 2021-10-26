export const pointReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, data: action.payload }
    case 'ADD_POINT':
      return { ...state, data: [...state.data, action.payload] }
    case 'REMOVE_POINT':
      return {
        ...state,
        data: state.data.filter((point) => point.id !== action.payload),
      }
    default:
      return state
  }
}
