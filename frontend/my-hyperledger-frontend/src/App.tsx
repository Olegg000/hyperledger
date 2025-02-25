import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Login} from './Pages/Login/Login'
import {Provider} from "react-redux";
import {store} from "./Store/Store";

const App:React.FC = () => {
  return (
      <Provider store={store}>
          <div className="App">
            <Login></Login>
          </div>
      </Provider>
  )
}

export default App;
