import { createContext, useContext, useState } from 'react'

const BirdieContext = createContext(null)

export function BirdieProvider({ children }) {
  const [open, setOpen]                 = useState(false)
  const [pendingPrompt, setPendingPrompt] = useState('')

  function openWithPrompt(prompt) {
    setPendingPrompt(prompt)
    setOpen(true)
  }

  return (
    <BirdieContext.Provider value={{ open, setOpen, pendingPrompt, setPendingPrompt, openWithPrompt }}>
      {children}
    </BirdieContext.Provider>
  )
}

export function useBirdie() {
  const ctx = useContext(BirdieContext)
  if (!ctx) throw new Error('useBirdie must be used inside BirdieProvider')
  return ctx
}
