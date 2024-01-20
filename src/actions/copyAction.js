
import {
	ADD_COPY_ITEM,
	DELETE_COPY_ITEM,
	EMPTY_COPY_ITEMS
} from '../actionTypes/actionTypes';

const addCopyItem = (payload) => {
	console.log('payload: ', payload);
  return {
    type: ADD_COPY_ITEM,
    payload
  };
};

const deleteCopyItem = (payload) => {
	console.log('payload: ', payload);
  return {
    type: DELETE_COPY_ITEM,
    payload
  };
};

const emptyCopyItems = () => {
  return {
    type: EMPTY_COPY_ITEMS,
  };
};

export {
	addCopyItem,
	deleteCopyItem,
	emptyCopyItems
};

