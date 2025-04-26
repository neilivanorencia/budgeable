function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightText({ text, searchTerm }: { text: string; searchTerm?: string }) {
  if (!searchTerm?.trim()) return <>{text}</>;
  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-teal-100 text-teal-700 rounded-sm px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
