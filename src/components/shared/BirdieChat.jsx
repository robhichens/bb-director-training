import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBirdie } from '../../context/BirdieContext'
import styles from './BirdieChat.module.css'

export default function BirdieChat() {
  const { open, setOpen, pendingPrompt, setPendingPrompt } = useBirdie()
  const [messages, setMessages] = useState([])   // [{role:'user'|'assistant', content:''}]
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [nudge, setNudge]     = useState(true)   // "Ask, Birdie!" speech bubble
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when drawer opens; inject pendingPrompt if present
  useEffect(() => {
    if (open) {
      setNudge(false)
      if (pendingPrompt) {
        setInput(pendingPrompt)
        setPendingPrompt('')
      }
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, pendingPrompt, setPendingPrompt])

  async function send() {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/birdie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,          // send full history for context
        }),
      })
      const data = await res.json()
      const reply = data.reply || data.error || 'Something went wrong — try again!'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops — couldn't reach Birdie. Check your connection and try again!" }])
    } finally {
      setLoading(false)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clearChat() {
    setMessages([])
  }

  return (
    <div className={styles.root}>
      {/* Chat drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.drawer}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className={styles.header}>
              <img src="/images/bird-coral.png" alt="" className={styles.headerBird} />
              <div className={styles.headerText}>
                <p className={styles.headerName}>Birdie</p>
                <p className={styles.headerSub}>BB Training Assistant</p>
              </div>
              <div className={styles.headerActions}>
                {messages.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearChat} title="Clear chat">
                    ↺
                  </button>
                )}
                <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.length === 0 ? (
                <div className={styles.welcome}>
                  <img src="/images/bird-coral.png" alt="Birdie" className={styles.welcomeBird} />
                  <p className={styles.welcomeText}>Hi! I'm Birdie 👋</p>
                  <p className={styles.welcomeSub}>
                    Ask me anything about Bright Beginnings operations, Virginia licensing (Title 22), or ECE best practices.
                  </p>
                  <div className={styles.prompts}>
                    {[
                      'What are the VA staff ratios?',
                      'How do I handle a C staff member?',
                      'What goes in the licensing binder?',
                    ].map(p => (
                      <button
                        key={p}
                        className={styles.promptChip}
                        onClick={() => { setInput(p); inputRef.current?.focus() }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${styles.msg} ${msg.role === 'user' ? styles.userMsg : styles.birdieMsg}`}
                  >
                    {msg.role === 'assistant' && (
                      <img src="/images/bird-coral.png" alt="" className={styles.msgAvatar} />
                    )}
                    <div className={styles.msgBubble}>{msg.content}</div>
                  </div>
                ))
              )}
              {loading && (
                <div className={`${styles.msg} ${styles.birdieMsg}`}>
                  <img src="/images/bird-coral.png" alt="" className={styles.msgAvatar} />
                  <div className={`${styles.msgBubble} ${styles.typing}`}>
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask Birdie a question…"
                disabled={loading}
              />
              <button
                className={styles.sendBtn}
                onClick={send}
                disabled={loading || !input.trim()}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <div className={styles.triggerWrap}>
        <AnimatePresence>
          {nudge && !open && (
            <motion.div
              className={styles.nudge}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              Ask, Birdie!
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className={styles.trigger}
          onClick={() => setOpen(o => !o)}
          aria-label="Ask Birdie"
        >
          <img src="/images/bird-coral.png" alt="Birdie" className={styles.triggerBird} />
        </button>
      </div>
    </div>
  )
}
