export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#1E1E1E] rounded-lg border border-[#333] p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-xl font-bold text-white ${className}`}>{children}</h2>;
}

export function CardBody({ children, className = '' }) {
  return <div className={` ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`mt-4 pt-4 border-t border-[#333] ${className}`}>{children}</div>;
}
