import { Word } from './abstracts';

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
}
