import type { CommunityEvent } from "./types.ts"

// Fetch events from Webflow RSS feed
export const fetchEventsFromRSS = async (): Promise<CommunityEvent[]> => {
  try {
    const response = await fetch("https://chain.link/events-coll/rss.xml")
    const xml = await response.text()

    // Parse RSS XML manually (lightweight approach without xml2js dependency)
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Set to start of today to include today's events

    const events = items
      .map((item, index) => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ""
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ""
        const description = item.match(/<description>(.*?)<\/description>/)?.[1] || ""
        const mediaContent = item.match(/<media:content url="(.*?)"/)?.[1] || ""

        // Parse description: "Nov 12, 2025 -  | Meetup | Bhopal | https://luma.com/cl_bhopal01"
        const descParts = description.split("|").map((s) => s.trim())
        const location = descParts[2] || "Virtual"
        const eventUrl = descParts[3] || ""

        // Parse date
        const dateObj = new Date(pubDate)
        const month = dateObj.toLocaleDateString("en-US", { month: "short" })
        const day = dateObj.getDate().toString()

        return {
          id: index.toString(),
          title: title.replace(/&amp;/g, "&"),
          date: dateObj.toISOString(),
          month,
          day,
          location,
          country: location,
          flagUrl: mediaContent,
          eventUrl,
          backgroundColor: "rgb(12, 22, 44)",
        }
      })
      .filter((event) => new Date(event.date) >= now) // Filter out past events
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort ascending (closest first)
      .slice(0, 3) // Only take the first 3 events

    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}
