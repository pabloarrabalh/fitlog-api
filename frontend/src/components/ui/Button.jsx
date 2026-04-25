export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-[#CCFF00] text-black hover:bg-[#B8E600] focus:ring-[#CCFF00] disabled:opacity-50',
    secondary: 'bg-[#1E1E1E] text-[#CCFF00] border border-[#CCFF00] hover:bg-[#2A2A2A] focus:ring-[#CCFF00] disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50',
    ghost: 'text-[#CCFF00] hover:bg-[#1E1E1E] focus:ring-[#CCFF00] disabled:opacity-50',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
