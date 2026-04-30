import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (_context, next) => {
  return next()
})
