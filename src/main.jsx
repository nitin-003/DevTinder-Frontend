import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Fail instead of hanging forever if the server never answers, so the
// "Try again" screens can appear.
axios.defaults.timeout = 15000

createRoot(document.getElementById('root')).render(
    <App />
)


