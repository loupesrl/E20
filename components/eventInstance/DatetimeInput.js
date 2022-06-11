function DatetimeInput(props) {
  return (
    <div className="flex flex-col">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        onChange={props.onChange}
        className="p-4 rounded-lg border shadow-sm"
        type={"datetime-local"}
        value={props.value}
      />
    </div>
  );
}

export default DatetimeInput;
