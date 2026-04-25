export default function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = '',
  label = '',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded
          text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
