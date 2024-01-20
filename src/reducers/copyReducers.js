import _ from 'lodash';
import { combineReducers } from 'redux';
import {
	ADD_COPY_ITEM,
	DELETE_COPY_ITEM,
	EMPTY_COPY_ITEMS
} from '../actionTypes/actionTypes.js';

const copyCollection = (state = [], action) => {
  switch (action.type) {
		case EMPTY_COPY_ITEMS:
			return [];
		case ADD_COPY_ITEM:
			const found = state.some(el => el.id === action.payload.id);
			if(!found) {
				const stateClone = _.cloneDeep(state);
				stateClone.push(action.payload);
				console.log('Item not in copy list, stateClone: ', stateClone);
				return stateClone;
			} else {
				console.log('Item already in copy list');
				return state;
			}
		case DELETE_COPY_ITEM:
			const stateCloneDelete = _.cloneDeep(state);
			const deleteItemId = action.payload.id;
			const newStateClone = stateCloneDelete.filter(e => e.id !== deleteItemId);
			return newStateClone;
		default:
			return state;
	}
};

export default copyCollection;

// export default combineReducers({
// 	copyCollection
// });
