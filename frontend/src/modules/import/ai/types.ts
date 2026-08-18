import { ImportField } from "@prisma/client";

export interface AIHeaderRequest {
  header: string;
  availableFields: ImportField[];
}

export interface AIHeaderSuggestion {
  field: ImportField;
  confidence: number;
  reasoning: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  format?: "json";

  options?: {
    temperature?: number;
  };
}

export interface OllamaResponse {
  response: string;
}