"use client";

import { useState } from "react";
import {
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

interface RuleAssistantResponse {
  success: boolean;

  // Short API status/message
  message?: string;

  // Human-readable formatted response
  answer?: string;

  // Updated rules, when a rule was changed
  rules?: Record<string, unknown>;

  // Optional metadata returned by the API
  type?: string;
}

export function RuleAssistant() {
  const [message, setMessage] =
    useState("");

  const [submittedMessage, setSubmittedMessage] =
    useState("");

  const [response, setResponse] =
    useState<RuleAssistantResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  async function submit() {
    const text = message.trim();

    if (!text || loading) return;

    setLoading(true);
    setResponse(null);
    setSubmittedMessage(text);

    try {
      const res = await fetch(
        "/api/admin/rules/ai",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        },
      );

      let data: RuleAssistantResponse;

      try {
        data =
          (await res.json()) as RuleAssistantResponse;
      } catch {
        throw new Error(
          "The rule assistant returned an invalid response.",
        );
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Rule assistant request failed.",
        );
      }

      setResponse(data);

      if (data.success) {
        setMessage("");
      }
    } catch (error) {
      setResponse({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the rule assistant.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void submit();
    }
  }

  /*
   * Prefer the formatted answer returned by
   * the backend.
   *
   * Fall back to message for older API
   * responses or error responses.
   */
  function getAssistantAnswer() {
    if (response?.answer?.trim()) {
      return response.answer;
    }

    if (response?.message?.trim()) {
      return response.message;
    }

    return "The rule assistant completed the request, but no response text was returned.";
  }

  return (
    <div className="min-h-150 rounded-2xl border bg-white shadow-sm">
      <div className="flex min-h-150 flex-col">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Rule Assistant
              </h2>

              <p className="text-sm text-muted-foreground">
                Powered by Qwen 3:8B
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Conversation                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex-1 overflow-y-auto p-6">
          {!response && !loading && (
            <div className="flex min-h-100 items-center justify-center">
              <div className="max-w-2xl text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Hello Admin, Let&apos;s change Rules
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Tell me how you want the
                  examination rules to work. I
                  will convert your instruction
                  into an examination rule.
                </p>

                <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
                  <Suggestion
                    text="Make theory and practical compulsory."
                    onClick={() =>
                      setMessage(
                        "Make theory and practical compulsory.",
                      )
                    }
                  />

                  <Suggestion
                    text="Set certificate fee to ₹500."
                    onClick={() =>
                      setMessage(
                        "Set certificate fee to ₹500.",
                      )
                    }
                  />

                  <Suggestion
                    text="Require 75% attendance."
                    onClick={() =>
                      setMessage(
                        "Require 75% attendance.",
                      )
                    }
                  />

                  <Suggestion
                    text="Students must complete 100% of their fees."
                    onClick={() =>
                      setMessage(
                        "Students must complete 100% of their fees.",
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex min-h-100 items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />

                <span>
                  Rule Assistant is thinking...
                </span>
              </div>
            </div>
          )}

          {response && (
            <div className="mx-auto max-w-3xl space-y-6">
              {/* ---------------------------------------------------------- */}
              {/* User message                                               */}
              {/* ---------------------------------------------------------- */}

              <div className="rounded-2xl border bg-muted/30 p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  You
                </p>

                <p className="mt-2 whitespace-pre-wrap">
                  {submittedMessage}
                </p>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Assistant answer                                            */}
              {/* ---------------------------------------------------------- */}

              <div
                className={`rounded-2xl border p-5 ${
                  response.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />

                  <p className="font-medium">
                    Rule Assistant
                  </p>
                </div>

                <div className="mt-4 whitespace-pre-wrap text-sm leading-6">
                  {getAssistantAnswer()}
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Updated rule JSON                                           */}
              {/* ---------------------------------------------------------- */}

              {response.rules && (
                <div className="rounded-2xl border bg-white p-5">
                  <p className="font-medium">
                    Updated Rule Set
                  </p>

                  <pre className="mt-4 max-h-125 overflow-auto rounded-lg bg-zinc-950 p-4 text-sm text-white">
                    {JSON.stringify(
                      response.rules,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Input                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="border-t p-4">
          <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-white p-2 shadow-sm">
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about examination rules..."
              rows={1}
              disabled={loading}
              className="max-h-32 min-h-12 flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm outline-none"
            />

            <button
              type="button"
              onClick={() => void submit()}
              disabled={
                loading || !message.trim()
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send · Shift + Enter
            for a new line
          </p>
        </div>
      </div>
    </div>
  );
}

function Suggestion({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border p-4 text-left text-sm transition hover:bg-muted"
    >
      {text}
    </button>
  );
}