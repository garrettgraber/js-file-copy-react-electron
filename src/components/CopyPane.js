import { useState, useEffect, React } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { emptyCopyItems } from '../actions/copyAction.js';

import CopyItem from './CopyItem.js';

const CopyPane = (props) => {
	// console.log('props: ', props);
	const state = useSelector((state) => state);
	console.log('CopyPane state: ', state);

	const dispatch = useDispatch();

	const CopyPaneStyle = {
    width: 400,
    height: 535,
    border: '4px solid #f4af2d',
    borderRadius: 4,
    margin: 10,
    color: '#2f8ca3'
  };

  const CopyPaneButtonStyle = {
  	height: 30,
  	backgroundColor: 'black',
  	color: '#2f8ca3',
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

  const removeAllItems = e => {
  	dispatch(emptyCopyItems());
  };

	useEffect(() => {

		
   
    // Clean the listener after the component is dismounted
    return () => {
      
    };
	}, []);

  return (
    <div style={CopyPaneStyle}>
      <h2>Files and Folders to Copy</h2>
      <div style={CopyPaneButtonContainerStyle}>
      	<button style={CopyPaneButtonStyle}>Copy All</button>
      	<button onClick={removeAllItems} style={CopyPaneButtonStyle}>Remove All</button>
      </div>

      {state.length > 0 ? state.map((CurrentItem) => (<CopyItem key={CurrentItem.id} CurrentItem={CurrentItem} />)) : null }
    </div>
  );
};

export default CopyPane;


