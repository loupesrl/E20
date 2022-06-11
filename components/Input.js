function Input({ onChange, value }) {
  return (
    <input
      onChange={onChange}
      className="p-4 rounded-lg border shadow-sm"
      type="text"
      value={value}
    />
  );
}

export default Input;
