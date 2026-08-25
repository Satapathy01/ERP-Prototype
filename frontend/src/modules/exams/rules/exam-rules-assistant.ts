export function formatExamRulesHelp(): string {
  return [
    "I can help you manage examination rules.",
    "",
    "You can ask me things like:",
    "",
    "• What are the current examination rules?",
    "• What is the minimum attendance requirement?",
    "• Is the theory examination compulsory?",
    "• Is the practical examination compulsory?",
    "• What is the certificate fee?",
    "",
    "You can also ask me to change rules, for example:",
    "",
    "• Set attendance requirement to 75%.",
    "• Make theory examination compulsory.",
    "• Make practical examination compulsory.",
    "• Set certificate fee to ₹1000.",
    "• Require 100% payment before examination.",
    "",
    "I will update the examination rules only when you explicitly ask me to change them.",
  ].join("\n");
}