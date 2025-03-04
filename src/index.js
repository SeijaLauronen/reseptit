import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import MyErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider } from './SettingsContext';
import { ColorProvider } from './ColorContext'; //Pitää olla täällä
import { ProductClassProvider } from './ProductClassContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MyErrorBoundary>
        <ProductClassProvider>
            <ColorProvider>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </ColorProvider>
        </ProductClassProvider>
    </MyErrorBoundary>
);
// poistettu <React.StrictMode> App:n ympäriltä, että drag drop toimii myös localhostissa
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
