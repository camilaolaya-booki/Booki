
export type World = 'CAMINO_LECTOR' | 'LEYENDOPOLIS' | 'CUENTOPIA';

export type ExerciseType = 'ELIGE_LA_PALABRA' | 'HALLA_EL_PROPOSITO' | 'RETO_SORPRESA';

export interface City {
  id: string;
  name: string;
  description: string;
  coordinates: { x: number; y: number };
  color: string;
  legend: string;
}

export interface ReadingText {
  id: string;
  title: string;
  content: string;
  questions: Question[];
  type: ExerciseType;
  cityId: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  feedback?: string;
}

export interface UserState {
  coins: number;
  completedStories: number;
  unlockedWorlds: World[];
  inventory: string[];
  performance: {
    [key in ExerciseType]: number; // Success rate or count
  };
}
