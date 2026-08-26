import { RuleAssistant } from "./RuleAssistant";

export default function RulesPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-orange-500">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Examination Rules
        </h1>

        <p className="mt-2 text-muted-foreground">
          Configure examination rules using natural language.
        </p>
      </div>

      <RuleAssistant />
    </main>
  );
}
