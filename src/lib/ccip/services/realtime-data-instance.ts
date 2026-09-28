import { RealtimeDataService } from "./realtime-data.ts"

/**
 * Singleton instance of RealtimeDataService
 * Use this shared instance across all components to avoid creating multiple instances
 */
export const realtimeDataService = new RealtimeDataService()
