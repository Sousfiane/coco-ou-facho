const Title = ({ children, center }) => {
  return (
    <h2
      className={
        "font-semibold text-2xl text-slate-800" + (center ? " text-center" : "")
      }
    >
      {children}
    </h2>
  );
};

export default Title;
