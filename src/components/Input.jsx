const Input = ({ value, onChange, placeholder, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-slate-500 rounded-md mt-4 p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
    />
  );
};

export default Input;
