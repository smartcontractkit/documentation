export function extendRadixComponent<T extends React.ComponentType<any>>(
  Component: T,
) {
  type ExtendedProps = React.ComponentPropsWithRef<T> & {
    children?: React.ReactNode
    className?: string
    asChild?: boolean
    container?: HTMLElement
  }
  return Component as React.FC<ExtendedProps>
}
