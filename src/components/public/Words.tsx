/**
 * Splits text into per-word spans with staggered transition delays.
 * Place inside a container with data-reveal="words": when ScrollFx marks
 * the container `.in`, words appear left-to-right, line by line.
 * Server component — no client JS.
 */
export function Words({
  text,
  step = 45,
  from = 0,
}: {
  text: string;
  step?: number;
  from?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="wd" style={{ transitionDelay: `${from + i * step}ms` }}>
            {w}
          </span>{' '}
        </span>
      ))}
    </>
  );
}
