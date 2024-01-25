
import {
	ADD_COPY_ITEM,
	DELETE_COPY_ITEM,
	EMPTY_COPY_ITEMS,
	CHANGE_CURRENT_SOURCE_FOLDER,
	CHANGE_CURRENT_TARGET_FOLDER,
	COPY_ALL_ITEMS_IS_ACTIVE,
	COPY_ALL_ITEMS_IS_NOT_ACTIVE
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
	console.log('changeCurrentSourceFolder payload: ', payload);
	return {
		type: CHANGE_CURRENT_SOURCE_FOLDER,
		payload	
	};
};
const changeCurrentTargetFolder = (payload) => {
	console.log('changeCurrentTargetFolder payload: ', payload);
	return {
		type: CHANGE_CURRENT_TARGET_FOLDER,
		payload
	};
};
const copyAllItemsIsActive = () => {
	console.log('copyAllItemsIsActive');
	return {
		type: COPY_ALL_ITEMS_IS_ACTIVE
	};
};
const copyAllItemsIsNotActive = () => {
	console.log('copyAllItemsIsNotActive');
	return {
		type: COPY_ALL_ITEMS_IS_NOT_ACTIVE
	};
};

export {
	addCopyItem,
	deleteCopyItem,
	emptyCopyItems,
	changeCurrentSourceFolder,
	changeCurrentTargetFolder,
	copyAllItemsIsActive,
	copyAllItemsIsNotActive
};

