
import { signal } from "@preact/signals-react";

// import { deepSignal } from "deepsignal/react";

import _ from 'lodash';


const copyCollectionUsed = signal([]);

let copyCollectionUsedValue = copyCollectionUsed.value;

const addToCopyCollectionUsed = (newItem, id) => {
	const found = copyCollectionUsedValue.some(el => el.id === id);
	if(!found) {
		// const copyCollectionUsedClone = _.cloneDeep(copyCollectionUsed);
		copyCollectionUsedValue.push(newItem);
		return `\nItem not in copy collection, adding: ${JSON.stringify(newItem)}. Copy collection: ${JSON.stringify(copyCollectionUsedValue)}`;
	} else {
		return `\nItem already in copy collection, NOT adding: ${JSON.stringify(newItem)}. Copy collection: ${JSON.stringify(copyCollectionUsedValue)}`;;
	}
};

const emptyCopyCollectionUsed = () => {
	copyCollectionUsedValue = [];
	return `\nCopy collection is empty. Copy collection: ${JSON.stringify(copyCollectionUsedValue)}`;
};

const deleteItemFromCopyCollectionUsed = Item => {
	const newCopyCollectionUsed = copyCollectionUsedValue.filter(e => e.id !== Item.id);
	copyCollectionUsedValue = newCopyCollectionUsed;
	return `\nItem removed from copy collection: ${JSON.stringify(Item)}. Copy collection: ${JSON.stringify(copyCollectionUsedValue)}`;
};

export {
	copyCollectionUsed,
	copyCollectionUsedValue,
	addToCopyCollectionUsed,
	emptyCopyCollectionUsed,
	deleteItemFromCopyCollectionUsed
};
