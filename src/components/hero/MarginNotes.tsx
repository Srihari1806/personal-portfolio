/**
 * Handwritten marginalia. These read as notes scrawled onto the frame rather
 * than interface copy, so they sit outside the type scale entirely and lean on
 * hand-drawn arrows instead of any UI affordance.
 */

type Arrow = "down-right" | "down-left" | "curve" | "hook";

function ArrowMark({ kind }: { kind: Arrow }) {
  const paths: Record<Arrow, string> = {
    "down-right": "M3 3 C 14 16 26 28 40 38 M40 38 L 27 37 M40 38 L 39 25",
    "down-left": "M46 3 C 36 17 23 28 8 38 M8 38 L 21 37 M8 38 L 9 25",
    curve: "M8 3 C 30 6 40 20 33 40 M33 40 L 24 30 M33 40 L 43 32",
    hook: "M6 4 C 6 22 18 34 40 36 M40 36 L 30 30 M40 36 L 31 43",
  };
  return (
    <svg className="note__arrow" viewBox="0 0 48 46" aria-hidden="true" focusable="false">
      <path
        d={paths[kind]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarginNotes() {
  return (
    <div className="notes" data-field-notes aria-hidden="true">
      <p className="note note--passion">
        <span>
          Data meets
          <br />
          passion
        </span>
        <ArrowMark kind="down-right" />
      </p>

      <p className="note note--stories">
        <span>
          Good stories build
          <br />
          better conversations
        </span>
        <ArrowMark kind="curve" />
      </p>

      <p className="note note--cinema">
        <span>
          Cinema creates
          <br />
          connections
        </span>
        <ArrowMark kind="down-left" />
      </p>
    </div>
  );
}
