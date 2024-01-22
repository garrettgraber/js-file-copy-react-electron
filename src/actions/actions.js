
import {
	ADD_COPY_ITEM,
	DELETE_COPY_ITEM,
	EMPTY_COPY_ITEMS,
	CHANGE_CURRENT_SOURCE_FOLDER,
	CHANGE_CURRENT_TARGET_FOLDER
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

const changeCurrentSourceFolder = (payload) => {
	console.log('payload: ', payload);
	return {
		type: CHANGE_CURRENT_SOURCE_FOLDER,
		payload	
	};
};

const changeCurrentTargetFolder = (payload) => {
	console.log('payload: ', payload);
	return {
		type: CHANGE_CURRENT_TARGET_FOLDER,
		payload
	};
};

export {
	addCopyItem,
	deleteCopyItem,
	emptyCopyItems,
	changeCurrentSourceFolder,
	changeCurrentTargetFolder
};

