/** @jsxImportSource preact */

export const DownloadButton = () => {
  const buttonStyle = {
    padding: "12px 24px",
    margin: "20px 0",
    backgroundColor: "rgb(8, 71, 247)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    textDecoration: "none",
  }

  const handleClick = () => {
    window.open("https://github.com/smartcontractkit/cre-cli/releases/tag/v1.1.0", "_blank", "noopener,noreferrer")
  }

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "rgb(6, 56, 197)"
  }

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "rgb(8, 71, 247)"
  }

  return (
    <button style={buttonStyle} onClick={handleClick} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      Download the CRE CLI from GitHub Releases
    </button>
  )
}
