function Input({ id, onChange, value, label }) {
  return (
    <div className="flex flex-col grow">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        onChange={onChange}
        className="p-4 rounded-lg border shadow-sm"
        type="text"
        value={value}
      />
    </div>
  );
}

export default Input;
