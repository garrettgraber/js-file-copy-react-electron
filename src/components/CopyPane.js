import { useState, useEffect, React } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';


import { emptyCopyItems } from '../actions/actions.js';

import CopyItem from './CopyItem.js';

const CopyPane = (props) => {
	// console.log('props: ', props);
	const copyCollection = useSelector((state) => state.copyCollection);

	const dispatch = useDispatch();

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

  const removeAllItems = e => {
  	dispatch(emptyCopyItems());
  };

	useEffect(() => {

		
   
    // Clean the listener after the component is dismounted
    return () => {
      
    };
	}, []);

  if(copyCollection.length > 9) {
    FolderContentsSectionStyle.overflowY = 'scroll';
  } else {
    FolderContentsSectionStyle.overflowY = 'auto';
  }

  return (
    <div style={CopyPaneStyle}>
      <h2>Files and Folders to Copy</h2>
      <div style={CopyPaneButtonContainerStyle}>
      	<Button variant="outlined" style={CopyPaneButtonStyle}>Copy All</Button>
      	<Button variant="outlined" onClick={removeAllItems} style={CopyPaneButtonStyle}>Remove All</Button>
      </div>

      <div style={FolderContentsSectionStyle}>
        {copyCollection.length > 0 ? copyCollection.map((CurrentItem) => (<CopyItem key={CurrentItem.id} CurrentItem={CurrentItem} />)) : null }
      </div>
    </div>
  );
};

export default CopyPane;


