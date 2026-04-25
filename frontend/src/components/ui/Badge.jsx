export default function Badge({ children, variant = 'default', className = '' }) {
  const variantClasses = {
    default: 'bg-[#1E1E1E] text-[#CCFF00]',
    success: 'bg-green-900 text-green-200',
    warning: 'bg-yellow-900 text-yellow-200',
    error: 'bg-red-900 text-red-200',
    primary: 'bg-[#CCFF00] text-black font-semibold',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
