import { UserData } from '../authorization/storage';
import { GameStatistic, ParametersGetStatistics } from '../sprint-game/abstracts';
import SprintService from '../sprint-game/SprintService';

export default class StatisticController {
  token: string;

  userId: string;

  allLearnedWords: number;

  allGamesStatistic: GameStatistic[];

  sprintGameStatistic: GameStatistic[];

  audiocallGameStatistic: GameStatistic[];

  allWrightWords: string[];

  allWrongWords: string[];

  sprintWrightWords: string[];

  sprintWrongWords: string[];

  audiocallWrightWords: string[];

  audiocallWrongWords: string[];

  sprintLearnedWords: string[];

  audiocallLearnedWords: string[];

  constructor() {
    this.token = '';
    this.userId = '';
    this.allLearnedWords = 0;
    this.allGamesStatistic = [];
    this.sprintGameStatistic = [];
    this.audiocallGameStatistic = [];
    this.allWrightWords = [];
    this.allWrongWords = [];
    this.sprintWrightWords = [];
    this.sprintWrongWords = [];
    this.audiocallWrightWords = [];
    this.audiocallWrongWords = [];
    this.sprintLearnedWords = [];
    this.audiocallLearnedWords = [];
  }

  async getUserData(): Promise<void> {
    const userData = new UserData();
    this.userId = userData.userId;
    if (this.userId !== '') {
      this.token = await userData.getToken();
      await this.getAllStatistic();
    }
  }

  async getAllStatistic(): Promise<void> {
    const sprintService = new SprintService();
    const response: ParametersGetStatistics | undefined = await sprintService.getStatistic(this.userId, this.token);
    if (typeof response !== 'undefined') {
      this.allLearnedWords = response.learnedWords;
      this.allGamesStatistic = await JSON.parse(response.optional.statistics);
      this.allGamesStatistic.forEach((el) => {
        this.allWrightWords.push(...el.wordsTrueId);
        this.allWrongWords.push(...el.wordsFalseId);
        if (el.gameName === 'sprint-game') {
          this.sprintGameStatistic.push(el);
          this.sprintWrightWords.push(...el.wordsTrueId);
          this.sprintWrongWords.push(...el.wordsFalseId);
          this.sprintLearnedWords.push(...el.learnedWords);
        }
        if (el.gameName === 'audioCall') {
          this.audiocallGameStatistic.push(el);
          this.audiocallWrightWords.push(...el.wordsTrueId);
          this.audiocallWrongWords.push(...el.wordsFalseId);
        }
      });
    } else {
      this.updatePage();
    }
  }

  updatePage(): void {
    this.updateDayStatistic();
    this.updateSprintGameStatistic();
    this.updateAudioCallGameStatistic();
  }

  updateDayStatistic() {
    const allGamesCount: Element | null = document.querySelector('.all-games-count');
    const learnedWords: Element | null = document.querySelector('.all-learned-words');
    const percentWrightWords: Element | null = document.querySelector('.all-wright-words');
    const longestSeries: Element | null = document.querySelector('.longest-series');
    const wrightWords: number = this.allWrightWords.length;
    const wrongWords: number = this.allWrongWords.length;

    if (allGamesCount && learnedWords && longestSeries && percentWrightWords) {
      allGamesCount.innerHTML = `${this.allGamesStatistic.length}`;
      if (this.sprintGameStatistic.length !== 0 && this.audiocallGameStatistic.length !== 0) {
        const sprintWords = this.sprintGameStatistic[this.sprintGameStatistic.length - 1].learnedWords.length;
        const audiocallWords = this.audiocallGameStatistic[this.audiocallGameStatistic.length - 1].learnedWords.length;
        learnedWords.innerHTML = `${sprintWords + audiocallWords}`;
      }
      learnedWords.innerHTML = `${this.allLearnedWords}`;
      if (wrightWords !== 0 && wrongWords !== 0) {
        percentWrightWords.innerHTML = `${Math.round(this.countPercentWrightWords(wrightWords, wrongWords))}%`;
      }
      longestSeries.innerHTML = `${this.countLongestSeries(this.allGamesStatistic)}`;
    }
  }

  updateSprintGameStatistic() {
    const allGamesCount: Element | null = document.querySelector('.srint-game-count');
    const learnedWords: Element | null = document.querySelector('.sprint-learned-words');
    const percentWrightWords: Element | null = document.querySelector('.sprint-wright-words');
    const longestSeries: Element | null = document.querySelector('.sprint-longest-series');
    const wrightWords: number = this.sprintWrightWords.length;
    const wrongWords: number = this.sprintWrongWords.length;

    if (allGamesCount && learnedWords && longestSeries && percentWrightWords) {
      allGamesCount.innerHTML = `${this.sprintGameStatistic.length}`;
      if (this.sprintGameStatistic.length !== 0) {
        const words = this.sprintGameStatistic[this.sprintGameStatistic.length - 1].learnedWords.length;
        learnedWords.innerHTML = `${words}`;
      }
      if (wrightWords !== 0 && wrongWords !== 0) {
        percentWrightWords.innerHTML = `${Math.round(this.countPercentWrightWords(wrightWords, wrongWords))}%`;
      }
      longestSeries.innerHTML = `${this.countLongestSeries(this.sprintGameStatistic)}`;
    }
  }

  updateAudioCallGameStatistic() {
    const allGamesCount: Element | null = document.querySelector('.audiocall-game-count');
    const learnedWords: Element | null = document.querySelector('.audiocall-learned-words');
    const percentWrightWords: Element | null = document.querySelector('.audiocall-wright-words');
    const longestSeries: Element | null = document.querySelector('.audiocall-longest-series');
    const wrightWords: number = this.audiocallWrightWords.length;
    const wrongWords: number = this.audiocallWrongWords.length;

    if (allGamesCount && learnedWords && longestSeries && percentWrightWords) {
      allGamesCount.innerHTML = `${this.audiocallGameStatistic.length}`;
      if (this.audiocallGameStatistic.length !== 0) {
        const words = this.audiocallGameStatistic[this.audiocallGameStatistic.length - 1].learnedWords.length;
        learnedWords.innerHTML = `${words}`;
      }
      learnedWords.innerHTML = `${this.countLearnedWords(this.audiocallLearnedWords)}`;
      if (wrightWords !== 0 && wrongWords !== 0) {
        percentWrightWords.innerHTML = `${Math.round(this.countPercentWrightWords(wrightWords, wrongWords))}%`;
      }
      longestSeries.innerHTML = `${this.countLongestSeries(this.audiocallGameStatistic)}`;
    }
  }

  countLongestSeries(arr: GameStatistic[]): number | undefined {
    if (arr.length !== 0) {
      arr.sort((a, b) => b.seriesTrueAnswers - a.seriesTrueAnswers);
      return arr[0].seriesTrueAnswers;
    }
    return 0;
  }

  countPercentWrightWords(wrightWords: number, wrongWords: number): number {
    const allWordsCount: number = wrightWords + wrongWords;
    let percent = 0;
    percent = wrightWords / (allWordsCount / 100);
    return percent;
  }

  countLearnedWords(arr: string[]): number {
    const array: string[] = [];
    arr.forEach((el) => {
      if (!array.includes(el)) {
        array.push(el);
      }
    });
    return array.length;
  }
}
