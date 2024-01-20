import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import ComObject from '../api/COM.js';
import ApiBase from '../api/apiBase.js';

import FolderItemToCopy from './FolderItemToCopy.js';

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
	// console.log('props: ', props);
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
	const paneWidth = 400;
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
		maxHeight: '78%',
		marginTop: 10
	};

	console.log('homeFolder: ', homeFolder);
	console.log('mediaDrives: ', mediaDrives);

	const hardDriveHome = [
	  homeFolder,
	];
	const options = hardDriveHome.concat(mediaDrives);
	const defaultOption = options[0];

	const [currentFolder, setCurrentFolder] = useState(homeFolder);
	const [currentFolderConents, setCurrentFolderContents] = useState([]);
	const [currentFolderChange, setCurrentFolderChange] = useState(false);
	const [baseHomeFolder, setBaseHomeFolder] = useState(homeFolder);

	// if(homeFolder !== '' && baseHomeFolder === '') {
	// 	console.log('Home folder is not blank: ', homeFolder);
	// 	console.log('Base Home folder is blank: ', baseHomeFolder);
	// 	setBaseHomeFolder(homeFolder);
	// 	console.log('Base Home folder is NOT blank: ', baseHomeFolder);
	// }

	const choosePath = e => {
		console.log('choose path: ', e);
		console.log('currentFolder: ', currentFolder);
		setCurrentFolder(e.value);
		// getSourceFolderContents(e.value);
		ApiBase.getSourceFolderContents(e.value);
		setCurrentFolderChange(true);
	};

	const clickItem = e => {
		console.log('item clicked: ', e);
		console.log('dataset: ', e.target.dataset);
		const DataSet = e.target.dataset;

		const isAFile = stringToBoolean(DataSet.isafile);
		const isADirectory = stringToBoolean(DataSet.isadirectory);

		console.log('Source DataSet is file: ', isAFile);
		console.log('Source DataSet is directory: ', isADirectory);

		if(isAFile) {
			console.log('DataSet is file: ', isAFile);
		}

		if(isADirectory && !isAFile) {
			console.log('data-item: ', e.target.getAttribute('data-name'));
	    const dataItemClicked = e.target.getAttribute('data-name');
	    const dataItemClickedPath = `${currentFolder}/${dataItemClicked}`;
	    console.log('currentFolder: ', currentFolder);
	    console.log('dataItemClickedPath: ', dataItemClickedPath);
	    setCurrentFolder(dataItemClickedPath);
	    ApiBase.getSourceFolderContents(dataItemClickedPath);
		}
	};

	useEffect(() => {

    api.recieve(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, (event, arg) => {
      console.log('event: ', event);
      console.log('found current source folder contents: ', arg);
      setCurrentFolderContents(arg);
      // setCurrentFolderChange(false);
    });

    if(homeFolder !== '') {
    	setBaseHomeFolder(homeFolder);
    	console.log('baseHomeFolder: ', baseHomeFolder);
    }

    if(currentFolderConents.length > 0) {

    }
   
    // Clean the listener after the component is dismounted
    return () => {
      api.removeAllListeners();
    };
	}, []);

  return (
    <div className='SourcePane' style={SourcePaneStyle}>
    	<h2>{paneName}</h2>

    	<Dropdown options={options} onChange={choosePath} value={defaultOption} placeholder='Select a File or Folder' />
    	<div style={FolderContentsSectionStyle}>

	    	{currentFolderConents.length > 0 ? currentFolderConents.map((CurrentItem) => (<FolderItemToCopy key={uuidv4()} CurrentItem={CurrentItem} folderItemClick={clickItem} />)) : null }
    	</div>

    </div>
  );
};

export default SourcePane;


