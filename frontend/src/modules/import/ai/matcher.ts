import { ImportField } from "@prisma/client";

import { buildHeaderPrompt } from "./prompt";
import { askOllama } from "./ollama.client";
import { parseAIResponse } from "./parser";
import {
  shouldAutoAccept,
  shouldAskUser,
  shouldReject,
} from "./confidence";

import { AIHeaderSuggestion } from "./types";

export interface HeaderMatchResult {
  success: boolean;

  suggestion?: AIHeaderSuggestion;

  autoAccept: boolean;

  requiresConfirmation: boolean;

  rejected: boolean;

  error?: string;
}

export async function aiMatchHeader(
  header: string,
  availableFields: ImportField[]
): Promise<HeaderMatchResult> {
  try {
    const prompt = buildHeaderPrompt(
      header,
      availableFields
    );

    const response = await askOllama(prompt);

    const suggestion = parseAIResponse(response);

    return {
      success: true,

      suggestion,

      autoAccept: shouldAutoAccept(suggestion),

      requiresConfirmation:
        shouldAskUser(suggestion),

      rejected: shouldReject(suggestion),
    };
  } catch (error) {
    return {
      success: false,

      autoAccept: false,

      requiresConfirmation: false,

      rejected: true,

      error:
        error instanceof Error
          ? error.message
          : "Unknown AI error",
    };
  }
}