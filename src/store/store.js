
import { createStore } from 'redux';
import rootReducer from '../reducers/reducers.js';

const store = createStore(rootReducer);

export default store;
