import { useState, useCallback } from "react"
import styles from "./PolicyInstanceBuilder.module.css"
import policyData from "../../../data/ace-policy-implementations.json" with { type: "json" }

interface ConfigField {
  name: string
  type: string
  description: string
  requiredAtCreation: boolean
}

interface PolicyImplementation {
  id: string
  name: string
  apiName: string
  description: string
  libraryUrl: string
  configFields: ConfigField[]
  exampleConfig: Record<string, unknown>
}

const policies = policyData as PolicyImplementation[]

function generateCurl(policy: PolicyImplementation): string {
  const hasInitialConfig = Object.keys(policy.exampleConfig).length > 0
  const configJson = hasInitialConfig
    ? JSON.stringify(policy.exampleConfig, null, 6).replace(/\n/g, "\n        ")
    : "{}"

  return `curl -X POST https://ace.api.chain.link/v1/policies \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Apikey <API_KEY>" \\
  -d '{
    "name": "My ${policy.name} Instance",
    "description": "Description for this policy instance",
    "policy_implementation_id": "${policy.id}",
    "policy_engine_id": "<POLICY_ENGINE_ID>",
    "onchain_policies": [
      {
        "chain_selector": "16015286601757825753",
        "initial_config": ${configJson}
      }
    ]
  }'`
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button className={styles.copyButton} onClick={handleCopy} aria-label="Copy to clipboard">
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

export default function PolicyInstanceBuilder() {
  const [selectedId, setSelectedId] = useState("")

  const selected = policies.find((p) => p.id === selectedId)

  return (
    <div className={styles.container}>
      <div className={styles.selectorCard}>
        <label htmlFor="policy-select" className={styles.label}>
          Select a policy implementation
        </label>
        <select
          id="policy-select"
          className={styles.select}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Choose a policy...</option>
          {policies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className={styles.details}>
          <p className={styles.description}>{selected.description}</p>

          <div className={styles.idRow}>
            <span className={styles.idLabel}>Implementation ID</span>
            <code className={styles.idValue}>{selected.id}</code>
            <CopyButton text={selected.id} />
          </div>

          <h3 className={styles.sectionTitle}>Configuration fields</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required at creation</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {selected.configFields.map((field) => (
                  <tr key={field.name}>
                    <td>
                      <code>{field.name}</code>
                    </td>
                    <td>
                      <code>{field.type}</code>
                    </td>
                    <td>{field.requiredAtCreation ? "Yes" : "No"}</td>
                    <td>{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={styles.sectionTitle}>Example curl command</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>bash</span>
              <CopyButton text={generateCurl(selected)} />
            </div>
            <div className={styles.codeContent}>{generateCurl(selected)}</div>
          </div>

          <p className={styles.learnMore}>
            Learn more about this policy's runtime behavior: <a href={selected.libraryUrl}>{selected.name} reference</a>
          </p>
        </div>
      )}
    </div>
  )
}
