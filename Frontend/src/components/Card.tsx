type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = ""}: Props) {
  return (
    <div className={`rounded-2xl bg-[#161616] p-4 border border-[#1e293b] ${className}`}>
      {children}
    </div>
  );
}