export default function LoadingSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16rem" }}>
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          border: "4px solid white",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  )
}

