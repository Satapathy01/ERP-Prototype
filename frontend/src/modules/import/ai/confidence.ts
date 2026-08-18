import { AIHeaderSuggestion } from "./types";

export enum ConfidenceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export function getConfidenceLevel(
  confidence: number,
): ConfidenceLevel {
  if (confidence >= 95) {
    return ConfidenceLevel.HIGH;
  }

  if (confidence >= 75) {
    return ConfidenceLevel.MEDIUM;
  }

  return ConfidenceLevel.LOW;
}

export function shouldAutoAccept(
  suggestion: AIHeaderSuggestion,
): boolean {
  return (
    getConfidenceLevel(suggestion.confidence) ===
    ConfidenceLevel.HIGH
  );
}

export function shouldAskUser(
  suggestion: AIHeaderSuggestion,
): boolean {
  return (
    getConfidenceLevel(suggestion.confidence) ===
    ConfidenceLevel.MEDIUM
  );
}

export function shouldReject(
  suggestion: AIHeaderSuggestion,
): boolean {
  return (
    getConfidenceLevel(suggestion.confidence) ===
    ConfidenceLevel.LOW
  );
}