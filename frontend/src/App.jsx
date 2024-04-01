import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
// import NotFound from './components/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route exact path="/register" element={<RegisterForm />} />
          {/* <Route path="*" element={<NotFound />} /> Fallback route for 404 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
