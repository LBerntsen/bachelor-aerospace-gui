interface CardProps
{
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = ""}: CardProps) {
  return (
    <div className={`rounded-2xl bg-[#161616] p-4 border border-[#1e293b] ${className}`}>
      {children}
    </div>
  );
}