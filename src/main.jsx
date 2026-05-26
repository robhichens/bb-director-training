import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { setPlatformUid, clearPlatformUid } from './lib/platformSync.js'

// Capture ?uid= from the initial URL before React Router navigates away.
// If there's no ?uid=, clear any leftover platform-mode session so that
// direct visitors always go through the normal sign-in flow.
const _uid = new URLSearchParams(window.location.search).get('uid')
if (_uid) {
  setPlatformUid(_uid)
} else {
  clearPlatformUid()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
