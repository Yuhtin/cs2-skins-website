// Abstract T emblem — inverted triangle with center slash, no Valve assets.
export function IconTShield({ size = 20, className }) {
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
      <path d="M4 4 H20 L12 22 Z" />
      <path d="M9 10 L15 10" />
    </svg>
  );
}
