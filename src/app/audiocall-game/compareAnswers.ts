import { authorized } from '../dictionary/view';
import { rightWord, objectArr, postUserWords, wordArr, getOtherWords } from './startGame';
import { staticRound } from './statis';
export const answerArr: string[] = [];
export let score = 0;
export let maxSeriesTrue = 0;
let seriesTrue = 0;
type Answer = Event | string;

export function compareAnswer(e: Answer) {
  let theAnswer: string;
  typeof e == 'object' ? (theAnswer = (e!.target as HTMLElement).innerHTML) : (theAnswer = e);
  answerArr.push(theAnswer);
  if (rightWord.wordTranslate !== theAnswer) {
    seriesTrue = 0;
    document.querySelectorAll('.heart')[0].classList.add('broke');
    document.querySelectorAll('.heart')[0].classList.remove('heart');
    if (document.querySelectorAll('.heart').length == 0) {
      staticRound(objectArr, score);
    }
  } else {
    score += 10;
    seriesTrue++;
    if (maxSeriesTrue < seriesTrue) {
      maxSeriesTrue = seriesTrue;
    }
    if (authorized) {
      postUserWords(rightWord);
    }
  }
  if (objectArr.length === wordArr.length) {
    console.log(wordArr.length);
    staticRound(objectArr, score);
  } else {
    getOtherWords(wordArr);
  }
}
