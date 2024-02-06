import { signal } from "@preact/signals-react";
import _ from 'lodash';

const sourceFolderUsed = signal('');

let sourceFolderUsedValue = sourceFolderUsed.value;

const changeCurrentSourceFolderUsed = newSourceFolder => {
	sourceFolderUsedValue = newSourceFolder;
	return `\nNew Source Folder: ${sourceFolderUsedValue}`;
};

export {
	sourceFolderUsed,
	sourceFolderUsedValue,
	changeCurrentSourceFolderUsed
};


