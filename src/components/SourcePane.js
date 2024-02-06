import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { changeCurrentSourceFolder } from '../actions/actions.js';

import {
	sourceFolderUsedValue,
	changeCurrentSourceFolderUsed
} from '../signals/sourceFolderUsed.js';


import ComObject from '../api/COM.js';
import ApiBase from '../api/apiBase.js';

import SourceItemToCopy from './SourceItemToCopy.js';

const { api } = window;


const stringToBoolean = s => {
	switch (s) {
		case 'true':
			return true;
		case 'false':
			return false;
		default:
			return s;
	}
};

const SourcePane = (props) => {
	const dispatch = useDispatch();
	// const sourceFolder = useSelector((state) => state.sourceFolder);
	let sourceFolder = sourceFolderUsedValue;

	const {
		paneName,
		homeFolder,
		mediaDrives,
		// comChannel,
		// comChannelGet
	} = props;
	const paneLetterColor = '#2f8ca3';
	const paneColor = 'black';
	// console.log('color: ', color);
	const paneHeight = 535;
	const paneWidth = 1200;
	const margin = 10;
	const SourcePaneStyle = {
		color: paneLetterColor,
		backgroundColor: paneColor,
		height: paneHeight,
		width: paneWidth,
		// display: 'inline-block',
		margin,
		border: '4px solid #f4af2d',
		borderRadius: 4,
		flex: '30%',
		overflowY: 'hidden',
		position: 'relative'
	};

	let FolderContentsSectionStyle = {
		overflowY: 'scroll',
		maxHeight: '72%',
		marginTop: 10
	};

	const DropdownStyle = {
		width: '60%',
		backgroundColor: 'black',
		color: paneLetterColor
	};

	const UpDirectoryButtonStyle = {
		height: 30,
		width: 30,
		marginLeft: 15,
		fontSize: 20,
		color: 'red',
		backgroundColor: 'black'
	};

	const hardDriveHome = [
	  homeFolder,
	];
	const options = hardDriveHome.concat(mediaDrives);
	const defaultOption = options[0];

	const [currentFolderConents, setCurrentFolderContents] = useState([]);
	const [baseHomeFolder, setBaseHomeFolder] = useState(homeFolder);

	// console.log('sourceFolder: ', sourceFolder);

	const choosePath = e => {
		// console.log('choose path: ', e);
		// console.log('sourceFolder: ', sourceFolder);
		const changeCurrentSourceFolderUsedResult = changeCurrentSourceFolderUsed(e.value);
		console.log(changeCurrentSourceFolderUsedResult);

		dispatch(changeCurrentSourceFolder(e.value));
		// getSourceFolderContents(e.value);
		ApiBase.getSourceFolderContents(e.value);
	};

	const clickItem = e => {
		// console.log('item clicked: ', e);
		// console.log('dataset: ', e.target.dataset);
		const DataSet = e.target.dataset;

		const isAFile = stringToBoolean(DataSet.isafile);
		const isADirectory = stringToBoolean(DataSet.isadirectory);

		// console.log('Source DataSet is file: ', isAFile);
		// console.log('Source DataSet is directory: ', isADirectory);

		if(isAFile) {
			console.log('Items is file: ', DataSet);
		}

		if(isADirectory && !isAFile) {
			// console.log('data-item: ', e.target.getAttribute('data-name'));
	    const dataItemClicked = e.target.getAttribute('data-name');
	    const dataItemClickedPath = `${sourceFolder}/${dataItemClicked}`;
	    // console.log('sourceFolder: ', sourceFolder);
	    console.log('dataItemClickedPath: ', dataItemClickedPath);
	    const changeCurrentSourceFolderUsedResult = changeCurrentSourceFolderUsed(dataItemClickedPath);
			console.log(changeCurrentSourceFolderUsedResult);

	    dispatch(changeCurrentSourceFolder(dataItemClickedPath));
	    ApiBase.getSourceFolderContents(dataItemClickedPath);
		}
	};

	const upDirectory = e => {
		// console.log('upDirectory clicked: ', e);
		// console.log('sourceFolder: ', sourceFolder);
		const currentFolderArray = sourceFolder.split('/');
		if(currentFolderArray.length > 2) {
			currentFolderArray.pop();
			const newCurrentFolderPath = currentFolderArray.join('/');
			console.log('newCurrentFolderPath: ', newCurrentFolderPath);
			const changeCurrentSourceFolderUsedResult = changeCurrentSourceFolderUsed(newCurrentFolderPath);
			console.log(changeCurrentSourceFolderUsedResult);
			dispatch(changeCurrentSourceFolder(newCurrentFolderPath));
	    ApiBase.getSourceFolderContents(newCurrentFolderPath);
		}
	};

	useEffect(() => {

    api.recieve(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, (event, arg) => {
      // console.log('event: ', event);
      // console.log('found current source folder contents: ', arg);
      setCurrentFolderContents(arg);
    });

    if(homeFolder !== '') {
    	setBaseHomeFolder(homeFolder);
    	// console.log('baseHomeFolder: ', baseHomeFolder);
    }

    if(currentFolderConents.length === 0) {
    	// console.log('currentFolderConents is empty: ', currentFolderConents);
    	// console.log('sourceFolder is: ', sourceFolder);
    	ApiBase.getSourceFolderContents(sourceFolder);
    }
   
    // Clean the listener after the component is dismounted
    return () => {
      api.removeAllListeners();
    };
	}, []);

	if(currentFolderConents.length > 9) {
		FolderContentsSectionStyle.overflowY = 'scroll';
	} else {
		FolderContentsSectionStyle.overflowY = 'auto';
	}

  return (
    <div className='SourcePane' style={SourcePaneStyle}>
    	<div>
    		<h2>{paneName}</h2>
    	</div>
    	<Dropdown style={DropdownStyle} options={options} onChange={choosePath} value={defaultOption} placeholder='Select a File or Folder' />
    	<div style={{paddingTop: 10}}>
    		<span>{sourceFolder}</span>
    		<Button variant="outlined" style={UpDirectoryButtonStyle} onClick={upDirectory}>&#8593;</Button>
    	</div>
    	<div style={FolderContentsSectionStyle}>
	    	{currentFolderConents.length > 0 ? currentFolderConents.map((CurrentItem) => (<SourceItemToCopy key={uuidv4()} CurrentItem={CurrentItem} folderItemClick={clickItem} />)) : null }
    	</div>
    </div>
  );
};

export default SourcePane;


