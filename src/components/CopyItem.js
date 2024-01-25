import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { deleteCopyItem } from '../actions/actions.js';
import ComObject from '../api/COM.js';

const { api } = window;

const CopyItem = props => {

	const dispatch = useDispatch();
	const {
		CurrentItem,
		copyAll
	} = props;

	const {
		id,
		name,
		path,
		isAFile,
		isADirectory
	} = CurrentItem;

	const [percentageDone, setPercentageDone] = useState(0);

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
		borderRadius: 2,
		color: 'black'
	};

	const deleteItem = e => {
		console.log('item to copy: ', e);
		console.log('CurrentItem to copy: ', CurrentItem);
		dispatch(deleteCopyItem(CurrentItem));
	};

	useEffect(() => {

		api.recieve(`${ComObject.channels.GET_STATUS_OF_COPY}-${id}`, (event, arg) => {
			setPercentageDone(arg.percentageDone);
      // console.log(`${arg.percentageDone}%. ${name}`);
      // console.log('event: ', event);
      // console.log('Get Status of Copy: ', arg);
      if(arg.percentageDone === 100) {
      	setTimeout(() => {
      		console.log('Item done: ', id);
				  dispatch(deleteCopyItem(CurrentItem));
				}, 10000);
      }

      
    });
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, [CurrentItem, id, dispatch]);

	return (
		<div
			style={CopyItemStyles}
			data-id={id}
			data-name={name}
			data-path={path}
			data-isafile={isAFile}
			data-isadirectory={isADirectory}
		>
			<span style={{position: 'absolute', left: 50}}>{percentageDone.toFixed(2)}&nbsp;&#37;</span>

			<LinearProgress style={{position: 'absolute', left: 50}} size="lg" value={percentageDone} />

			<span
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
			<Button
				disabled={copyAll}
				style={CopyItemDeleteButtonStyles}
				onClick={deleteItem}
			>
				Delete
			</Button>
			{/*<input style={{float:'left',marginLeft: 10}} type="checkbox" name="copy"/>
    	<label for="copy">{CurrentItem.name}</label>*/}
		</div>
	);

};


export default CopyItem;
