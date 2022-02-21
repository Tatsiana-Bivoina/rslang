import { ParametersSendWord, ParametersPutStatistics, ParametersGetStatistics, Word } from './abstracts';

export default class SprintService {
  static wordCollection: Word[] = [];

  async getWords(level: string, page: string): Promise<Word[]> {
    try {
      const response = await fetch(`
      https://rslang-leanwords.herokuapp.com/words?page=${page}&group=${level}&wordsPerPage=20`);
      const words: Word[] = await response.json();
      return words;
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }

  async getAggregatedWords(level: string, page: string, id: string, token: string): Promise<Word[]> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${id}/aggregatedWords?page=${page}&group=${level}&wordsPerPage=20`;
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      this.handleErrors(response);
      const res = await response.json();
      return res[0].paginatedResults;
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }

  async sendUserWord(parameters: ParametersSendWord): Promise<void> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${parameters.userId}/words/${parameters.wordId}`;
    const data = {
      difficulty: 'easy',
      optional: {
        id: parameters.wordId,
        correctCount: parameters.optional.correctCount,
        errorCount: parameters.optional.errorCount
      }
    };
    try {
      const response = await fetch(url, {
        method: parameters.methodHttp,
        headers: {
          Authorization: `Bearer ${parameters.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      this.handleErrors(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async getStatistic(userId: string, token: string): Promise<ParametersGetStatistics | undefined> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${userId}/statistics`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      this.handleErrors(response);
      const res: ParametersGetStatistics | undefined = await response.json();
      return res;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async putStatistics(userId: string, token: string, gameStatistic: ParametersPutStatistics): Promise<void> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${userId}/statistics`;
    const data: ParametersPutStatistics = {
      learnedWords: gameStatistic.learnedWords,
      optional: gameStatistic.optional
    };
    const requestData = {
      learnedWords: data.learnedWords,
      optional: {
        statistics: JSON.stringify(data.optional.statistics)
      }
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': '145'
        },
        body: JSON.stringify(requestData)
      });
      this.handleErrors(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  handleErrors(response: Response): void {
    if (response.status === 400) throw new Error('Bad request');
    if (response.status === 401) throw new Error('Access token is missing or invalid');
    if (response.status === 404) throw new Error('Statistics not found');
  }
}
