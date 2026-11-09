// Swagger UI browser assets, served from this application's own origin.
//
// Vite emits these files as separate, content-hashed assets at build time (`?url&no-inline`),
// so API reference pages never load executable code or styles from a third-party CDN.
// Import this module from Astro frontmatter only: it exports URL strings and never executes Swagger.
import swaggerUiCssUrl from "swagger-ui-dist/swagger-ui.css?url&no-inline"
import swaggerUiBundleUrl from "swagger-ui-dist/swagger-ui-bundle.js?url&no-inline"
import swaggerUiStandalonePresetUrl from "swagger-ui-dist/swagger-ui-standalone-preset.js?url&no-inline"

export { swaggerUiCssUrl, swaggerUiBundleUrl, swaggerUiStandalonePresetUrl }
