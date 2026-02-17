import React, { useId, useMemo } from "react";

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function OscarQuestion({
  category,
  nominees,
  points = 1,
  value,
  defaultValue = null,
  onChange,
  disabled = false,
  showClear = true,
  answers,
  setAnswers,
}) {
  const reactId = useId();

  // Support controlled + uncontrolled
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = isControlled ? (value ?? null) : internalValue;

  React.useEffect(() => {
    // If category changes, keep prior selection only if it still exists
    if (!selected) return;
    if (!nominees.includes(selected)) {
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, nominees.join("|")]);

  const name = useMemo(() => `oq-${slugify(category)}-${reactId}`, [category, reactId]);

  const setSelected = (next) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(next);
    
    if (!next) {
        const newState = { ...answers };
        delete newState[category];
        setAnswers(newState);
    } else {
        setAnswers((prev) => ({ ...prev, [category]: next }));
    }
  };

  return (
    <section className="card" style={styles.card} aria-label={category}>
      <header style={styles.header} className="header">
        <div style={{ display: "grid", gap: 6 }}>
          <h3 className="title" style={styles.title}>{category}</h3>
        </div>

        <div style={styles.meta}>
          <span style={{...styles.pill, ...{backgroundColor: selected ? "#efdb95" : "#bcb8b6dc"}}} className="pill">
            {points} point{points === 1 ? "" : "s"}
          </span>
          <span style={styles.status}>{selected ? "" : "No selection"}</span>
        </div>
      </header>

      <ul style={styles.list} role="radiogroup" aria-label={category}>
        {nominees.map((nominee, idx) => {
          const id = `${name}-${idx}`;
          const checked = nominee === selected;

          return (
            <li key={nominee} style={{ margin: 0 }}>
              <label
                htmlFor={id}
                style={{
                  ...styles.row,
                  ...(disabled ? styles.rowDisabled : null),
                }}
              >
                {/* Keep native radio for accessibility, visually hidden */}
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={nominee}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => setSelected(nominee)}
                  style={styles.radioHidden}
                />

                <span
                  aria-hidden="true"
                  style={{
                    ...styles.bullet,
                    ...(checked ? styles.bulletChecked : null),
                    ...(disabled ? styles.bulletDisabled : null),
                  }}
                />

                <span style={styles.text}>{nominee}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {showClear ? (
        <footer style={styles.footer}>
          <button
            type="button"
            onClick={() => setSelected(null)}
            disabled={disabled || !selected}
            style={{
              ...styles.button,
              ...((disabled || !selected) ? styles.buttonDisabled : null),
            }}
          >
            Clear selection
          </button>
        </footer>
      ) : null}
    </section>
  );
}

const styles = {
  card: {
    maxWidth: 760,
    padding: "16px 16px 5px 16px",
    borderRadius: 7,
    border: "1px solid rgba(0,0,0,0.12)",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    background: "white",
    width: "100%",
    margin: "10px 0",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 7,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "Cormorant Garamond, serif",
  },
  meta: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  pill: {
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 10,
    background: "rgba(181, 181, 181, 0.8)",
  },
  status: {
    fontSize: 10,
    opacity: 0.75,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 8,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.10)",
    cursor: "pointer",
    userSelect: "none",
  },
  rowDisabled: {
    cursor: "not-allowed",
    opacity: 0.7,
  },
  radioHidden: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
  bullet: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: "2px",
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "inline-block",
  },
  bulletChecked: {
    borderColor: "rgba(0,0,0,0.9)",
    background: "rgba(0,0,0,0.9)",
    boxShadow: "inset 0 0 0 3px white",
  },
  bulletDisabled: {
    borderColor: "rgba(0,0,0,0.25)",
  },
  text: {
    fontSize: 13,
    lineHeight: 1.3,
    textAlign: "left",
  },
  footer: {
    marginTop: 12,
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: 10,
    padding: "8px 10px",
    background: "white",
    cursor: "pointer",
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
