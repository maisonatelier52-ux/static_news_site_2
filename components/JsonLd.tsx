/**
 * Renders a JSON-LD <script> tag. Accepts one or more structured-data
 * objects so a page can emit several graphs (e.g. NewsArticle +
 * BreadcrumbList) without stacking multiple script tags.
 */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON-LD is safe to inline here: it's derived entirely from our
          // own data.json, not user input, and "<\/" escaping prevents any
          // accidental premature </script> termination.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
