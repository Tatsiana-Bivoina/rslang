import { userWord, Word } from './models';
import { staticRound } from './statis';
import { renderQuestion, renderRound } from './view';
import { UserData } from '../authorization/storage';
import { score } from './compareAnswers';
import { authorized, getHardWords, i } from '../dictionary/view';

export const objectArr: Word[] = [];
export let questionWords: Array<Word> = [];
export let rightWord: Word;
export let questionNum = 0;
export let wordArr: Word[] = [];
let randPage: number;

export async function getWords(i: number, page?: number): Promise<void> {
  console.log(page, i);
  if (i == 6) {
    const hardArr = (await getHardWords())[0].paginatedResults;
    return mixArr(hardArr);
  }
  localStorage.setItem('group', `${i}`);
  questionWords = [];
  questionNum = 0;
  if (page !== undefined) {
    randPage = page;
  } else {
    randPage = getRandomNum(30);
  }
  localStorage.setItem('page', `${randPage}`);
  const url = await fetch(`https://rslang-leanwords.herokuapp.com/words?group=${i}&page=${randPage}`);
  const res: Word[] = await url.json();
  mixArr(res);
}

export async function getUsersWords() {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  try {
    const url = await fetch(`https://rslang-leanwords.herokuapp.com/users/${user.userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    const res = await url.json();
    return res;
  } catch (e) {
    console.log(`Error...${e}`);
  }
}

export async function postUserWords(word: Word, diff?: string) {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  const wordId = word.id ? word.id : word._id;
  const aboutWord = {
    difficulty: !diff ? 'easy' : `${diff}`,
    optional: {
      testFieldString: 'test',
      testFieldBoolean: true,
      wordId: wordId
    }
  };
  const rawResponse = await fetch(`https://rslang-leanwords.herokuapp.com/users/${user.userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(aboutWord)
  });
}

function getRandomNum(num: number): number {
  return Math.floor(Math.random() * num);
}

function mixArr(res: Word[]) {
  console.log('startMix');
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  getOtherWords(res);
}

export async function getOtherWords(mixedArr: Word[]): Promise<Word[] | void> {
  questionWords = [];
  wordArr = mixedArr;
  rightWord = mixedArr[questionNum];
  if (authorized !== false && i !== '6') {
    const userArr: userWord[] = Array.from(await getUsersWords());
    for (let i = 0; i < userArr.length; i++) {
      if (userArr[i].optional.wordId == rightWord._id) {
        questionNum++;
        if (questionNum == 20) {
          // if (randPage >= 1) {
          //   randPage--;
          //   const anotherPageWords = await getWords(i, randPage);
          // }
          return staticRound(objectArr, score);
        } else {
          return getOtherWords(wordArr);
        }
      }
    }
  }
  questionWords.push(rightWord);
  objectArr.push(rightWord);
  getAudio(rightWord.audio);
  playSound();
  questionNum++;
  while (questionWords.length !== 4) {
    const ranNum = getRandomNum(mixedArr.length);
    const word: Word = mixedArr[ranNum];
    if (!questionWords.includes(word)) {
      questionWords.push(word);
    }
  }
  if (!document.querySelector('.answers')) {
    renderRound();
  } else {
    renderQuestion();
  }
  return questionWords;
}

let audio: HTMLAudioElement;

export async function getAudio(audioUrl: string): Promise<void> {
  audio = new Audio(`https://rslang-leanwords.herokuapp.com/${audioUrl}`);
  // audio.play();
}

export function playSound() {
  audio.play();
}
