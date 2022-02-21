import {
  Word,
  GameResult,
  UserChoiseOptional,
  GameStatistic,
  ParametersSendWord,
  ParametersGetStatistics,
  ParametersPutStatistics
} from './abstracts';
import SprintService from './SprintService';
import SprintView from './SprintView';
import { drawPage } from '../app';
import { mainView } from '../main/view';
import { UserData } from '../authorization/storage';

export default class SprintController {
  sprintService: SprintService;

  sprintView: SprintView;

  userData: UserData;

  rand: number;

  wordsArr: string[];

  translationArr: string[];

  gameResults: GameResult[];

  index: number;

  counter: number;

  pressedBtn: string;

  price: number;

  totalPoints: number;

  checkboxCount: number;

  level: string;

  page: string;

  userId: string;

  token: string;

  userChoiseOptional: UserChoiseOptional;

  static gameStatistic: ParametersPutStatistics = {
    learnedWords: 0,
    optional: {
      statistics: []
    }
  };

  statistics: GameStatistic;

  seriesTrueAnswers: number;

  counterTrueAnswers: number;
  static SprintController: any;

  constructor() {
    this.sprintService = new SprintService();
    this.sprintView = new SprintView();
    this.rand = 0;
    this.wordsArr = [];
    this.translationArr = [];
    this.gameResults = [];
    this.index = 0;
    this.pressedBtn = '';
    this.counter = 0;
    this.price = 10;
    this.totalPoints = 0;
    this.checkboxCount = 0;
    this.level = '';
    this.page = '';
    this.userData = new UserData();
    this.userId = '';
    this.token = '';
    this.userChoiseOptional = {
      wordId: '',
      correctCount: 0,
      errorCount: 0
    };
    this.statistics = {
      gameName: '',
      wordsTrueId: [],
      wordsFalseId: [],
      score: 0,
      seriesTrueAnswers: 0,
      learnedWords: []
    };
    this.seriesTrueAnswers = 0;
    this.counterTrueAnswers = 0;
    this.getUserData();
  }

  private async getUserData(): Promise<void> {
    this.userId = this.userData.userId;
    if (this.userId !== '') {
      this.token = await this.userData.getToken();
      await this.getStatistics();
    }
  }

  async getStatistics(): Promise<void> {
    const response: ParametersGetStatistics | undefined = await this.sprintService.getStatistic(
      this.userId,
      this.token
    );
    if (typeof response !== 'undefined') {
      SprintController.gameStatistic.learnedWords = response.learnedWords;
      SprintController.gameStatistic.optional.statistics = JSON.parse(response.optional.statistics);
    }
  }

  async toggleFullScreen(): Promise<void> {
    const btnFullScreen: HTMLElement | null = document.querySelector('.btn-fullscreen');
    btnFullScreen?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  async chooseLevel(): Promise<void> {
    const btnsBlock: HTMLElement | null = document.querySelector('.levels');
    const btnStart: HTMLElement | null = document.querySelector('.btn-start');

    btnsBlock?.addEventListener('click', async (ev) => {
      const btn = ev.target as HTMLElement;
      if (btn.classList.contains('btn-level')) {
        if (btnStart) this.addActiveClass(btn, btnStart);
        this.level = (Number(btn.textContent) - 1).toString();
        this.page = Math.floor(this.getRandomNumber()).toString();
        await this.getWordsCollection();
        btnStart?.removeAttribute('disabled');
      }
      if (btn.classList.contains('btn-start')) {
        this.startGame();
      }
    });
  }

  async getWordsCollection(): Promise<void> {
    if (this.userId !== '') {
      SprintService.wordCollection = await this.sprintService.getAggregatedWords(
        this.level,
        this.page,
        this.userId,
        this.token
      );
      if (SprintService.wordCollection.length < 20) {
        this.page = Math.floor(this.getRandomNumber()).toString();
        const response = await this.sprintService.getAggregatedWords(this.level, this.page, this.userId, this.token);
        SprintService.wordCollection = SprintService.wordCollection.concat(response);
      }
      console.log(SprintService.wordCollection);
    } else {
      SprintService.wordCollection = await this.sprintService.getWords(this.level, this.page);
    }
  }

  async closeGame(): Promise<void> {
    const btnExit: Element | null = document.querySelector('.btn-exit');
    btnExit?.addEventListener('click', async () => {
      await drawPage(mainView);
    });
  }

  private addActiveClass(pressedBtn: HTMLElement, btnStart: HTMLElement): void {
    const levelBtns: NodeListOf<Element> = document.querySelectorAll('.btn-level');
    levelBtns.forEach((el) => {
      el.classList.remove('active');
    });
    pressedBtn.classList.add('active');
    btnStart.classList.add('active');
  }

  private getRandomNumber(): number {
    const min = 0;
    const max = 30;
    return Math.random() * (max - min) + min;
  }

  startGame(): void {
    this.statistics.gameName = 'sprint-game';
    this.sprintView.sprintGameView();
    this.createWordsArr();
    this.addListenerToBtnTrue();
    this.addListenerToBtnFalse();
    this.addListenerToArrows();
    this.updateWordContainer();
    this.startTimer();
  }

  // Game Logic

  private startTimer(): void {
    const secondsBlock: HTMLElement | null = document.querySelector('.seconds');
    const countdownNumber: HTMLElement | null = document.querySelector('.countdown-number');
    const num: HTMLElement | null = document.querySelector('.countdown-number span');
    let seconds = 60;

    const intervalId = setInterval(() => {
      if (secondsBlock && countdownNumber && num) {
        secondsBlock.innerHTML = `${seconds}`;
        if (seconds === 10) {
          countdownNumber.setAttribute('style', 'border-color: #f50057');
          num.setAttribute('style', 'color: #f50057');
        }
      }
      seconds -= 1;
      if (seconds < 0 || this.index === SprintService.wordCollection.length) {
        clearInterval(intervalId);
        this.sprintView.sprintStatisticView();
        this.updateStatisticPage(this.gameResults, this.totalPoints);
      }
    }, 1000);
  }

  private generateRandomIndexes(): number[] {
    const randomIndex: number[] = [];
    for (let i = 0; i < 9; i++) {
      const randEl = Math.round(Math.random() * (this.wordsArr.length - 1));
      if (randomIndex.includes(randEl)) {
        i--;
        continue;
      } else {
        randomIndex.push(randEl);
      }
    }
    return randomIndex;
  }

  private shuffleTranslations(arr: string[]): string[] {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  private getRandomTranslations(): void {
    let randTranslation = [];
    const randomIndexArr = this.generateRandomIndexes();
    for (let i = 0; i < randomIndexArr.length; i++) {
      randTranslation.push(this.translationArr[randomIndexArr[i]]);
    }
    randTranslation = this.shuffleTranslations(randTranslation);

    for (let i = 0; i < randomIndexArr.length; i++) {
      this.translationArr[randomIndexArr[i]] = randTranslation[i];
    }
  }

  private createWordsArr(): void {
    SprintService.wordCollection.forEach((el) => {
      this.wordsArr.push(el.word);
      this.translationArr.push(el.wordTranslate);
    });
    this.getRandomTranslations();
  }

  private updateWordContainer(): void {
    const word: Element | null = document.querySelector('.word');
    const translation: Element | null = document.querySelector('.translation');
    if (word && translation) {
      word.innerHTML = this.wordsArr[this.index];
      translation.innerHTML = this.translationArr[this.index];
    }
  }

  private addListenerToBtnTrue(): void {
    const btnTrue: Element | null = document.querySelector('.btn-true');
    btnTrue?.addEventListener('click', () => {
      this.pressedBtn = 'btnTrue';
      this.nextWord();
    });
  }

  private addListenerToArrows(): void {
    document.addEventListener('keydown', (event) => {
      if (event.code == 'ArrowRight') {
        this.pressedBtn = 'btnTrue';
        this.nextWord();
      }
      if (event.code == 'ArrowLeft') {
        this.pressedBtn = 'btnFalse';
        this.nextWord();
      }
    });
  }

  private addListenerToBtnFalse(): void {
    const btnFalse: Element | null = document.querySelector('.btn-false');
    btnFalse?.addEventListener('click', () => {
      this.pressedBtn = 'btnFalse';
      this.nextWord();
    });
  }

  private async nextWord(): Promise<void> {
    const isRight: boolean = this.checkIfTranslationRight();
    const checkboxes: NodeListOf<Element> = document.querySelectorAll('.checkbox');
    const parameters: ParametersSendWord = {
      userId: this.userId,
      wordId: this.userChoiseOptional.wordId,
      token: this.token,
      optional: this.userChoiseOptional,
      methodHttp: 'POST'
    };
    let currentWordId: string | undefined = '';
    if (this.userId !== '') {
      currentWordId = SprintService.wordCollection[this.index]._id;
    } else {
      currentWordId = SprintService.wordCollection[this.index].id;
    }
    if (isRight && typeof currentWordId !== 'undefined') {
      this.chooseWrightWord(checkboxes);
      this.userChoiseOptional.correctCount = 1;
      this.statistics.wordsTrueId.push(currentWordId);
      if (!this.statistics.learnedWords.includes(currentWordId)) {
        this.statistics.learnedWords.push(currentWordId);
      }
      this.counterTrueAnswers += 1;
    } else {
      this.chooseWrongWord(checkboxes);
      this.userChoiseOptional.errorCount = 1;
      if (typeof currentWordId !== 'undefined') {
        this.statistics.wordsFalseId.push(currentWordId);
        if (this.statistics.learnedWords.includes(currentWordId)) {
          const currentWordIndex: number = this.statistics.learnedWords.indexOf(currentWordId);
          this.statistics.learnedWords.splice(currentWordIndex, 1);
        }
      }
      if (this.seriesTrueAnswers < this.counterTrueAnswers) {
        this.seriesTrueAnswers = this.counterTrueAnswers;
        this.counterTrueAnswers = 0;
      }
    }

    if (SprintService.wordCollection[this.index].userWord) {
      const correctCount: number | undefined = SprintService.wordCollection[this.index].userWord?.optional.correctCount;
      const errorCount: number | undefined = SprintService.wordCollection[this.index].userWord?.optional.errorCount;
      if (typeof correctCount !== 'undefined' && typeof errorCount !== 'undefined') {
        this.userChoiseOptional.correctCount += correctCount;
        this.userChoiseOptional.errorCount += errorCount;
      }
      parameters.methodHttp = 'PUT';
    }
    this.index += 1;
    this.updateWordContainer();
    if (this.userId !== '') {
      await this.sprintService.sendUserWord(parameters);
    }
    this.userChoiseOptional = {
      wordId: '',
      correctCount: 0,
      errorCount: 0
    };
  }

  private chooseWrightWord(checkboxes: NodeListOf<Element>) {
    const audioWright: HTMLAudioElement = new Audio('../images/sprint-game/audio/wright.mp3');
    audioWright.play();
    this.counter += 1;
    this.checkboxCount += 1;
    if (this.checkboxCount > 3) {
      this.revokeCheckboxColor(checkboxes);
      this.checkboxCount = 0;
    } else {
      this.paitCheckbox(checkboxes);
    }
    this.changeBonusPrice();
    this.countTotalPoints();
    this.userChoiseOptional.correctCount = 1;
  }

  private chooseWrongWord(checkboxes: NodeListOf<Element>) {
    const audioWrong: HTMLAudioElement = new Audio('../images/sprint-game/audio/wrong.mp3');
    audioWrong.play();
    this.counter = 0;
    this.checkboxCount = 0;
    this.revokeCheckboxColor(checkboxes);
    this.changeBonusPrice();
    this.userChoiseOptional.errorCount = 1;
  }

  private checkIfTranslationRight(): boolean {
    const currentWord: string = this.wordsArr[this.index];
    const currentTranslation: string = this.translationArr[this.index];
    const word: Word[] = SprintService.wordCollection.filter((el) => el.word === currentWord);
    const wordInfo = {
      word: word[0].word,
      audio: word[0].audio,
      transcription: word[0].transcription,
      wordTranslate: word[0].wordTranslate,
      isRight: false
    };
    if (word[0].wordTranslate === currentTranslation && this.pressedBtn === 'btnTrue') {
      wordInfo.isRight = true;
    }
    if (word[0].wordTranslate !== currentTranslation && this.pressedBtn === 'btnFalse') {
      wordInfo.isRight = true;
    }
    this.gameResults.push(wordInfo);
    if (word[0]._id) {
      this.userChoiseOptional.wordId = word[0]._id;
    }
    return wordInfo.isRight;
  }

  private paitCheckbox(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < this.checkboxCount; i++) {
      checkboxes[i].setAttribute(
        'style',
        'background-image: url("../images/sprint-game/svg/circle-check-solid.svg"); background-repeat: no-repeat; bacground-size: cover'
      );
    }
  }

  private revokeCheckboxColor(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].removeAttribute('style');
    }
  }

  private changeBonusPrice(): void {
    const bonus: Element | null = document.querySelector('.bonus');
    if (this.counter === 0) {
      this.price = 10;
      this.showProgress(0);
    }
    if (this.counter === 4) {
      this.price *= 2;
      this.showProgress(2);
    }
    if (this.counter === 8) {
      this.price *= 5;
      this.showProgress(3);
    }
    if (this.counter === 12) {
      this.price *= 10;
      this.showProgress(4);
    }
    if (bonus) bonus.innerHTML = `+${this.price} очков`;
  }

  private showProgress(count: number) {
    const progressItems: NodeListOf<Element> = document.querySelectorAll('.progress-item');
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        progressItems[i].removeAttribute('style');
      }
    } else {
      for (let i = 1; i < 4; i++) {
        progressItems[i].setAttribute('style', 'display: none');
      }
    }
  }

  private countTotalPoints(): void {
    const totalPoints: Element | null = document.querySelector('.total-points');
    this.totalPoints += this.price;
    if (totalPoints) totalPoints.innerHTML = `${this.totalPoints}`;
  }

  // Statistic

  private async updateStatisticPage(wordStatistic: GameResult[], totalPoints: number): Promise<void> {
    console.log(this.statistics.learnedWords);
    const pointsTitle: Element | null = document.querySelector('.total-points-title');
    if (pointsTitle) {
      pointsTitle.innerHTML = `Набрано ${totalPoints} очков.`;
    }
    this.statistics.score = totalPoints;
    this.statistics.seriesTrueAnswers = this.seriesTrueAnswers;

    if (this.userId !== '') {
      SprintController.gameStatistic.optional.statistics.push(this.statistics);
      SprintController.gameStatistic.learnedWords = this.statistics.learnedWords.length;

      await this.sprintService.putStatistics(this.userId, this.token, SprintController.gameStatistic);
    }

    this.generateWrongWordsList(wordStatistic);
    this.generateWrightWordsList(wordStatistic);
    this.addListenetToBtnRestart();
    this.addListenerToBtnLeave();
    this.statistics = {
      gameName: '',
      wordsTrueId: [],
      wordsFalseId: [],
      score: 0,
      seriesTrueAnswers: 0,
      learnedWords: []
    };
  }

  private generateWrongWordsList(wordStatistic: GameResult[]): void {
    const mistakesList: Element | null = document.querySelector('.mistakes-list');
    const mistakesTitle: Element | null = document.querySelector('.mistakes-title span');

    const wrongWords: GameResult[] = wordStatistic.filter((el) => el.isRight === false);
    if (mistakesList && mistakesTitle) {
      mistakesTitle.innerHTML = `${wrongWords.length}`;
      mistakesList.appendChild(this.createItems(wrongWords));
    }
    const soundBtns: NodeListOf<Element> = document.querySelectorAll('.mistakes-list .item-btn');
    this.addListenerToBtnSound(soundBtns, wrongWords);
  }

  private generateWrightWordsList(wordStatistic: GameResult[]): void {
    const correctsList: Element | null = document.querySelector('.correct-list');
    const correctsTitle: Element | null = document.querySelector('.correct-title span');

    const wrightWords: GameResult[] = wordStatistic.filter((el) => el.isRight === true);

    if (correctsList && correctsTitle) {
      correctsTitle.innerHTML = `${wrightWords.length}`;
      correctsList.appendChild(this.createItems(wrightWords));
    }
    const soundBtns: NodeListOf<Element> = document.querySelectorAll('.correct-list .item-btn');
    this.addListenerToBtnSound(soundBtns, wrightWords);
  }

  private createItems(wordsArr: GameResult[]): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    wordsArr.forEach((el) => {
      const item = document.createElement('li');
      item.className = 'items';
      item.innerHTML = `
        <button class="items-elem item-btn"></button>
        <p class="items-elem">${el.word}</p>
        <p class="items-elem">${el.transcription}</p>
        <p class="items-elem">${el.wordTranslate}</p>
      `;
      fragment.appendChild(item);
    });
    return fragment;
  }

  private addListenerToBtnSound(soundBtns: NodeListOf<Element>, wordsArr: GameResult[]): void {
    soundBtns.forEach((el, index) => {
      el.addEventListener('click', () => {
        const audio = new Audio(`https://rslang-leanwords.herokuapp.com/${wordsArr[index].audio}`);
        audio.play();
      });
    });
  }

  private async addListenetToBtnRestart(): Promise<void> {
    const btnRestart: Element | null = document.querySelector('.btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', async () => {
        await this.getWordsCollection();
        this.index = 0;
        this.pressedBtn = '';
        this.counter = 0;
        this.price = 10;
        this.totalPoints = 0;
        this.checkboxCount = 0;
        this.gameResults = [];
        this.wordsArr = [];
        this.translationArr = [];
        this.startGame();
      });
    }
  }
  addListenerToBtnLeave() {
    const btnLeave: Element | null = document.querySelector('.btn-leave');
    if (btnLeave) {
      btnLeave.addEventListener('click', async () => {
        await drawPage(mainView);
      });
    }
  }
}
