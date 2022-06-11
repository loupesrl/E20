function NavItem(props) {
  return (
    <button
      type="button"
      className={`p-4 text-left rounded-lg ${
        props.active ? "bg-stone-300" : ""
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default NavItem;
