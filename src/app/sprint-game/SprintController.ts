import { Word, WordStatistic } from './abstracts';
import SprintService from './SprintService';
import SprintView from './SprintView';

export default class SprintController {
  sprintService: SprintService;

  sprintView: SprintView;

  rand: number;

  allWords: Word[];

  wordsArr: string[];

  translationArr: string[];

  wordStatistic: WordStatistic[];

  index: number;

  counter: number;

  pressedBtn: string;

  price: number;

  totalPoints: number;

  checkboxCount: number;

  constructor() {
    this.sprintService = new SprintService();
    this.sprintView = new SprintView();
    this.rand = 0;
    this.allWords = [];
    this.wordsArr = [];
    this.translationArr = [];
    this.wordStatistic = [];
    this.index = 0;
    this.pressedBtn = '';
    this.counter = 0;
    this.price = 10;
    this.totalPoints = 0;
    this.checkboxCount = 0;
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
        btnStart?.removeAttribute('disabled');
        if (btnStart) this.addActiveClass(btn, btnStart);
        const level: string = (Number(btn.textContent) - 1).toString();
        const page: string = Math.floor(this.getRandomNumber()).toString();
        const res: Word[] = await this.sprintService.getWords(level, page);
        localStorage.setItem('words', JSON.stringify(res));
      }
      if (btn.classList.contains('btn-start')) {
        this.sprintView.sprintGameView();
        this.createWordsArr();
        this.addListenerToBtnTrue();
        this.addListenerToBtnFalse();
        this.updateWordContainer();
        this.startTimer();
      }
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

  private startTimer(): void {
    const secondsBlock: HTMLElement | null = document.querySelector('.seconds');
    const countdownNumber: HTMLElement | null = document.querySelector('.countdown-number');
    const num: HTMLElement | null = document.querySelector('.countdown-number span');
    let seconds = 60;

    const intervalId = setInterval(() => {
      if (secondsBlock && countdownNumber && num) {
        secondsBlock.innerHTML = `${seconds}`;
        if (seconds === 10) {
          countdownNumber.setAttribute('style', 'border-color: #fa0303');
          num.setAttribute('style', 'color: #fa0303');
        }
      }
      seconds -= 1;
      if (seconds < 0) clearInterval(intervalId);
    }, 1000);
  }

  private generateRandomIndexes(): number[] {
    const randomIndex: number[] = [];
    for (let i = 0; i < 9; i++) {
      const randEl = Math.round(Math.random() * 19);
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
    const data: string | null = localStorage.getItem('words');
    if (data) {
      this.allWords = JSON.parse(data);
      this.allWords.forEach((el) => {
        this.wordsArr.push(el.word);
        this.translationArr.push(el.wordTranslate);
      });
      this.getRandomTranslations();
    }
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

  private addListenerToBtnFalse(): void {
    const btnFalse: Element | null = document.querySelector('.btn-false');
    btnFalse?.addEventListener('click', () => {
      this.pressedBtn = 'btnFalse';
      this.nextWord();
    });
  }

  private nextWord(): void {
    const isRight: boolean = this.checkIfTranslationRight();
    const checkboxes: NodeListOf<Element> = document.querySelectorAll('.checkbox');
    if (isRight) {
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
    } else {
      this.counter = 0;
      this.checkboxCount = 0;
      this.revokeCheckboxColor(checkboxes);
      this.changeBonusPrice();
    }
    this.index += 1;
    this.updateWordContainer();
  }

  private checkIfTranslationRight(): boolean {
    const currentWord: string = this.wordsArr[this.index];
    const currentTranslation: string = this.translationArr[this.index];
    const word: Word[] = this.allWords.filter((el) => el.word === currentWord);
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
    this.wordStatistic.push(wordInfo);
    return wordInfo.isRight;
  }

  private paitCheckbox(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < this.checkboxCount; i++) {
      checkboxes[i].setAttribute('style', 'background-color: #008000');
    }
  }

  private revokeCheckboxColor(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].removeAttribute('style');
    }
  }

  private changeBonusPrice(): void {
    const bonus: Element | null = document.querySelector('.bonus');
    if (this.counter === 0) this.price = 10;
    if (this.counter === 4) {
      this.price *= 2;
    }
    if (this.counter === 7) {
      this.price *= 5;
    }
    if (this.counter === 10) {
      this.price *= 10;
    }
    if (bonus) bonus.innerHTML = `+${this.price} очков`;
  }

  private countTotalPoints(): void {
    const totalPoints: Element | null = document.querySelector('.total-points');
    this.totalPoints = this.price * this.counter;
    if (totalPoints) totalPoints.innerHTML = `${this.totalPoints}`;
  }
}
