
import { createStore } from 'redux';
import copyCollection from '../reducers/copyReducers.js';

const store = createStore(copyCollection);

export default store;
