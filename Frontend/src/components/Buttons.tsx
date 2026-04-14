interface ButtonsProps {
  buttonTitle: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
    buttonTitle,
    onClick,
    disabled = false,
    className = "",
}: ButtonsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${className}
        w-full
        px-4 py-2.5
        rounded-lg
        font-mono text-xs uppercase tracking-widest
        border border-white/10
        bg-[#0f172a]
        text-white/90
        transition-all duration-200

        ${disabled? "opacity-40 cursor-not-allowed": `
              hover:bg-[#1e293b]
              hover:border-white/20
              hover:text-white
              hover:shadow-[0_0_10px_rgba(30,41,59,0.6)]
              active:scale-[0.97]
            `
        }
        focus:outline-none focus:ring-1 focus:ring-white/20
      `}
    >
      {buttonTitle}
    </button>
  );
}