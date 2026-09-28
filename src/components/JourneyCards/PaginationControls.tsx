interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  containerClassName?: string
  buttonClassName?: string
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  containerClassName,
  buttonClassName,
}: PaginationControlsProps) => {
  // Only render when there's more than one page
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={containerClassName}>
      <button onClick={onPrevious} disabled={currentPage === 0} className={buttonClassName} aria-label="Previous page">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="10"
          viewBox="0 0 13 10"
          fill="none"
          style={{ transform: "scaleX(-1)" }}
        >
          <path
            d="M0 4.53027H11.25M11.25 4.53027L7.25 8.53027M11.25 4.53027L7.25 0.530273"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={buttonClassName}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path
            d="M0 4.53027H11.25M11.25 4.53027L7.25 8.53027M11.25 4.53027L7.25 0.530273"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  )
}
