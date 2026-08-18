export interface FeeSchedule {
  id: string;
  title: string;
  amount: number;
  dueOrder: number;
  isMandatory: boolean;
  isActive: boolean;
}

export interface FeeSchedule {
  id: string;
  title: string;
  amount: number;
  dueOrder: number;
  isMandatory: boolean;
  isActive: boolean;
}

export interface AdmissionSearchResult {
  id: string;

  student: {
    id: string;
    name: string;
    registrationNumber: string;
    photoUrl?: string | null;
  };

  course: {
    id: string;
    code: string;
    name: string;

    durationMonths: number;
    installmentCount: number;

    admissionFee: number;
    monthlyFee: number;
    certificateFee: number;
    totalFee: number;

    feeSchedules: FeeSchedule[];
  };

  batch: {
    id: string;
    name: string;

    startTime: string | null;
    endTime: string | null;

    teacher: {
      id: string;
      name: string;
    } | null;
  } | null;
}