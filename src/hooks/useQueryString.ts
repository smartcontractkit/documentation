import { useState, useCallback, useEffect } from "preact/hooks"
import qs from "query-string"

const setQueryStringWithoutPageReload = (qsValue) => {
  if (!window) return

  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + qsValue

  window.history.replaceState({ path: newurl }, "", newurl)
}
const setQueryStringValue = (searchParamKey, value, queryString = window.location.search) => {
  if (!window) return

  const values = qs.parse(queryString)
  const newQsValue = qs.stringify({ ...values, [searchParamKey]: value })
  setQueryStringWithoutPageReload(`?${newQsValue}`)
}
const getQueryStringValue = (searchParamKey) => {
  if (typeof window === "undefined") return
  const values = qs.parse(window.location.search)
  return values[searchParamKey]
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
    const observer = new MutationObserver((mutations) => {
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
