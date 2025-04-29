/**
 * Escapes special regex characters within a string to prevent syntax injection errors.
 */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * A utility component that safely scans a text body and wraps matching query characters.
 */
export function HighlightText({ text, searchTerm }: { text: string; searchTerm?: string }) {
  // Gracefully drops back to raw plain text strings if no valid query parameters are present.
  if (!searchTerm?.trim()) return <>{text}</>;

  // Dynamically constructs a case-insensitive regular expression pattern wrapper.
  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");

  // Splits the continuous string element into an accessible array of matches and segments.
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          /* Highlights explicitly matching string characters using consistent brand styles */
          <mark key={i} className="rounded-sm bg-teal-100 px-0.5 text-teal-700 not-italic">
            {part}
          </mark>
        ) : (
          /* Renders unmodified string fragments in native span fields */
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
