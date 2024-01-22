import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { deleteCopyItem } from '../actions/actions.js';

const CopyItem = props => {
	const dispatch = useDispatch();
	const {
		CurrentItem
	} = props;

	const {
		id,
		name,
		path,
		isAFile,
		isADirectory
	} = CurrentItem;

	const CopyItemStyles = {
		border: '1px solid #0FFF50',
		// paddingTop: 10,
		// paddingBottom: 10,
		display: 'flex',
		margin: 0,
		backgroundColor: 'black',
		color: '#2f8ca3',
		// width: 376,
		height: 43,
		fontSize: 16,
		alignItems: 'center',
		paddingLeft: 5,
		justifyContent: 'flex-end',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap'
	};

	const CopyItemDeleteButtonStyles = {
		float: 'right',
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 10,
		backgroundColor: '#2f8ca3',
		borderRadius: 2
	};

	console.log('CurrentItem: ', CurrentItem);

	const deleteItem = e => {
		console.log('item to copy: ', e);
		console.log('CurrentItem to copy: ', CurrentItem);
		dispatch(deleteCopyItem(CurrentItem));
	};

	useEffect(() => {
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, []);

	return (
		<div
			style={CopyItemStyles}
			data-id={id}
			data-name={name}
			data-path={path}
			data-isafile={isAFile}
			data-isadirectory={isADirectory}
		>
			<span style={{}}
				data-tooltip-id={id}
				data-tooltip-position-strategy={'fixed'}
				data-tooltip-place={'top-start'}
				style={{cursor: 'default'}}
			>{name}</span>
			<Tooltip
			  id={id}
			  content={path}
			  events={['hover']}
			/>
			<button style={CopyItemDeleteButtonStyles} onClick={deleteItem}>Delete</button>
			{/*<input style={{float:'left',marginLeft: 10}} type="checkbox" name="copy"/>
    	<label for="copy">{CurrentItem.name}</label>*/}
		</div>
	);

};


export default CopyItem;
