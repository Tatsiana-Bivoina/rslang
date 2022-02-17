import { UserChoiseOptional, Word } from './abstracts';

export default class SprintService {
  static wordCollection: Word[] = [];

  async getWords(level: string, page: string): Promise<Word[]> {
    try {
      const response = await fetch(`https://rslang-leanwords.herokuapp.com/words?page=${page}&group=${level}`);
      const words: Word[] = await response.json();
      return words;
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }

  async getAggregatedWords(level: string, page: string, id: string, token: string): Promise<Word[]> {
    const url = `https://rslang-leanwords.herokuapp.com/users/${id}/aggregatedWords?page=${page}&group=${level}`;
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) throw new Error('Access token is missing or invalid');
      const res = await response.json();
      return res[0].paginatedResults;
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
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
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
