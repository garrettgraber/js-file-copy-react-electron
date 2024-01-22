import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { changeCurrentTargetFolder } from '../actions/actions.js';

import ComObject from '../api/COM.js';
import ApiBase from '../api/apiBase.js';

import FolderItem from './FolderItem.js';

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

const TargetPane = (props) => {
	// console.log('props: ', props);
	const dispatch = useDispatch();
	const targetFolder = useSelector((state) => state.targetFolder);

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
	const TargetPaneStyle = {
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

	const FolderContentsSectionStyle = {
		overflowY: 'scroll',
		maxHeight: '72%',
		marginTop: 10
	};

	const CreateFolderModalButtonStyle = {
		height: 35,
		width: 170,
		marginLeft: 300,
		fontSize: 14,
		color: 'red',
		backgroundColor: 'black',
		marginTop: 20,
		marginRight: 20,
		float: 'right',
		borderRadius: 2,
		position: 'fixed'
	};

	const MoveUpDirectoryButtonStyle = {
		height: 30,
		width: 30,
		marginLeft: 15,
		fontSize: 20,
		color: 'red',
		backgroundColor: 'black',
		borderRadius: 2
	};

	const ModalBoxStyle = {
	  position: 'absolute',
	  top: '50%',
	  left: '50%',
	  transform: 'translate(-50%, -50%)',
	  width: 400,
	  bgcolor: 'background.paper',
	  border: '2px solid #000',
	  boxShadow: 24,
	  p: 4,
	  color: '#2f8ca3',
	  backgroundColor: 'black',
	  border: '1px solid white',
	  borderRadius: 2
	};

	const hardDriveHome = [
	  homeFolder,
	];
	const options = hardDriveHome.concat(mediaDrives);
	const defaultOption = options[0];


	const [currentFolder, setCurrentFolder] = useState(homeFolder);
	const [currentFolderConents, setCurrentFolderContents] = useState([]);
	const [currentFolderChange, setCurrentFolderChange] = useState(false);
	const [baseHomeFolder, setBaseHomeFolder] = useState(homeFolder);

	const [newFolder, setNewFolder] = useState('');

	const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    setNewFolder(event.target.value);
  };

  const handleCreateFolderClick = () => {
    const AjaxObject = {currentFolder, newFolder};
    console.log('AjaxObject: ', AjaxObject);
    ApiBase.createFolder(currentFolder, newFolder);
  };

	const choosePath = e => {
		console.log('choose path: ', e);
		console.log('currentFolder: ', currentFolder);
		setCurrentFolder(e.value);
		dispatch(changeCurrentTargetFolder(e.value));
		// getTargetFolderContents(e.value);
		ApiBase.getTargetFolderContents(e.value);
		setCurrentFolderChange(true);
	};

	const clickItem = e => {
		console.log('item clicked: ', e);

		console.log('dataset: ', e.target.dataset);

		const DataSet = e.target.dataset;

		const isAFile = stringToBoolean(DataSet.isafile);
		const isADirectory = stringToBoolean(DataSet.isadirectory);

		console.log('Target DataSet is file: ', isAFile);
		console.log('Target DataSet is directory: ', isADirectory);

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
	    dispatch(changeCurrentTargetFolder(dataItemClickedPath));
	    ApiBase.getTargetFolderContents(dataItemClickedPath);
		}
	};

	const upDirectory = e => {
		console.log('upDirectory clicked: ', e);
		console.log('currentFolder: ', currentFolder);
		const currentFolderArray = currentFolder.split('/');
		if(currentFolderArray.length > 2) {
			currentFolderArray.pop();
			const newCurrentFolderPath = currentFolderArray.join('/')
			console.log('newCurrentFolderPath: ', newCurrentFolderPath);
			setCurrentFolder(newCurrentFolderPath);
			dispatch(changeCurrentTargetFolder(newCurrentFolderPath));
	    ApiBase.getTargetFolderContents(newCurrentFolderPath);
		}
	};

	useEffect(() => {

    api.recieve(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, (event, arg) => {
      console.log('event: ', event);
      console.log('found current target folder contents: ', arg);
      setCurrentFolderContents(arg);
      // setCurrentFolderChange(false);
    });

    api.recieve(ComObject.channels.CREATE_FOLDER, (event, arg) => {
      console.log('event: ', event);
      console.log('create folder status: ', arg);
      console.log('create folder currentFolder: ', arg.currentFolder);
      if(arg.success) {
      	console.log('create folder currentFolder after success: ', arg.currentFolder);
      	setCurrentFolder(arg.currentFolder);
      	dispatch(changeCurrentTargetFolder(arg.currentFolder));
      	ApiBase.getTargetFolderContents(arg.currentFolder);
      }
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

	if(currentFolderConents.length > 9) {
		FolderContentsSectionStyle.overflowY = 'scroll';
	} else {
		FolderContentsSectionStyle.overflowY = 'auto';
	}

  return (
    <div className="TargetPane" style={TargetPaneStyle}>
    	<h2 style={{display: 'inline-block', marginTop: 20, marginBottom: 20}}>{paneName}</h2>
    	<Button variant="outlined" style={CreateFolderModalButtonStyle} onClick={handleOpen}>Create Folder</Button>
    	<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalBoxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Folder
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h5>{currentFolder}</h5>
            <section>
            	<label htmlFor="foldername">Folder name:</label>&nbsp;&nbsp;
  						<input style={{backgroundColor: 'black', color: '#2f8ca3', height: 30}} value={newFolder} onChange={handleInputChange} type="text" id="foldername" name="foldername" />
  						&nbsp;&nbsp;
  						<Button
  							variant="outlined"
  							style={{backgroundColor: 'black', color: 'red', borderRadius: 2}}
  							onClick={handleCreateFolderClick}
  						>
  							Enter
  						</Button>
            </section>
          </Typography>
        </Box>
      </Modal>

    	<Dropdown options={options} onChange={choosePath} value={defaultOption} placeholder="Select a File or Folder" />
    	<div style={{paddingTop: 10}}>
    		<span>{currentFolder}</span>
    		<Button variant="outlined" style={MoveUpDirectoryButtonStyle} onClick={upDirectory}>&#8593;</Button>
    	</div>
    	<div style={FolderContentsSectionStyle}>

	    	{currentFolderConents.length > 0 ? currentFolderConents.map((CurrentItem) => (<FolderItem key={uuidv4()} CurrentItem={CurrentItem} folderItemClick={clickItem} />)) : null }
    	</div>

    </div>
  );
};

export default TargetPane;


