import { UserChoiseOptional, Word } from './abstracts';

export default class SprintService {
  static wordCollection: Word[] = [];

  async getWords(level: string, page: string): Promise<void> {
    try {
      const response = await fetch(`https://rslang-leanwords.herokuapp.com/words?page=${page}&group=${level}`);
      SprintService.wordCollection = await response.json();
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }

  async getAggregatedWords(level: string, page: string, id: string, token: string): Promise<void> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${id}/aggregatedWords?page=${page}&group=${level}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) throw new Error('Access token is missing or invalid');
      SprintService.wordCollection = await response.json();
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }

  async postUserWord(id: string, wordId: string, token: string, optional: UserChoiseOptional): Promise<void> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${id}/words/${wordId}`;
    const data = {
      difficulty: 'work',
      optional: {
        correctCount: optional.correctCount,
        errorCount: optional.errorCount
      }
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.status === 400) throw new Error('Bad request');
      if (response.status === 401) throw new Error('Access token is missing or invalid');
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }
}
