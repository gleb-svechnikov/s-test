import { createStore, applyMiddleware, compose } from 'redux'
import thunk from "redux-thunk"
import reducers from './reducers';
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export const store = createStore(
    reducers,
    {},
    compose(applyMiddleware(thunk), devtools)
)
