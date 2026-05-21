import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useBirdie } from '../context/BirdieContext'
import { getTipsGrouped } from '../lib/tipEngine'
import styles from './Briefing.module.css'

const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']

function greeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function monthSeasonLabel(month) {
  // month is 1-based
  const labels = {
    1: '❄️ January Focus',  2: '💝 February Focus', 3: '🌸 March Focus',
    4: '🌷 April Focus',    5: '🏆 May Focus',       6: '☀️ June Focus',
    7: '🌴 July Focus',     8: '🎒 August Focus',    9: '🍂 September Focus',
    10: '🎃 October Focus', 11: '🦃 November Focus', 12: '🎄 December Focus',
  }
  return labels[month] ?? 'This Season'
}

function TipCard({ tip, onAskBirdie }) {
  return (
    <motion.div
      className={`${styles.tipCard} ${styles[tip.urgency]}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className={styles.tipTop}>
        <h3 className={styles.tipTitle}>{tip.title}</h3>
        <span className={`${styles.urgencyBadge} ${styles[tip.urgency]}`}>
          {tip.urgency === 'high' ? '🔴 Urgent' : tip.urgency === 'medium' ? '🟡 Today' : '🟢 FYI'}
        </span>
      </div>
      <p className={styles.tipBody}>{tip.body}</p>
      <div className={styles.tipFooter}>
        <span className={styles.categoryTag}>{tip.category}</span>
        <button
          className={styles.askBirdieBtn}
          onClick={() => onAskBirdie(tip.birdiePrompt)}
          aria-label={`Ask Birdie about: ${tip.title}`}
        >
          <img src="/images/bird-coral.png" alt="" className={styles.birdieIcon} />
          Ask Birdie →
        </button>
      </div>
    </motion.div>
  )
}

function SectionGroup({ emoji, label, tips, onAskBirdie, emptyText }) {
  return (
    <div className={styles.sectionGroup}>
      <p className={styles.sectionLabel}>
        <span className={styles.sectionLabelEmoji}>{emoji}</span>
        {label}
      </p>
      {tips.length === 0 ? (
        <div className={styles.emptyCard}>{emptyText}</div>
      ) : (
        tips.map(tip => (
          <TipCard key={tip.id} tip={tip} onAskBirdie={onAskBirdie} />
        ))
      )}
    </div>
  )
}

export default function Briefing() {
  const { user }           = useAuth()
  const { openWithPrompt } = useBirdie()

  const now       = new Date()
  const hour      = now.getHours()
  const dayName   = DAY_NAMES[now.getDay()]
  const monthName = MONTH_NAMES[now.getMonth()]
  const dateNum   = now.getDate()
  const month     = now.getMonth() + 1

  const firstName = user?.name?.split(' ')[0] ?? 'Director'

  const grouped = useMemo(() => getTipsGrouped(now), [])  // stable per render

  const totalTips = grouped.rightNow.length + grouped.today.length +
                    grouped.thisMonth.length + grouped.thisSeason.length

  function handleAskBirdie(prompt) {
    openWithPrompt(prompt)
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {greeting(hour)}, {firstName}
          </h1>
          <p className={styles.heroSub}>
            {dayName}, {monthName} {dateNum} &nbsp;·&nbsp;
            {totalTips > 0
              ? `${totalTips} item${totalTips !== 1 ? 's' : ''} relevant right now`
              : 'All clear — nothing urgent at this moment'}
          </p>
        </div>
        <img src="/images/bird-coral.png" alt="Birdie" className={styles.heroBird}
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
      </motion.div>

      {/* All-clear state */}
      {totalTips === 0 && (
        <motion.div
          className={styles.allClear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <img src="/images/bird-coral.png" alt="" className={styles.allClearBird} />
          <h2 className={styles.allClearTitle}>You're all caught up!</h2>
          <p className={styles.allClearSub}>
            No time-sensitive items right now. Check back during active hours or on key dates.
          </p>
        </motion.div>
      )}

      {/* Tip sections */}
      {totalTips > 0 && (
        <motion.div
          className={styles.sections}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          {grouped.rightNow.length > 0 && (
            <SectionGroup
              emoji="⏰"
              label="Right Now"
              tips={grouped.rightNow}
              onAskBirdie={handleAskBirdie}
              emptyText="Nothing time-sensitive at the moment."
            />
          )}

          {grouped.today.length > 0 && (
            <SectionGroup
              emoji="📋"
              label={`Today — ${dayName}`}
              tips={grouped.today}
              onAskBirdie={handleAskBirdie}
              emptyText="No specific tasks scheduled for today."
            />
          )}

          {grouped.thisMonth.length > 0 && (
            <SectionGroup
              emoji="📅"
              label={`This Month — Day ${dateNum}`}
              tips={grouped.thisMonth}
              onAskBirdie={handleAskBirdie}
              emptyText="No date-specific tasks for today."
            />
          )}

          {grouped.thisSeason.length > 0 && (
            <SectionGroup
              emoji="🗓"
              label={monthSeasonLabel(month)}
              tips={grouped.thisSeason}
              onAskBirdie={handleAskBirdie}
              emptyText="No seasonal focus items this month."
            />
          )}
        </motion.div>
      )}
    </div>
  )
}
