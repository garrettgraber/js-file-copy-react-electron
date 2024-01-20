import { useState, useEffect } from 'react';

import ComObject from './api/COM.js';
import ApiBase from './api/apiBase.js';


import logo from './logo.svg';
import './App.css';
import MapCell from './components/MapCell.js';
import CopyPane from './components/CopyPane.js';
import SourcePane from './components/SourcePane.js';
import TargetPane from './components/TargetPane.js';


const { api } = window;

console.log('api: ', api);


const SOURCE = 'Source Folders and Files';
const TARGET = 'Destination Folders and Files';

const isObjectEmpty = obj => Object.keys(obj).length === 0;
const isArrayEmpty = arr => arr.length === 0;

ApiBase.getRootFolder();
ApiBase.getSubRootFolders();
ApiBase.getMediaDrives();
ApiBase.getHomeFolder();

function App() {

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

  useEffect(() => {

    if(rootFolder === '') {
       // Listen for the event
      api.recieve(ComObject.channels.GET_ROOT_FOLDER, (event, arg) => {
        console.log('event: ', event);
        console.log('root folder: ', arg);
        setRootFolder(arg);
      });
    }

    if(homeFolder === '') {
       // Listen for the event
      api.recieve(ComObject.channels.GET_HOME_FOLDER, (event, arg) => {
        console.log('event: ', event);
        console.log('home folder: ', arg);
        setHomeFolder(arg);
      });
    }

    console.log('root sub folders: ', rootSubFolders);

    if(isArrayEmpty(rootSubFolders)) {
       // Listen for the event
      api.recieve(ComObject.channels.GET_ROOT_SUB_FOLDERS, (event, arg) => {
        console.log('event: ', event);
        console.log('root sub folders: ', arg);
        setRootSubFolders(arg);
      });
    }

    if(isArrayEmpty(mediaDrives)) {
       // Listen for the event
      api.recieve(ComObject.channels.GET_MEDIA_DRVIES, (event, arg) => {
        console.log('event: ', event);
        console.log('media drives: ', arg);
        setMediaDrives(arg);
      });
    }
   
    // Clean the listener after the component is dismounted
    return () => {
      api.removeAllListeners();
    };
  }, []);

  return (
      <div className="App" style={AppStyle}>

          {homeFolder !== '' ? <SourcePane
            paneName={SOURCE}
            mediaDrives={mediaDrives}
            homeFolder={homeFolder}
          /> : null}

          <CopyPane />

          {homeFolder !== '' ? <TargetPane
            paneName={TARGET}
            mediaDrives={mediaDrives}
            homeFolder={homeFolder}
          /> : null}

      </div>

  );
}

export default App;
