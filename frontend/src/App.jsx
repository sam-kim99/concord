import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './components/Splash/Splash'
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import NotFound from './components/NotFound/NotFound';
import MainPage from './components/MainPage/MainPage';
import MePage from './components/MePage/MePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={< Splash />} />
          <Route exact path="/login" element={< LoginForm />} />
          <Route exact path="/signup" element={< RegisterForm />} />
          <Route exact path="/channels/@me" element={ <MePage/> }/>
          <Route path="/channels/:serverId" element={ <MainPage/> } />
            {/* <Route path=":channelId" element={ <MainPage/> }/>
          </Route> */}
          <Route path="/channels/:serverId/:channelId" element={ <MainPage/> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
