export const Base = ({
  id,
  border,
  backgroundColor,
  onMouseDown,
  onMouseUp,
  children,
  label,
}) => {
  const containerStyle = {
    width: "calc(40% - 8px)",
    height: "300px",
    margin: "4px",
    border: border,
    backgroundColor: backgroundColor,
    fontSize: "24px",
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    position: "relative",
    flexGrow: 1,
  };

  const labelStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
    fontSize: "28px",
    paddingLeft: "4px",
    paddingTop: "4px",
  };

  return (
    <div
      id={id}
      style={containerStyle}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      suppressHydrationWarning
    >
      <div suppressHydrationWarning>{children}</div>

      <p style={labelStyle}>{label}</p>
    </div>
  );
};
