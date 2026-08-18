import {
  OllamaRequest,
  OllamaResponse,
} from "./types";

const OLLAMA_URL =
  process.env.OLLAMA_URL ??
  "http://localhost:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ??
  "qwen3:8b";

const REQUEST_TIMEOUT = Number(
  process.env.OLLAMA_TIMEOUT ?? "30000",
);

export class OllamaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OllamaError";
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller =
    new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new OllamaError(
        `Ollama request timed out after ${timeout}ms.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function askOllama(
  prompt: string,
): Promise<string> {
  const payload: OllamaRequest = {
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
    format: "json",
  };

  const response =
    await fetchWithTimeout(
      `${OLLAMA_URL}/api/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      },
      REQUEST_TIMEOUT,
    );

  if (!response.ok) {
    const errorText =
      await response.text().catch(
        () => "",
      );

    throw new OllamaError(
      `Ollama returned ${response.status}${
        errorText
          ? `: ${errorText}`
          : ""
      }`,
    );
  }

  let json: OllamaResponse;

  try {
    json =
      (await response.json()) as OllamaResponse;
  } catch {
    throw new OllamaError(
      "Ollama returned invalid JSON.",
    );
  }

  if (
    !json.response ||
    typeof json.response !== "string"
  ) {
    throw new OllamaError(
      "Empty response from Ollama.",
    );
  }

  return json.response.trim();
}