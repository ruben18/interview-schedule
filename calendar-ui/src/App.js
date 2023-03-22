
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css';
import store from './stores/store'
import { Provider } from 'react-redux'
import React, { useEffect } from 'react';

import Login from './component/login';
import Dashboard from './component/dashboard'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  useEffect(() => {
    document.title = 'Calendar Interview';
  });
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route exact path='/' element={< Login />}></Route>
          <Route exact path='/dashboard' element={< Dashboard />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
