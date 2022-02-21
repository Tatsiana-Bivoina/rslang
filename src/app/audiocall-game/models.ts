export interface Word {
  id: string;
  _id?: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord: {
    optional: {
      correctCount: number;
      errorCount: number;
    };
  };
}

export interface userWord {
  difficulty: string;
  optional: {
    testFieldString: string;
    testFieldBoolean: boolean;
    wordId: string;
    correctCount: number;
    errorCount: number;
  };
}
