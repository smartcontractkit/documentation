function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }

  // Fallback for non-secure contexts (e.g. http://localhost)
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "absolute"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand("copy")
  document.body.removeChild(textarea)
  return ok ? Promise.resolve() : Promise.reject(new Error("Copy failed"))
}

document.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement | null
  const button = (target?.closest?.(".code-sample__copy-button") as HTMLButtonElement | null) ?? null
  if (!button) return

  const root = button.closest(".code-sample")
  const codeEl = (root?.querySelector("pre code") as HTMLElement | null) ?? null
  const text = codeEl ? codeEl.innerText : ""
  if (!text) return

  const oldHtml = button.innerHTML
  try {
    await copyText(text)
    button.innerHTML = '<img src="/assets/icons/checkCircleIconGrey.svg" alt="Copied" width="16" height="16" />'
    window.setTimeout(() => {
      button.innerHTML = oldHtml
    }, 1500)
  } catch (_err) {
    // no-op; keep original UI
  }
})
