interface ConfirmationDialogProps {
  title: string
  message: string
  estimatedGas?: string
  actionType: "critical" | "warning" | "info"
}

export const showConfirmationDialog = async (props: ConfirmationDialogProps): Promise<boolean> => {
  if (typeof window === "undefined") return false
  return window.confirm(
    `${props.title}\n\n${props.message}${props.estimatedGas ? `\n\nEstimated Gas: ${props.estimatedGas}` : ""}`
  )
}
