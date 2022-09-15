import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'Routes';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import reportWebVitals from './reportWebVitals';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token') || undefined}`;

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();
