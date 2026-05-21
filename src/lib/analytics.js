import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function recordQuizAttempt({ user, moduleId, sectionId, quizTitle, results, score, passed, numCorrect }) {
  try {
    await addDoc(collection(db, 'quizAttempts'), {
      userId:         user?.email ?? user?.name ?? 'unknown',
      userName:       user?.name  ?? 'unknown',
      location:       user?.location ?? '',
      moduleId,
      sectionId,
      quizTitle,
      score,
      passed,
      numCorrect,
      totalQuestions: results.length,
      answers: results.map(r => ({
        questionId:     r.id,
        questionText:   r.question,
        selectedAnswer: r.given,
        correct:        r.correct,
      })),
      timestamp: serverTimestamp(),
    })
  } catch (e) {
    console.error('Analytics write failed:', e)
  }
}

export async function recordScenarioChoice({ user, moduleId, sectionId, activityTitle, scenarioIdx, situationText, chosenLabel, correct }) {
  try {
    await addDoc(collection(db, 'scenarioChoices'), {
      userId:        user?.email ?? user?.name ?? 'unknown',
      userName:      user?.name  ?? 'unknown',
      location:      user?.location ?? '',
      moduleId,
      sectionId,
      activityTitle,
      scenarioIndex: scenarioIdx,
      situationText: situationText?.slice(0, 300) ?? '',
      chosenLabel,
      correct,
      timestamp: serverTimestamp(),
    })
  } catch (e) {
    console.error('Analytics write failed:', e)
  }
}
