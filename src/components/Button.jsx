const Button = ({ children, onClick, color }) => {
  return (
    <button
      className={
        (color ? color : "bg-sky-500 text-slate-50 hover:bg-sky-700 ") +
        "mt-2 p-2 rounded-md w-full transition-color duration-300 ease-it-out"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
