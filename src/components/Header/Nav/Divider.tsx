export const Divider = ({ className }: { className?: string }) => (
  <div
    className={className}
    style={{
      backgroundColor: "var(--border)",
      width: "1px",
      height: "var(--space-6x)",
      alignSelf: "center",
    }}
  />
)
