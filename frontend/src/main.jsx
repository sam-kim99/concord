import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import configureStore from './store/store.js';
import { restoreSession } from './utils/csrfUtils.js';
import { deleteSession, postSession, postUser } from './utils/sessionApiUtils.js';
import { createUser, loginUser, logoutUser } from './store/sessionReducer.js';
import { createServer, destroyServer, fetchServers, updateServer } from './store/serverReducer.js';
import { createChannel, destroyChannel, fetchChannels, updateChannel } from './store/channelReducer.js';

const initializeApp = () => {
  const store = configureStore();
  
  // for testing only
  window.store = store;
  window.postUser = postUser;
  window.postSession = postSession;
  window.deleteSession = deleteSession;
  window.createUser = createUser;
  window.loginUser = loginUser;
  window.logoutUser = logoutUser;
  window.createServer = createServer;
  window.updateServer = updateServer;
  window.destroyServer = destroyServer;
  window.fetchServers = fetchServers;
  window.createChannel = createChannel;
  window.updateChannel = updateChannel;
  window.destroyChannel = destroyChannel;
  window.fetchChannels = fetchChannels;
  //
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )  
}

restoreSession().then(initializeApp);
