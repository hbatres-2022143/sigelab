export type LoanStatus = 'ACTIVO' | 'FINALIZADO';

export type Loan = {
  id: number;
  number: number;
  applicant: string;
  identification: string;
  loanDate: string;
  returnBefore: string;
  status: LoanStatus;
  registeredBy: string;
  observations: string;
  equipmentCount: number;
  returnedCount: number;
  pendingCount: number;
  overdue: boolean;
};

export type LoanDetail = {
  id: number;
  loanNumber: number;
  equipmentCode: string;
  equipment: string;
  situation: 'Devuelto' | 'Pendiente';
  returnDate: string | null;
  condition: 'BUENO' | 'REGULAR' | 'MALO' | null;
  observation: string;
  receivedBy: string;
};

export type LoanReturn = {
  id: number;
  loanNumber: number;
  equipmentCode: string;
  equipment: string;
  returnDate: string;
  condition: 'BUENO' | 'REGULAR' | 'MALO';
  observation: string;
  receivedBy: string;
};

export const loans: Loan[] = [
  {
    id: 1,
    number: 1,
    applicant: 'Kevin',
    identification: '12345678',
    loanDate: '17/10/2026 00:25',
    returnBefore: '18/10/2026 00:24',
    status: 'FINALIZADO',
    registeredBy: 'Ana Administradora',
    observations: 'Bien',
    equipmentCount: 1,
    returnedCount: 1,
    pendingCount: 0,
    overdue: false,
  },
  {
    id: 2,
    number: 2,
    applicant: 'Kevin',
    identification: '12345',
    loanDate: '17/10/2026 11:31',
    returnBefore: '18/10/2026 11:30',
    status: 'ACTIVO',
    registeredBy: 'Ana Administradora',
    observations: '',
    equipmentCount: 1,
    returnedCount: 0,
    pendingCount: 1,
    overdue: true,
  },
];

export const loanDetails: LoanDetail[] = [
  {
    id: 1,
    loanNumber: 1,
    equipmentCode: 'CAM-002',
    equipment: 'Cámara web',
    situation: 'Devuelto',
    returnDate: '17/10/2026 00:26',
    condition: 'BUENO',
    observation: 'Ninguna',
    receivedBy: 'Ana Administradora',
  },
  {
    id: 2,
    loanNumber: 2,
    equipmentCode: 'LAP-002',
    equipment: 'Laptop de préstamo 2',
    situation: 'Pendiente',
    returnDate: null,
    condition: null,
    observation: '',
    receivedBy: '',
  },
];

export const loanReturns: LoanReturn[] = [
  {
    id: 1,
    loanNumber: 1,
    equipmentCode: 'CAM-002',
    equipment: 'Cámara web',
    returnDate: '17/10/2026 00:26',
    condition: 'BUENO',
    observation: '',
    receivedBy: '',
  },
];
