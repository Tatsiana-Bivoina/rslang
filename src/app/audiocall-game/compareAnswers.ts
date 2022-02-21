import { authorized } from '../dictionary/view';
import { rightWord, objectArr, postUserWords, wordArr, getOtherWords, getUsersWords, getUsersWord } from './startGame';
import { staticRound } from './statis';
import { userWord } from './models';
export const answerArr: string[] = [];
export let score = 0;
export let maxSeriesTrue = 0;
export let correctCount: number;
export let errorCount: number;
let seriesTrue = 0;
type Answer = Event | string;

async function getCounts() {
  if (authorized) {
    const userWords: userWord[] = Array.from(await getUsersWords());
    for (let i = 0; i < userWords.length; i++) {
      if (rightWord.id == userWords[i].optional.wordId) {
        correctCount = userWords[i].optional!.correctCount;
        errorCount = userWords[i].optional!.errorCount;
        const optional = {
          correct: correctCount,
          error: errorCount
        };
        return optional;
      }
    }
    correctCount = 0;
    errorCount = 0;
    const optional = {
      correct: correctCount,
      error: errorCount
    };
    return optional;
  }
}

export async function compareAnswer(e: Answer) {
  let theAnswer: string;
  const optional = await getCounts();
  let method: string;
  if (optional?.correct || optional?.error) {
    method = 'PUT';
  } else {
    method = 'POST';
  }
  typeof e == 'object' ? (theAnswer = (e!.target as HTMLElement).innerHTML) : (theAnswer = e);
  answerArr.push(theAnswer);
  if (rightWord.wordTranslate !== theAnswer) {
    seriesTrue = 0;
    document.querySelectorAll('.heart')[0].classList.add('broke');
    document.querySelectorAll('.heart')[0].classList.remove('heart');
    if (document.querySelectorAll('.heart').length == 0) {
      staticRound(objectArr, score);
      score = 0;
    }
    if (authorized) {
      errorCount++;
      postUserWords(rightWord, 'easy', method, correctCount, errorCount);
    }
  } else {
    score += 10;
    seriesTrue++;
    if (maxSeriesTrue < seriesTrue) {
      maxSeriesTrue = seriesTrue;
    }
    if (authorized) {
      correctCount++;
      postUserWords(rightWord, 'easy', method, correctCount, errorCount);
    }
  }
  if (objectArr.length === wordArr.length) {
    staticRound(objectArr, score);
    score = 0;
  } else {
    getOtherWords(wordArr);
  }
}
