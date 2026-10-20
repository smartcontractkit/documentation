import type { FidelityException } from "./check-markdown-fidelity.js"

export const markdownFidelityExceptions: FidelityException[] = [
  {
    path: "ace/guides/policy-manager/manage-policies",
    occurrence: "lang=default;dropped=PolicyInstanceBuilder",
    status: "unsupported",
    reason:
      "Interactive builder intentionally omitted; equivalent information is available elsewhere in the documentation.",
    owner: "documentation maintainers",
    removalCondition: "Remove when the interactive builder has a static Markdown projection.",
  },
]
