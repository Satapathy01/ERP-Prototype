import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyToken } from "@/modules/auth/jwt";

import {
  examRulesService,
} from "@/modules/exams/rules/exam-rules.service";

import {
  DEFAULT_EXAM_RULES,
  type ExamRules,
} from "@/modules/exams/rules/exam-rules";

import {
  formatExamRulesResponse,
  formatExamRulesHelp,
} from "@/modules/exams/rules/exam-rules.response";

/* -------------------------------------------------------------------------- */
/*                              Request Schema                                */
/* -------------------------------------------------------------------------- */

const requestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(2000, "Message is too long."),
});

/* -------------------------------------------------------------------------- */
/*                              JSON Extraction                               */
/* -------------------------------------------------------------------------- */

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error(
      "Qwen did not return a valid rule object.",
    );
  }

  try {
    return JSON.parse(
      cleaned.slice(first, last + 1),
    );
  } catch {
    throw new Error(
      "Qwen returned invalid JSON.",
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                              Rule Merging                                  */
/* -------------------------------------------------------------------------- */

function mergeRules(
  current: ExamRules,
  changes: ExamRules,
): ExamRules {
  return {
    payment: {
      ...current.payment,
      ...changes.payment,
    },

    attendance: {
      ...current.attendance,
      ...changes.attendance,
    },

    theory: {
      ...current.theory,
      ...changes.theory,
    },

    practical: {
      ...current.practical,
      ...changes.practical,
    },

    certificate: {
      ...current.certificate,
      ...changes.certificate,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                              Authentication                                */
/* -------------------------------------------------------------------------- */

async function getAuth(
  request: NextRequest,
) {
  const token =
    request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload =
    await verifyToken(token);

  if (!payload?.schoolId) {
    throw new Error(
      "School ID is missing from authentication token.",
    );
  }

  if (!payload?.userId) {
    throw new Error(
      "User ID is missing from authentication token.",
    );
  }

  return {
    schoolId: payload.schoolId,
    userId: payload.userId,
  };
}

function isHelpRequest(
  message: string,
): boolean {
  const normalized =
    message
      .toLowerCase()
      .trim();

  const helpPatterns = [
    "what can you do",
    "what can u do",
    "what do you do",
    "how can you help",
    "what can you help me with",
    "what are your capabilities",
    "what can i ask",
    "how does this work",
    "help",
  ];

  return helpPatterns.some(
    (pattern) =>
      normalized === pattern ||
      normalized.includes(pattern),
  );
}

function isRuleReadRequest(
  message: string,
): boolean {
  const normalized =
    message
      .toLowerCase()
      .trim()
      .replace(/[?!.]+$/g, "");

  const readPatterns = [
    "what are the current examination rules",
    "what are the current exam rules",
    "what are the current rules",
    "what are the examination rules",
    "what are the exam rules",
    "what are the rules",

    "show me the current examination rules",
    "show me the current exam rules",
    "show me the current rules",
    "show current examination rules",
    "show current exam rules",
    "show current rules",

    "tell me the current examination rules",
    "tell me the current exam rules",
    "tell me the current rules",
    "tell me the examination rules",
    "tell me the exam rules",

    "what is the current attendance requirement",
    "what is the attendance requirement",
    "what is the minimum attendance",
    "how much attendance is required",
    "is attendance required",

    "what is the payment requirement",
    "what is the minimum payment",
    "how much payment is required",

    "is theory examination required",
    "is theory examination compulsory",
    "is theory compulsory",

    "is practical examination required",
    "is practical examination compulsory",
    "is practical compulsory",

    "what is the certificate fee",
    "how much is the certificate fee",
  ];

  return readPatterns.some(
    (pattern) =>
      normalized === pattern ||
      normalized.includes(pattern),
  );
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: NextRequest,
) {
  try {
    /* ---------------------------------------------------------------------- */
    /* Authentication                                                         */
    /* ---------------------------------------------------------------------- */

    const {
      schoolId,
      userId,
    } = await getAuth(request);

    /* ---------------------------------------------------------------------- */
    /* Validate Request                                                       */
    /* ---------------------------------------------------------------------- */

    const body =
      await request.json();

    const parsed =
      requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Invalid request.",
        },
        {
          status: 400,
        },
      );
    }

    const userMessage =
      parsed.data.message;
    if (isHelpRequest(userMessage)) {
    return NextResponse.json({
    success: true,
    type: "help",
    answer: formatExamRulesHelp(),
    });
    }
    /* ---------------------------------------------------------------------- */
    /* Get Current Active Rule Set                                            */
    /* ---------------------------------------------------------------------- */

    const activeRuleSet =
      await examRulesService.getActive(
        schoolId,
      );

    const currentRules: ExamRules =
      activeRuleSet
        ? examRulesService.validateRules(
            activeRuleSet.rules,
          )
        : DEFAULT_EXAM_RULES;
    
    /* ---------------------------------------------------------------------- */
/* Read Current Rules                                                     */
/* ---------------------------------------------------------------------- */

if (isRuleReadRequest(userMessage)) {
  const answer =
    formatExamRulesResponse(
      currentRules,
    );

  return NextResponse.json({
    success: true,

    type: "rule-read",

    message:
      "Current examination rules.",

    answer,

    rules: currentRules,

    ruleSet: activeRuleSet
      ? {
          id:
            activeRuleSet.id,

          name:
            activeRuleSet.name,

          version:
            activeRuleSet.version,

          isActive:
            activeRuleSet.isActive,
        }
      : null,
  });
}

    /* ---------------------------------------------------------------------- */
    /* Ask Qwen                                                               */
    /* ---------------------------------------------------------------------- */

    const prompt = `
You are the Examination Rules Assistant
for a School ERP.

The administrator wants to modify the
examination rules.

Your task is to interpret the administrator's
request and update ONLY the rules that the
administrator explicitly asks to change.

You MUST return the COMPLETE examination
rules object.

Do not return markdown.
Do not return explanations.
Return ONLY valid JSON.

The JSON must contain exactly these sections:

{
  "payment": {
    "required": boolean,
    "minimumCompletionPercentage": number
  },

  "attendance": {
    "required": boolean,
    "minimumPercentage": number,
    "scope": "EVERY_COURSE" | "OVERALL"
  },

  "theory": {
    "required": boolean,
    "mustPass": boolean
  },

  "practical": {
    "required": boolean,
    "mustPass": boolean
  },

  "certificate": {
    "required": boolean,
    "fee": number
  }
}

CURRENT RULES:

${JSON.stringify(
  currentRules,
  null,
  2,
)}

ADMINISTRATOR REQUEST:

${userMessage}

IMPORTANT:

1. Understand the administrator's request.
2. Change only the requested rule values.
3. Preserve every other existing rule.
4. Always return the COMPLETE rules object.
5. Numbers must be JSON numbers, not strings.
6. Boolean values must be true or false.
7. "EVERY_COURSE" and "OVERALL" are the only valid attendance scopes.

Return ONLY the updated JSON object.
`;

    const ollamaUrl =
      process.env.OLLAMA_URL ??
      "http://localhost:11434";

    const ollamaModel =
      process.env.OLLAMA_MODEL ??
      "qwen3:8b";

    const ollamaResponse =
      await fetch(
        `${ollamaUrl}/api/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: ollamaModel,

            prompt,

            stream: false,

            format: "json",
          }),
        },
      );

    if (!ollamaResponse.ok) {
      throw new Error(
        `Qwen request failed with status ${ollamaResponse.status}.`,
      );
    }

    const aiData =
      await ollamaResponse.json();

    if (
      typeof aiData.response !==
      "string"
    ) {
      throw new Error(
        "Invalid response from Qwen.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Parse Qwen Response                                                    */
    /* ---------------------------------------------------------------------- */

    const aiRules =
      extractJson(
        aiData.response,
      );

    /* ---------------------------------------------------------------------- */
    /* Validate AI Output                                                     */
    /* ---------------------------------------------------------------------- */

    const validatedRules =
      examRulesService.validateRules(
        aiRules,
      );

    /* ---------------------------------------------------------------------- */
    /* Merge With Current Rules                                               */
    /* ---------------------------------------------------------------------- */

    const updatedRules =
      mergeRules(
        currentRules,
        validatedRules,
      );

    /* ---------------------------------------------------------------------- */
    /* Validate Final Rules                                                   */
    /* ---------------------------------------------------------------------- */

    const finalRules =
      examRulesService.validateRules(
        updatedRules,
      );

    /* ---------------------------------------------------------------------- */
    /* Save New Version                                                       */
    /* ---------------------------------------------------------------------- */

    let ruleSet;

    if (activeRuleSet) {
      /*
       * Existing rule set.
       *
       * Example:
       *
       * v1 -> historical
       * v2 -> historical
       * v3 -> new active version
       */

      ruleSet =
        await examRulesService.createVersion(
          activeRuleSet.id,
          finalRules,
          userId,
        );
    } else {
      /*
       * First rule set for this school.
       */

      ruleSet =
        await examRulesService.create({
          schoolId,

          name:
            "Standard Examination Rules",

          description:
            "Examination rules managed through the AI Rule Assistant.",

          rules: finalRules,

          createdBy: userId,
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Activate New Version                                                   */
    /* ---------------------------------------------------------------------- */

    const activatedRuleSet =
  await examRulesService.activate(
    ruleSet.id,
  );
    /* ---------------------------------------------------------------------- */
    /* Response                                                               */
    /* ---------------------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      message:
        "Examination rules updated successfully.",

      rules:
        activatedRuleSet.rules,

      ruleSet: {
        id:
          activatedRuleSet.id,

        name:
          activatedRuleSet.name,

        version:
          activatedRuleSet.version,

        isActive:
          activatedRuleSet.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Examination Rule AI Error:",
      error,
    );

    /* ---------------------------------------------------------------------- */
    /* Unauthorized                                                           */
    /* ---------------------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message ===
        "Unauthorized"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* General Error                                                          */
    /* ---------------------------------------------------------------------- */

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update examination rules.",
      },
      {
        status: 500,
      },
    );
  }
}