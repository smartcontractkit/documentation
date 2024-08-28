import { useEffect, useState } from "react"

// Define the API URLs
const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:4321/api/dummyApiRoute" : "/api/dummyApiRoute"
const apiUrlWithKey =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4321/api/dummyApiRouteWithKey"
    : "/api/dummyApiRouteWithKey"

// Define the DataObject interface if necessary
interface DataObject {
  title: string
  [key: string]: any
}

// Example DummyDataRetriever component without API key
const DummyDataRetriever = () => {
  const [data, setData] = useState<DataObject | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(apiUrl)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
        setData(null)
      }
    }

    getData()
  }, [])

  return <div style={{ marginTop: "0px" }}>{data ? data.title : "Loading..."}</div>
}

// Example DummyDataRetrieverWithKey component with API key
const DummyDataRetrieverWithKey = () => {
  const [isActive, setIsActive] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(apiUrlWithKey, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const result = await response.json()

        const firstItem = result.data?.[0]
        if (firstItem && firstItem.is_active !== undefined) {
          setIsActive(firstItem.is_active === 1 ? "true" : "false")
        } else {
          setIsActive("false")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsActive("false")
      }
    }

    getData()
  }, [])

  return <div style={{ marginTop: "0px" }}>{isActive !== null ? isActive : "Loading..."}</div>
}

export { DummyDataRetriever, DummyDataRetrieverWithKey }
