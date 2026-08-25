export interface ExamRules {
  payment: {
    required: boolean;
    minimumCompletionPercentage: number;
  };

  attendance: {
    required: boolean;
    minimumPercentage: number;
    scope: "EVERY_COURSE" | "OVERALL";
  };

  theory: {
    required: boolean;
    mustPass: boolean;
  };

  practical: {
    required: boolean;
    mustPass: boolean;
  };

  certificate: {
    required: boolean;
    fee: number;
  };
}

export const DEFAULT_EXAM_RULES: ExamRules = {
  payment: {
    required: true,
    minimumCompletionPercentage: 100,
  },

  attendance: {
    required: true,
    minimumPercentage: 20,
    scope: "EVERY_COURSE",
  },

  theory: {
    required: true,
    mustPass: true,
  },

  practical: {
    required: true,
    mustPass: true,
  },

  certificate: {
    required: true,
    fee: 500,
  },
};