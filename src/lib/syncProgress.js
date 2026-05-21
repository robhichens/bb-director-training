import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export const MODULE_ORDER = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']

const MODULE_LABELS = {
  module1: 'M1',
  module2: 'M2',
  module3: 'M3',
  module4: 'M4',
  module5: 'M5',
  module6: 'M6',
  module7: 'M7',
}

// Make a safe Firestore document ID from an email address
export function makeDocId(email) {
  return (email || 'anonymous')
    .replace(/[@.+]/g, '_')
    .toLowerCase()
    .slice(0, 64)
}

function calcOverallPct(progress) {
  const total      = MODULE_ORDER.length
  const completed  = MODULE_ORDER.filter(id => progress[id]?.status === 'completed').length
  const inProgress = MODULE_ORDER.filter(id => progress[id]?.status === 'in-progress').length
  return Math.round(((completed + inProgress * 0.5) / total) * 100)
}

// Called every time progress is saved — fire and forget
export async function syncProgressToFirestore(user, progress) {
  if (!user?.email) return
  try {
    const docId = makeDocId(user.email)
    await setDoc(
      doc(db, 'userProgress', docId),
      {
        userId:      user.email,
        name:        user.name     || '',
        location:    user.location || '',
        createdAt:   user.createdAt || null,
        overallPct:  calcOverallPct(progress),
        lastUpdated: serverTimestamp(),
        modules: MODULE_ORDER.reduce((acc, id) => {
          acc[id] = {
            status:       progress[id]?.status             || 'locked',
            completedAt:  progress[id]?.completedAt        || null,
            sectionsCount: progress[id]?.sectionsCompleted?.length || 0,
          }
          return acc
        }, {}),
      },
      { merge: true }
    )
  } catch (e) {
    // Non-critical — never break the UI over a sync failure
    console.warn('Progress sync failed (non-critical):', e)
  }
}

// Called on signup to create the initial user document
export async function createUserProfile(user) {
  if (!user?.email) return
  try {
    const docId = makeDocId(user.email)
    await setDoc(
      doc(db, 'userProgress', docId),
      {
        userId:      user.email,
        name:        user.name     || '',
        location:    user.location || '',
        createdAt:   user.createdAt || new Date().toISOString(),
        overallPct:  0,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (e) {
    console.warn('User profile create failed (non-critical):', e)
  }
}
