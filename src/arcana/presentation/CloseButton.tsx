/** A system control must remain visible when artwork cannot be downloaded. */
export function CloseButton({
  label,
  onClose,
  className = 'game-object',
}: {
  label: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onClose}>
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="m6 6 12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
