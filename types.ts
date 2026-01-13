
export interface MilitaryPerson {
  id: string;
  name: string;
  saram: string;
  cpf: string;
  rank: string;
  specialty: string;
  lastInspectionDate: string;
  status: 'Pendente' | 'Concluído' | 'Em Avaliação';
  priority: 'Normal' | 'Urgente';
}

export interface InspectionRecord {
  id: string;
  date: string;
  type: string;
  result: string;
  doctor: string;
  location: string;
  observations: string;
  validity: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  PRINT = 'PRINT'
}
