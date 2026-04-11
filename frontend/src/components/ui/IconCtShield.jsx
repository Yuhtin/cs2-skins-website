// Abstract CT shield — angular geometric shape, no Valve assets.
export function IconCtShield({ size = 20, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2 L20 6 V12 C20 17 16 20 12 22 C8 20 4 17 4 12 V6 Z" />
      <path d="M9 12 L11 14 L15 9" />
    </svg>
  );
}
