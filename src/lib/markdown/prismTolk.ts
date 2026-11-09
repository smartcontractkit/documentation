import Prism from "prismjs"

/** Register Tolk on the same Prism instance used by Astro's highlighter. */
export function registerPrismTolk(): void {
  if (Prism.languages.tolk) return

  // Reuse C-like comments, strings, booleans, functions and punctuation.
  Prism.languages.tolk = Prism.languages.extend("clike", {
    keyword:
      /\b(?:asm|assert|break|catch|const|continue|contract|do|else|enum|fun|get|global|if|import|is|lazy|match|mutate|null|private|readonly|repeat|return|self|struct|throw|tolk|try|type|val|var|while)\b/,
    "class-name": {
      // Struct declarations may include an opcode before the type name.
      pattern: /(\b(?:struct|enum|contract|type)\s+(?:\([^\r\n)]*\)\s*)?)[A-Za-z_]\w*/,
      lookbehind: true,
    },
    number: /\b(?:0x[\da-fA-F](?:_?[\da-fA-F])*|0b[01](?:_?[01])*|\d(?:_?\d)*)\b/,
    operator: /=>|<<=?|>>=?|[!=<>]=?|&&?|\|\|?|[-+*/%~^]=?|[?:]/,
    builtin: /\b(?:u?int\d*|bits\d+|bytes\d+|bool|cell|slice|builder|address|coins|tuple|void|never|auto|map|array)\b/,
  })

  Prism.languages.insertBefore("tolk", "keyword", {
    annotation: { pattern: /@[A-Za-z_]\w*/, alias: "function" },
  })
}

/** Remark runs before Astro's Prism highlighting for both Markdown and MDX. */
export default function remarkPrismTolk(): void {
  registerPrismTolk()
}
