import { useState, useEffect, React } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';

import {
  emptyCopyItems,
  copyAllItemsIsActive,
  copyAllItemsIsNotActive
} from '../actions/actions.js';
import ComObject from '../api/COM.js';
import ApiBase from '../api/apiBase.js';
import CopyItem from './CopyItem.js';

const { api } = window;

const CopyPane = (props) => {
	// console.log('props: ', props);
	const copyCollection = useSelector((state) => state.copyCollection);
  const targetFolder = useSelector((state) => state.targetFolder);
  const copyAllItems = useSelector((state) => state.copyAllItems);

	const dispatch = useDispatch();

  const [copyAll, setCopyAll] = useState(false);

	const CopyPaneStyle = {
    width: 1200,
    height: 535,
    border: '4px solid #f4af2d',
    borderRadius: 4,
    margin: 10,
    color: '#2f8ca3'
  };

  const CopyPaneButtonStyle = {
  	height: 30,
  	backgroundColor: 'black',
  	color: 'red',
  	paddingRight: 20,
  	paddingLeft: 20,
  	borderRadius: 3
  };

  const CopyPaneButtonContainerStyle = {
  	display: 'flex',
  	justifyContent: 'space-around',
  	paddingTop: 0,
  	paddingBottom: 15
  };

  const FolderContentsSectionStyle = {
    overflowY: 'scroll',
    maxHeight: '77%',
    marginTop: 10
  };

  const removeAllItemsHandler = e => {
  	dispatch(emptyCopyItems());
  };

  const copyAllItemsHandler = e => {
    setCopyAll(true);
    dispatch(copyAllItemsIsActive());
    for(const CurrentCopyItem of copyCollection) {
      if(CurrentCopyItem.isAFile && !CurrentCopyItem.isADirectory) {
        const targetPath = `${targetFolder}/${CurrentCopyItem.name}`;
        ApiBase.copyFile(CurrentCopyItem.id, CurrentCopyItem.path, targetPath);
      }
      if(!CurrentCopyItem.isAFile && CurrentCopyItem.isADirectory) {
        const targetPath = `${targetFolder}/${CurrentCopyItem.name}`;
        ApiBase.copyFolder(CurrentCopyItem.id, CurrentCopyItem.path, targetPath);
      }
    }
    console.log('End of copyAllItems');
  };

	useEffect(() => {

		api.recieve(ComObject.channels.COPY_FILE, (event, arg) => {
      console.log('event: ', event);
      console.log('Copied File: ', arg);
      // if(copyCollection.length === 0) {
      //   console.log('copyAllItems in api.recieve for COPY_FILE: ', copyAllItems);
      //   setCopyAll(false);
      // }
    });

    api.recieve(ComObject.channels.COPY_FOLDER, (event, arg) => {
      console.log('event: ', event);
      console.log('Copied Folder: ', arg);
      // if(copyCollection.length === 0) {
      //   console.log('copyAllItems in api.recieve for COPY_FOLDER: ', copyAllItems);
      //   setCopyAll(false);
      // }
    });


    // if(!copyAll && copyCollection.length === 0) {
    //   console.log('copyAll is false: ', copyAll);
    //   console.log('copyAllItems is: ', copyAllItems);
    //   // setCopyAll(false);
    //   dispatch(copyAllItemsIsNotActive());
    // }

    if(copyCollection.length === 0 && copyAll) {
      console.log('Nothing in copyCollection: ', copyCollection.length);
      console.log('copyAll: ', copyAll);
      setCopyAll(false);
      dispatch(copyAllItemsIsNotActive());
    }

   
    // api.recieve(ComObject.channels.GET_STATUS_OF_COPY, (event, arg) => {
    //   console.log('event: ', event);
    //   console.log('Get Status of Copy: ', arg);
    // });

    // Clean the listener after the component is dismounted
    return () => {
      
    };
	}, [copyAll, copyAllItems, copyCollection.length]);

  if(copyCollection.length > 9) {
    FolderContentsSectionStyle.overflowY = 'scroll';
  } else {
    FolderContentsSectionStyle.overflowY = 'auto';
  }

  if(copyAll) {
    CopyPaneButtonStyle.color = 'black';
    CopyPaneButtonStyle.backgroundColor = 'red';
  } else {
    CopyPaneButtonStyle.color = 'red';
    CopyPaneButtonStyle.backgroundColor = 'black';
  }

  return (
    <div style={CopyPaneStyle}>
      <h2>Files and Folders to Copy</h2>
      <div style={CopyPaneButtonContainerStyle}>
      	<Button
          disabled={copyAll}
          variant="outlined"
          onClick={copyAllItemsHandler}
          style={CopyPaneButtonStyle}
        >
          Copy All
        </Button>
      	<Button
          disabled={copyAll}
          variant="outlined"
          onClick={removeAllItemsHandler}
          style={CopyPaneButtonStyle}
        >
          Remove All
        </Button>
      </div>

      <div style={FolderContentsSectionStyle}>
        {copyCollection.length > 0 ? copyCollection.map((CurrentItem) => (<CopyItem copyAll={copyAll} key={CurrentItem.id} CurrentItem={CurrentItem} />)) : null }
      </div>
    </div>
  );
};

export default CopyPane;


