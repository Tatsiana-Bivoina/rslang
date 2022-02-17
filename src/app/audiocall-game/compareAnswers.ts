import { rightWord, objectArr, postUserWords, wordArr, getOtherWords } from './startGame';
import { staticRound } from './statis';
export const answerArr: string[] = [];
export let score = 0;
type Answer = Event | string;

export function compareAnswer(e: Answer) {
  let theAnswer: string;
  typeof e == 'object' ? (theAnswer = (e!.target as HTMLElement).innerHTML) : (theAnswer = e);
  answerArr.push(theAnswer);
  if (rightWord.wordTranslate !== theAnswer) {
    document.querySelectorAll('.heart')[0].classList.add('broke');
    document.querySelectorAll('.heart')[0].classList.remove('heart');
    if (document.querySelectorAll('.heart').length == 0) {
      staticRound(objectArr, score);
    }
  } else {
    score += 10;
    postUserWords(rightWord);
  }
  if (objectArr.length === 20) {
    console.log('lenght = 20');
    staticRound(objectArr, score);
  } else {
    console.log('getOtherWord');
    getOtherWords(wordArr);
  }
}
