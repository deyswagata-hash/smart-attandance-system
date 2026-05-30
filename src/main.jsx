import React from 'react';
import { ThemeProvider } from "next-themes";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider attribute="class">
  <App />
</ThemeProvider>
);