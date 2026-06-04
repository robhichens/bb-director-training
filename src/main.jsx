import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { signInWithCustomToken } from 'firebase/auth'
import './styles/global.css'
import App from './App.jsx'
import { auth } from './lib/firebase.js'
import { setPlatformUid, clearPlatformUid } from './lib/platformSync.js'

// Capture ?token= from the initial URL before React Router navigates away.
// Sign in with the custom token so the spoke app has a real Firebase auth session.
// If there's no token, clear any leftover platform-mode session.
const _token = new URLSearchParams(window.location.search).get('token')
if (_token) {
  signInWithCustomToken(auth, _token)
    .then(cred => setPlatformUid(cred.user.uid))
    .catch(err => {
      console.warn('Spoke token sign-in failed:', err)
      clearPlatformUid()
    })
} else {
  clearPlatformUid()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
