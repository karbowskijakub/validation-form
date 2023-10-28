const Checkbox = ({
  name,
  checked,
  handleChange,
  label,
}: {
  name: string;
  checked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <div className="checkbox-wrapper">
      <label className="raw-text">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        {label}
      </label>
    </div>
  );
};
export default Checkbox;
