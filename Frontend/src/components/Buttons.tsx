interface ButtonsProps {
  buttonTitle: string;
  onClick?: () => void;
}

export default function Button({ buttonTitle, onClick }: ButtonsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        px-5 py-2.5
        bg-blue-600 text-white
        font-medium text-sm
        rounded-xl
        shadow-md
        hover:bg-blue-700
        active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      "
    >
      {buttonTitle}
    </button>
  );
}