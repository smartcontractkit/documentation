export function extendRadixComponent<T extends React.ComponentType<any>>(Component: T) {
  type ExtendedProps = React.ComponentPropsWithRef<T> & {
    children?: React.ReactNode
    className?: string
    container?: HTMLElement
  }
  return Component as React.FC<ExtendedProps>
}
