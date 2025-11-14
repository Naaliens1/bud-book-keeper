export interface Genetic {
  id: string;
  name: string;
  bank: string;
  family: string;
  thc: string;
  flowering: string;
  yield: string;
  flavor: string;
  aroma: string;
  cbd: string;
  height: string;
  heightInterior?: string;
  heightExterior?: string;
  indoorProduction: string;
  outdoorProduction: string;
  harvestTime?: string;
  parentage: string;
  breedingGoals: string;
  history: string;
  image: string;
  inCultivation?: boolean;
}

export interface LogEntry {
  id: string;
  geneticId: string;
  date: string;
  stage: 'germination' | 'vegetative' | 'flowering' | 'harvest';
  observations: string;
  height?: number;
  ph?: number;
  ec?: number;
  temperature?: number;
}

export interface CultivationSession {
  geneticId: string;
  startDate: string;
  endDate?: string;
  finalYield?: number;
  notes: string;
}
