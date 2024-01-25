import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Tabs, Tab } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { ThemeProvider, createTheme, ThemeOptions, styled } from '@mui/material/styles';

import { changeCurrentSourceFolder, changeCurrentTargetFolder } from './actions/actions.js';


import ComObject from './api/COM.js';
import ApiBase from './api/apiBase.js';

import logo from './logo.svg';
import './App.css';
import MapCell from './components/MapCell.js';
import CopyPane from './components/CopyPane.js';
import SourcePane from './components/SourcePane.js';
import TargetPane from './components/TargetPane.js';

const { api } = window;

const SOURCE = 'Source Folders and Files';
const TARGET = 'Destination Folder';

const isObjectEmpty = obj => Object.keys(obj).length === 0;
const isArrayEmpty = arr => arr.length === 0;

ApiBase.getRootFolder();
ApiBase.getSubRootFolders();
ApiBase.getMediaDrives();
ApiBase.getHomeFolder();

function App() {
  const dispatch = useDispatch();
  // const sourceFolder = useSelector((state) => state.sourceFolder);
  // const targetFolder = useSelector((state) => state.targetFolder);

  const [paneValue, setPaneValue] = useState('one'); 
  const [rootFolder, setRootFolder] = useState('');
  const [rootSubFolders, setRootSubFolders] = useState([]);
  const [mediaDrives, setMediaDrives] = useState([]);
  const [homeFolder, setHomeFolder] = useState('');

  const AppStyle = {
    backgroundColor: 'black',
    height: 570,
    display: 'flex',
    justifyContent: 'space-between'
  };

  const CopyPaneStyle = {
    width: 400,
    height: 535,
    border: '4px solid #f4af2d',
    borderRadius: 4,
    margin: 10,
    color: '#2f8ca3'
  };

  const handleTab = (e, newVal) => { 
    setPaneValue(newVal); 
  }; 

  useEffect(() => {

    if(rootFolder === '') {
       // Listen for the event
      api.recieve(ComObject.channels.GET_ROOT_FOLDER, (event, arg) => {
        // console.log('event: ', event);
        // console.log('root folder: ', arg);
        setRootFolder(arg);
      });
    }

    if(homeFolder === '') {
       // Listen for the event
      api.recieve(ComObject.channels.GET_HOME_FOLDER, (event, arg) => {
        // console.log('event: ', event);
        // console.log('home folder: ', arg);
        setHomeFolder(arg);

        dispatch(changeCurrentSourceFolder(arg));
        dispatch(changeCurrentTargetFolder(arg));
      });
    }

    if(isArrayEmpty(rootSubFolders)) {
       // Listen for the event
      api.recieve(ComObject.channels.GET_ROOT_SUB_FOLDERS, (event, arg) => {
        // console.log('event: ', event);
        // console.log('root sub folders: ', arg);
        setRootSubFolders(arg);
      });
    }

    if(isArrayEmpty(mediaDrives)) {
       // Listen for the event
      api.recieve(ComObject.channels.GET_MEDIA_DRVIES, (event, arg) => {
        // console.log('event: ', event);
        // console.log('media drives: ', arg);
        setMediaDrives(arg);
      });
    }
   
    // Clean the listener after the component is dismounted
    return () => {
      api.removeAllListeners();
    };
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

  const StyledTab = styled(Tab)({
    "&.Mui-disabled": {
      color: "red"
    }
  });

  const BaseWhiteStyle = {color: 'white'};
  const BasePinkStyle = {color: '#ff007f'};
  const BaseBlueStyle = {color: '#2f8ca3'};

  const tabStyles = tabValue => paneValue === tabValue ? BasePinkStyle : BaseWhiteStyle;

  const TabOneStyle = tabStyles('one');
  const TabTwoStyle = tabStyles('two');
  const TabThreeStyle = tabStyles('three');

  // console.log('sourceFolder before SourcePane: ', sourceFolder);
  // console.log('targetFolder before TargetPane: ', targetFolder);

  return (
    <div className="App" style={AppStyle}>
      <TabContext value={paneValue} id="tab-context-root"> 
        <Box> 
          <TabList 
            value={paneValue} 
            onChange={handleTab} 
            textColor="primary"
            indicatorColor="secondary"
            style={{backgroundColor: 'black', color: 'white'}}
          > 
            <Tab style={TabOneStyle} value="one" label="Source Pane" /> 
            <Tab style={TabTwoStyle} value="two" label="Copy Pane" /> 
            <Tab style={TabThreeStyle} value="three" label="Target Pane" /> 
          </TabList> 
          <TabPanel value="one">
            {homeFolder !== '' ? <SourcePane
              paneName={SOURCE}
              mediaDrives={mediaDrives}
              homeFolder={homeFolder}
            /> : null}
          </TabPanel>
          <TabPanel value="two">
            <CopyPane />
          </TabPanel>
          <TabPanel value="three">
            {homeFolder !== '' ? <TargetPane
              paneName={TARGET}
              mediaDrives={mediaDrives}
              homeFolder={homeFolder}
            /> : null}
          </TabPanel>
        </Box>
      </TabContext>
    </div>
  );
}

export default App;
