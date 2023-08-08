import { useState, useCallback, useEffect } from "preact/hooks"

const setQueryStringWithoutPageReload = (qsValue) => {
  if (typeof window === "undefined") return

  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qsValue

  window.history.replaceState({ path: newurl }, "", newurl)
}
const setQueryStringValue = (searchParamKey, value) => {
  if (typeof window === "undefined") return

  const currentSearchParams = new URLSearchParams(window.location.search)
  currentSearchParams.set(searchParamKey, value)

  setQueryStringWithoutPageReload(`?${currentSearchParams.toString()}`)
}
const getQueryStringValue = (searchParamKey) => {
  if (typeof window === "undefined") return
  return new URLSearchParams(window.location.search).get(searchParamKey)
}

type SearchParamValue = string | string[]

function useQueryString(
  searchParamKey: string,
  initialValue?: SearchParamValue
): [SearchParamValue, (newValue: SearchParamValue) => void] {
  const [value, setValue] = useState(getQueryStringValue(searchParamKey) || initialValue)
  const onSetValue = useCallback(
    (newValue: string | string[]) => {
      setValue(newValue)
      setQueryStringValue(searchParamKey, newValue)
    },
    [searchParamKey]
  )

  useEffect(() => {
    const body = document.querySelector("body")
    const observer = new MutationObserver(() => {
      const newQueryStringValue = getQueryStringValue(searchParamKey)
      if (newQueryStringValue !== value) {
        setValue(newQueryStringValue)
      }
    })
    observer.observe(body, { childList: true, subtree: true })
  }, [])

  return [value, onSetValue]
}

export default useQueryString
