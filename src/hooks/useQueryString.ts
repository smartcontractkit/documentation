import { useState, useCallback, useEffect } from "preact/hooks"
type SearchParamValue = string | string[]

export const setQueryStringValue = (searchParamKey: string, value: SearchParamValue): SearchParamValue | undefined => {
  if (typeof window === "undefined") return

  const currentSearchParams = new URLSearchParams(window.location.search)
  if (typeof value !== "string") {
    currentSearchParams.delete(searchParamKey)
    value.forEach((val) => {
      currentSearchParams.append(searchParamKey, val)
    })
  } else {
    currentSearchParams.set(searchParamKey, value)
  }
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    `?${currentSearchParams.toString()}`

  window.history.replaceState({ path: newurl }, "", newurl)

  return getQueryStringValue(searchParamKey)
}
export const getQueryStringValue = (searchParamKey: string): SearchParamValue | undefined => {
  if (typeof window === "undefined") return undefined
  const values = new URLSearchParams(window.location.search).getAll(searchParamKey)
  return values.length > 1 ? values : values[0]
}

function useQueryString(
  searchParamKey: string,
  initialValue?: SearchParamValue
): [SearchParamValue | undefined, (newValue: SearchParamValue) => void] {
  const [value, setValue] = useState<SearchParamValue | undefined>(getQueryStringValue(searchParamKey) || initialValue)
  // Keep URL in sync when memory is updated using initial value.
  useEffect(() => {
    if (initialValue && !getQueryStringValue(searchParamKey)) {
      setQueryStringValue(searchParamKey, initialValue)
    }
  }, [])

  const onSetValue = useCallback(
    (newValue: SearchParamValue) => {
      setValue(newValue)
      setQueryStringValue(searchParamKey, newValue)
    },
    [searchParamKey]
  )
  // Keep memory in sync when search params are updated.
  useEffect(() => {
    const body = document.querySelector("body")
    if (!body) return
    const observer = new MutationObserver(() => {
      const newQueryStringValue = getQueryStringValue(searchParamKey)
      if (newQueryStringValue !== value && newQueryStringValue) {
        setValue(newQueryStringValue)
      }
    })
    observer.observe(body, { childList: true, subtree: true })
  }, [])

  return [value, onSetValue]
}

export default useQueryString
