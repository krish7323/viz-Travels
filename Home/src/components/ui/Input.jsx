function Input({ label, type = "text", name, value, onChange, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-300">
        {label} {required && <span className="text-cyan">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-navycard border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-cyan focus:ring-1 focus:ring-cyan"
      />
    </div>
  );
}

export default Input;