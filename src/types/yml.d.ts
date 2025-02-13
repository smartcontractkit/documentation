declare module "*.yml" {
  const content: Record<string, unknown>
  export default content
}

declare module "*.yaml" {
  const content: Record<string, unknown>
  export default content
}
