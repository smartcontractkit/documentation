declare module "*.astro" {
  import { AstroComponentFactory } from "astro/runtime/server/index.js"
  const content: AstroComponentFactory
  export default content
}
