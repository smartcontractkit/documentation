# SideBySideCode Component

A modern, accessible component for displaying code alongside explanatory content. Perfect for documentation, tutorials, and educational content.

## Features

- 🎯 Side-by-side display of code and explanations
- 🔍 Syntax highlighting with Shiki
- 📍 Interactive line highlighting
- 📋 One-click code copying
- 🌐 Load code from local files or URLs
- 📱 Responsive design
- ♿ WCAG AA compliant

## Basic Usage

```mdx
import { SideBySideCode } from "@components"

<SideBySideCode language="solidity" codeSrc="/samples/example.sol" title="Example.sol">
  This is where you put your explanation text. It will appear alongside the code.
</SideBySideCode>
```

## Loading Code

The component supports two methods for loading code:

### 1. Local Files

Place your code files in the `public/samples` directory and reference them with a relative path:

```mdx
<SideBySideCode language="javascript" codeSrc="/samples/example.js" title="Example.js">
  Explanation goes here...
</SideBySideCode>
```

### 2. Remote URLs

Load code directly from any HTTP(S) URL:

```mdx
<SideBySideCode
  language="python"
  codeSrc="https://raw.githubusercontent.com/user/repo/main/example.py"
  title="Example.py"
>
  Explanation goes here...
</SideBySideCode>
```

## Interactive Line Highlighting

Highlight specific lines of code to draw attention to important sections:

```mdx
<SideBySideCode
  language="typescript"
  codeSrc="/samples/example.ts"
  title="Example.ts"
  highlights={[
    {
      lines: [1, 2, 3],
      label: "Imports",
      description: "Import required dependencies",
    },
    {
      lines: [5, 6, 7],
      label: "Configuration",
      description: "Set up the configuration object",
    },
  ]}
>
  The highlights will create interactive cards that, when clicked, will highlight the corresponding lines of code.
</SideBySideCode>
```

## Props Reference

| Prop         | Type        | Required | Description                                                            |
| ------------ | ----------- | -------- | ---------------------------------------------------------------------- |
| `language`   | `string`    | No       | Programming language for syntax highlighting. Defaults to "plaintext". |
| `codeSrc`    | `string`    | Yes      | Path to local file (in public/samples) or HTTP(S) URL.                 |
| `title`      | `string`    | No       | Title displayed in the code header.                                    |
| `highlights` | `Array`     | No       | Array of line highlights (see structure below).                        |
| `children`   | `ReactNode` | No       | Explanatory content to display alongside the code.                     |

### Highlight Structure

```typescript
interface LineHighlight {
  lines: number[] // Array of line numbers to highlight
  label: string // Short label for the highlight
  description: string // Detailed description
}
```

## Supported Languages

The component supports syntax highlighting for:

- JavaScript/TypeScript
- Solidity
- Python
- And many more...

For a complete list, refer to [Shiki's supported languages](https://github.com/shikijs/shiki/blob/main/docs/languages.md).

## Best Practices

1. **Concise Explanations**

   - Keep explanations clear and focused
   - Use bullet points for better readability
   - Highlight only the most important code sections

2. **Responsive Design**

   - Component automatically adjusts for different screen sizes
   - Code and explanation stack vertically on mobile
   - Maintains readability across devices

3. **Accessibility**
   - Use descriptive labels for highlights
   - Ensure good color contrast in explanations
   - Provide meaningful titles for code sections

## Examples

### Basic Example

```mdx
<SideBySideCode language="javascript" codeSrc="/samples/hello.js" title="Hello World">
  A simple hello world example in JavaScript.
</SideBySideCode>
```

### With Highlights

```mdx
<SideBySideCode
  language="solidity"
  codeSrc="/samples/contract.sol"
  title="Smart Contract"
  highlights={[
    {
      lines: [1, 2],
      label: "SPDX License",
      description: "Specify the license for the contract",
    },
  ]}
>
  This smart contract demonstrates basic functionality. Click on the highlight cards to focus on specific sections.
</SideBySideCode>
```

### Loading from URL

```mdx
<SideBySideCode language="python" codeSrc="https://api.example.com/code/script.py" title="Python Script">
  This code is loaded directly from a URL.
</SideBySideCode>
```

## Troubleshooting

1. **Code Not Loading**

   - For local files: Ensure the file exists in `public/samples`
   - For URLs: Verify the URL is accessible and returns raw code
   - Check file permissions and CORS settings

2. **Syntax Highlighting Issues**

   - Verify the language is supported
   - Check the language identifier is correct
   - Ensure code is properly formatted

3. **Layout Problems**
   - Clear any conflicting CSS
   - Ensure parent container allows for proper width
   - Check for proper MDX import syntax

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.
