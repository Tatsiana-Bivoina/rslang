export type Word = {
  id?: string;
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
  userWord?: { difficulty: string; optional: UserChoiseOptional };
};

export type GameResult = {
  word: string;
  audio: string;
  transcription: string;
  wordTranslate: string;
  isRight: boolean;
};

export type UserChoiseOptional = {
  wordId: string;
  correctCount: number;
  errorCount: number;
};

export type GameStatistic = {
  gameName: string;
  wordsTrueId: string[];
  wordsFalseId: string[];
  score: number;
};

export type ParametersSendWord = {
  userId: string;
  wordId: string;
  token: string;
  optional: UserChoiseOptional;
  methodHttp: string;
};
