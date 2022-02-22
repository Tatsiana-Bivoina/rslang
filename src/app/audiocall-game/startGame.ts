import { userWord, Word } from './models';
import { renderQuestion, renderRound } from './view';
import { UserData } from '../authorization/storage';
import { authorized, getHardWords, i } from '../dictionary/view';
import SprintService from '../sprint-game/SprintService';

export const objectArr: Word[] = [];
export let questionWords: Array<Word> = [];
export let rightWord: Word;
export let questionNum = 0;
export let wordArr: Word[] = [];
export let servise: SprintService;
let randPage: number;

export async function getWords(i: number, page?: number): Promise<void> {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  servise = new SprintService();
  const statisticStart = servise.getStatistic(user.userId, token);
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

export async function getUsersWord(word: Word) {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  const wordId = word.id ? word.id : word._id;
  try {
    const url = await fetch(`https://rslang-leanwords.herokuapp.com/users/${user.userId}/words/${wordId}`, {
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

export async function postUserWords(
  word: Word,
  diff?: string,
  methodPut?: string,
  correctCount?: number,
  errorCount?: number,
  learned?: boolean
) {
  const method = methodPut ? methodPut : 'POST';
  const user = new UserData();
  const token = (await user.getToken()).toString();
  const wordId = word.id ? word.id : word._id;
  const otherCorrectCount = method == 'POST' ? '0' : `${(await getUsersWord(word)).optional.correctCount}`;
  const otherErrorCount = method == 'POST' ? '0' : `${(await getUsersWord(word)).optional.errorCount}`;
  const correct = correctCount !== undefined ? correctCount : Number(otherCorrectCount);
  const error = errorCount !== undefined ? errorCount : Number(otherErrorCount);
  const aboutWord = {
    difficulty: !diff ? 'easy' : `${diff}`,
    optional: {
      testFieldString: 'test',
      testFieldBoolean: learned == undefined ? true : learned,
      wordId: wordId,
      correctCount: correct,
      errorCount: error
    }
  };
  const rawResponse = await fetch(`https://rslang-leanwords.herokuapp.com/users/${user.userId}/words/${wordId}`, {
    method: `${method}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(aboutWord)
  });
  if (rawResponse.status == 417) {
    postUserWords(word, diff, 'PUT', correctCount, errorCount);
  }
}

function getRandomNum(num: number): number {
  return Math.floor(Math.random() * num);
}

function mixArr(res: Word[]) {
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
  questionWords.push(rightWord);
  objectArr.push(rightWord);
  getAudio(rightWord.audio);
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
  playSound();
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
