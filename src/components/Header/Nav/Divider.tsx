export const Divider = ({ className }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundColor: "var(--blue-200)",
      width: "1px",
      height: "var(--space-6x)",
      alignSelf: "center",
    }}
  />
)
