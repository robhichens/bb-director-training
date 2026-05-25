import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { setPlatformUid } from './lib/platformSync.js'

// Capture ?uid= from the initial URL before React Router navigates away
const _uid = new URLSearchParams(window.location.search).get('uid')
if (_uid) setPlatformUid(_uid)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
