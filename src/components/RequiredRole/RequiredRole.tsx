import type { ReactNode } from "react"
import { SvgArrowRight2, Tag, Typography, buttonVariants } from "@chainlink/blocks"
import { describeRequiredRole, type RequiredRoleProduct } from "./roles.js"

interface RequiredRoleProps {
  product: RequiredRoleProduct
  role: string
  /** Optional short qualifier, for example the permission or a UI-only limit. */
  children?: ReactNode
}

/**
 * Shows the role a reader needs to do what the page describes.
 *
 * Built only from @chainlink/blocks components and design tokens (no custom CSS), so it follows
 * the site theme, including dark mode, without extra work.
 *
 * Usage in MDX:
 *
 *   import { RequiredRole } from "@components"
 *
 *   <RequiredRole product="ace" role="operator" />
 *
 *   <RequiredRole product="ace" role="admin">
 *     Creating a wallet also needs the `ace:core:wallet:write` permission.
 *   </RequiredRole>
 *
 * Role names and the link come from ./roles.ts. The link opens the shared RBAC page scoped to
 * the product, so the reader stays in that product's docs.
 */
export const RequiredRole = ({ product, role, children }: RequiredRoleProps) => {
  const info = describeRequiredRole(product, role)
  if (!info) {
    throw new Error(`<RequiredRole> does not know the role "${role}" for product "${product}". See roles.ts.`)
  }

  return (
    <div
      role="note"
      aria-label="Required role"
      className="my-4 flex flex-col gap-2 rounded border border-solid border-border bg-muted p-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Typography variant="body-semi-xs" color="muted">
          Required role:
        </Typography>
        <Tag variant="progress" size="sm" hideIcon>
          {info.name}
        </Tag>
        {info.orHigher && <Typography variant="body-s">or higher</Typography>}
        <a
          href={info.url}
          className={`${buttonVariants({ variant: "tertiary", size: "xs", width: "hug" })} md:ml-auto`}
        >
          What each role can do
          <SvgArrowRight2 />
        </a>
      </div>
      {children && <div className="text-sm text-muted-foreground [&_p]:m-0 [&_p]:text-sm">{children}</div>}
    </div>
  )
}
