import { postUserWords, getUsersWords, getUsersWord } from '../audiocall-game/startGame';
import { UserData } from '../authorization/storage';
import { Word, userWord } from '../audiocall-game/models';
import { correctCount } from '../audiocall-game/compareAnswers';
export let pageNum = 0;

export let i: string;

export let authorized = localStorage.getItem('name') || false;

export async function dictionaryView(): Promise<HTMLDivElement> {
  authorized = localStorage.getItem('name') || false;
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__dictionary');
  page.innerHTML = `<div class="book-page-wrapper">
  <div class="book-page">
    <div class="nav-group">
      <div class="nav-item group-1" id="0" style="background: linear-gradient(#db9090, #ebebeb)">Раздел 1</div>
      <div class="nav-item group-2" id="1" style="background: linear-gradient(#dbca90, #ebebeb)">Раздел 2</div>
      <div class="nav-item group-3" id="2" style="background: linear-gradient(#b4db90, #ebebeb)">Раздел 3</div>
      <div class="nav-item group-4" id="3" style="background: linear-gradient(#90dbbe, #ebebeb)">Раздел 4</div>
      <div class="nav-item group-5" id="4" style="background: linear-gradient(#9190db, #ebebeb)">Раздел 5</div>
      <div class="nav-item group-6" id="5" style="background: linear-gradient(#db90d1, #ebebeb)">Раздел 6</div>
    </div>
    <div class="words-wrap">
      <div class="words">
      </div>
      <div class="pagination-page">
    </div>
    </div>
  </div>
</div>`;
  if (authorized) {
    const difficultWrap = document.createElement('div');
    difficultWrap.classList.add('nav-item', 'difficult');
    difficultWrap.id = '6';
    difficultWrap.innerHTML = `Сложные слова`;
    page.querySelector('.nav-group')?.append(difficultWrap);
  }
  getWords();
  setTimeout(() => {
    document.querySelector('.nav-group')?.addEventListener('click', (e) => {
      getWords(e);
    });
    document.querySelector('.pagination-page')?.addEventListener('click', (e) => {
      paginatePages(e);
    });
  }, 500);

  return page;
}

function paginatePages(e: Event) {
  switch ((e.target as HTMLElement).id) {
    case 'double-l':
      if (pageNum != 0) {
        pageNum = 0;
      }
      break;
    case 'l':
      if (pageNum > 0) {
        pageNum--;
      }
      break;
    case 'double-r':
      if (pageNum < 29) {
        pageNum = 29;
      }
      break;
    case 'r':
      if (pageNum < 29) {
        pageNum++;
      }
      break;
  }
  getWords();
}

async function getWords(e?: Event): Promise<void> {
  const colorId = localStorage.getItem('colorId') || '0';
  localStorage.setItem('colorId', colorId);
  i = e ? (e?.target as HTMLElement).id : localStorage.getItem('colorId')!;
  if (i == '6') {
    const hardArr = (await getHardWords())[0].paginatedResults;
    renderPage(hardArr, i);
  } else {
    const url2 = await fetch(`https://rslang-leanwords.herokuapp.com/words?group=${i}&page=${pageNum}`);
    const wordsArr: Word[] = Array.from(await url2.json());
    renderPage(wordsArr, i);
  }
}

async function renderPage(wordsArr: Word[], id?: string) {
  if (id) {
    localStorage.setItem('colorId', id);
  }
  id = localStorage.getItem('colorId') || undefined;
  const wordsWrapp = document.querySelector('.words') as HTMLElement;
  const paginationWrap = document.querySelector('.pagination-page');
  paginationWrap!.innerHTML = ``;
  wordsWrapp.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  let color = `#db9090`;
  let hardArr: Word[] = [];
  let easyArr: Word[] = [];
  if (authorized) {
    hardArr = (await getHardWords())[0].paginatedResults;
    easyArr = (await getEasyWords())[0].paginatedResults;
  }
  for (let i = 0; i < wordsArr.length; i++) {
    switch (id) {
      case '0':
        color = `#db9090`;
        break;
      case '1':
        color = `#dbca90`;
        break;
      case '2':
        color = `#b4db90`;
        break;
      case '3':
        color = `#90dbbe`;
        break;
      case '4':
        color = `#9190db`;
        break;
      case '5':
        color = `#db90d1`;
        break;
      case '6':
        color = `rgb(78,78,78)`;
        break;
    }
    const complecation = {
      class: 'easy',
      word: 'Сложное',
      correct: '0',
      error: '0'
    };
    const learned = {
      class: 'learned',
      word: 'Уже знаю',
      correct: '0',
      error: '0'
    };
    if (authorized !== false) {
      hardArr.forEach((word) => {
        if (word._id === wordsArr[i].id || id == '6') {
          complecation.class = 'hard';
          complecation.word = 'Простое';
          color = 'rgb(78,78,78)';
          complecation.correct = word.userWord.optional!.correctCount.toString();
          complecation.error = word.userWord.optional!.errorCount.toString();
        }
      });
      easyArr.forEach((word) => {
        if (word._id === wordsArr[i].id) {
          learned.correct = word.userWord.optional!.correctCount.toString();
          learned.error = word.userWord.optional!.errorCount.toString();
          if (learned.correct < learned.error || !word.userWord.optional.testFieldBoolean) {
            learned.word = 'Уже знаю';
            learned.class = 'learned';
          } else {
            color = '#00ff0e';
            learned.class = 'learned-word';
            learned.word = 'Не знаю';
          }
        }
      });
    }
    const wordCard = document.createElement('div');
    wordCard.classList.add('word-card');
    wordCard.innerHTML = `<div class="word-image" style="box-shadow: 0px 5px 25px ${color}"></div>
    <div class="shadow" style="background: linear-gradient(rgba(0, 0, 0, 0), ${color} 190%)">
    <div class="about-word">
      <div class="book-word"><div class="word-audio"></div>${wordsArr[i].word}</div>
      <div class="transcription">${wordsArr[i].transcription}</div>
      <div class="translate">${wordsArr[i].wordTranslate}</div>
    <div class="progress"></div>
    </div>
    <div class="description">
    <div class="parts">
    <div class="english-part">
    <div class="meaning-en"><div class="meaning-audio"></div>${wordsArr[i].textMeaning}</div>
    <div class="example-en"><div class="example-audio"></div>${wordsArr[i].textExample}</div>
  </div>
  <div class="russian-part">
    <div class="meaning-ru">${wordsArr[i].textMeaningTranslate}</div>
    <div class="example-ru">${wordsArr[i].textExampleTranslate}</div></div>
    </div>
    <div class="word-buttons">
    </div>
    </div>
    </div>
    </div>`;
    if (authorized) {
      wordCard.querySelector('.word-buttons')!.innerHTML = `
      <div class="difficulty ${complecation.class}-word">${complecation.word}</div>
      <div class="learned ${learned.class}">${learned.word}</div>`;
      wordCard.querySelector('.difficulty')?.addEventListener('click', (e: Event) => {
        addToComplecative(wordsArr[i], e, color);
      });
      wordCard.querySelector('.learned')?.addEventListener('click', (e: Event) => {
        addToLearned(wordsArr[i], e, color);
      });
      wordCard.querySelector('.progress')!.innerHTML = `${learned.correct || complecation.correct} : ${
        learned.error || complecation.error
      }`;
    }
    wordCard.querySelector('.word-audio')?.addEventListener('click', () => {
      const audio = new Audio(`https://rslang-leanwords.herokuapp.com/${wordsArr[i].audio}`);
      audio.play();
    });
    wordCard.querySelector('.meaning-audio')?.addEventListener('click', () => {
      const audio = new Audio(`https://rslang-leanwords.herokuapp.com/${wordsArr[i].audioMeaning}`);
      audio.play();
    });
    wordCard.querySelector('.example-audio')?.addEventListener('click', () => {
      const audio = new Audio(`https://rslang-leanwords.herokuapp.com/${wordsArr[i].audioExample}`);
      audio.play();
    });
    (
      wordCard.querySelector('.word-image') as HTMLElement
    ).style.backgroundImage = `url("https://rslang-leanwords.herokuapp.com/${wordsArr[i].image}")`;
    fragment.appendChild(wordCard);
  }
  wordsWrapp?.append(fragment);
  const pagesNum = id == '6' ? Math.ceil(hardArr.length / 20) : '30';
  paginationWrap!.innerHTML = `
  <div class="pag-but double-left-arrow" id="double-l"></div>      
  <div class="pag-but left-arrow" id="l"></div>
  <div class="pag-but-num">${pageNum + 1}/${pagesNum}</div>
  <div class="pag-but right-arrow" id="r"></div>
  <div class="pag-but double-right-arrow" id="double-r"></div>`;
}

async function getMethod(word: Word): Promise<void | string> {
  return (await getUsersWord(word)) ? 'PUT' : 'POST';
}

async function addToComplecative(word: Word, e: Event, color?: string) {
  const method = `${await getMethod(word)}`;
  if (!(e.target as HTMLElement).classList.contains('hard-word')) {
    postUserWords(word, 'hard', method);
    (e.target as HTMLElement).classList.add('hard-word');
    ((e.target as Element).closest('.shadow') as HTMLElement).style.background =
      'linear-gradient(rgba(0, 0, 0, 0), rgb(78,78,78) 190%)';
    (e.target as HTMLElement).innerHTML = 'Простое';
  } else {
    (e.target as HTMLElement).classList.remove('hard-word');
    (
      (e.target as Element).closest('.shadow') as HTMLElement
    ).style.background = `linear-gradient(rgba(0, 0, 0, 0), ${color} 190%)`;
    (e.target as HTMLElement).innerHTML = 'Сложное';
    postUserWords(word, 'easy', method);
  }
}

async function addToLearned(word: Word, e: Event, color?: string) {
  const method = `${await getMethod(word)}`;
  if (!(e.target as HTMLElement).classList.contains('learned-word')) {
    (e.target as HTMLElement).classList.add('learned-word');
    (
      (e.target as Element).closest('.shadow') as HTMLElement
    ).style.background = `linear-gradient(rgba(0, 0, 0, 0), #00ff0e 100%)`;
    (e.target as HTMLElement).innerHTML = 'Не знаю';
    postUserWords(word, 'easy', method);
  } else {
    (e.target as HTMLElement).classList.remove('learned-word');
    (
      (e.target as Element).closest('.shadow') as HTMLElement
    ).style.background = `linear-gradient(rgba(0, 0, 0, 0), ${color} 190%)`;
    (e.target as HTMLElement).innerHTML = 'Уже знаю';
  }
}

export async function getHardWords() {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  const rawResponse = await fetch(
    `https://rslang-leanwords.herokuapp.com/users/${user.userId}/aggregatedWords?wordsPerPage=3600&filter={"userWord.difficulty":"hard"}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const res = await rawResponse.json();
  return res;
}

async function getEasyWords() {
  const user = new UserData();
  const token = (await user.getToken()).toString();
  const rawResponse = await fetch(
    `https://rslang-leanwords.herokuapp.com/users/${user.userId}/aggregatedWords?wordsPerPage=3600&filter={"userWord.difficulty":"easy"}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const res = await rawResponse.json();
  return res;
}
