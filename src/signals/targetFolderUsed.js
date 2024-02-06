import { signal } from "@preact/signals-react";
import _ from 'lodash';

const targetFolderUsed = signal('');

let targetFolderUsedValue = targetFolderUsed.value;

const changeCurrentTargetFolderUsed = newTargetFolder => {
	targetFolderUsedValue = newTargetFolder;
	return `\nNew Target Folder: ${targetFolderUsedValue}`;
};

export {
	targetFolderUsed,
	targetFolderUsedValue,
	changeCurrentTargetFolderUsed
};


