import { examRulesService } from "@/modules/exams/rules/exam-rules.service";

import { NewSessionClient } from "./NewSessionClient";

export default async function NewExaminationSessionPage() {
  const schoolId =
    "1e8bc766-b453-4329-a7b3-b77fc625643a";

  const ruleSets =
    await examRulesService.getAll(
      schoolId,
    );

  const serializedRuleSets =
    ruleSets.map((ruleSet) => ({
      id: ruleSet.id,
      name: ruleSet.name,
      version: ruleSet.version,
      description:
        ruleSet.description,
      isActive: ruleSet.isActive,
    }));

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Create Examination Session
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new examination session
          and select the rules that govern
          the examination.
        </p>
      </div>

      <NewSessionClient
        schoolId={schoolId}
        ruleSets={serializedRuleSets}
      />
    </main>
  );
}