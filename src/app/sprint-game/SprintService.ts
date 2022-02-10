import { Word } from './abstracts';

export default class SprintService {
  async getWords(level: string, page: string): Promise<Word[]> {
    try {
      const response = await fetch(`https://rslang-leanwords.herokuapp.com/words?page=${page}&group=${level}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Something went wrong... ${error}`);
    }
  }
}
