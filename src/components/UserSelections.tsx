import { use, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditSelections from "./EditSelections";
import Select, { GroupBase, OptionsOrGroups, Options } from "react-select";

type Option = { value: string; label: string };

export type UserSelections = {
  category_id: string;
  category_name: string;
  slug: string;
  points: number;
  nominee: string;
  winner: string | null;
  nomineesList: string[];
};

export type UserSelectionsObj = {
  name: string;
  selections: UserSelections[];
};

export type UserSelectionsProps = {
  userSelections: UserSelectionsObj;
};

function UserSelections({ userSelections }: UserSelectionsProps) {
  console.log(userSelections);
  const GROUPS = [
    {
      title: "Top Awards",
      slugs: [
        "best_picture",
        "directing",
        "writing_original",
        "writing_adapted",
      ],
    },
    {
      title: "Acting",
      slugs: [
        "actor_leading",
        "actress_leading",
        "actor_supporting",
        "actress_supporting",
      ],
    },
    {
      title: "Craft",
      slugs: [
        "cinematography",
        "film_editing",
        "visual_effects",
        "music_original_score",
        "music_original_song",
        "sound",
        "production_design",
        "makeup_hairstyling",
        "costume_design",
        "casting",
      ],
    },
    {
      title: "Shorts & International",
      slugs: [
        "international_feature_film",
        "animated_feature_film",
        "animated_short_film",
        "documentary_feature_film",
        "documentary_short_film",
        "live_action_short_film",
      ],
    },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [editing, setEditing] = useState<boolean>(false);
  const [values, setValues] = useState<any>(null);

  const bySlug = Object.fromEntries(
    userSelections.selections.map((p) => [p.slug, p]),
  );

  const currentPoints = userSelections.selections.reduce((acc, sel) => {
    return sel.nominee == sel.winner ? acc + sel.points : acc;
  }, 0);

  const getBackgroundColor = (winner: string | null, nominee: string) => {
    if (winner) {
      if (nominee == winner) {
        return "rgba(118, 234, 30, 0.24)";
      } else {
        return "rgba(242, 63, 63, 0.22)";
      }
    } else {
      return "rgba(255,255,255,0.06)";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={styles.profileHeader}>
        <div style={styles.name}>Raymond Stevenson</div>
        <div style={styles.sub}>Points: {currentPoints}</div>
      </div>
      <div style={styles.container}>
        {GROUPS.map((g) => (
          <section key={g.title} style={{ marginBottom: 16 }}>
            <h3
              style={{
                margin: "10px 0",
                opacity: 0.85,
                color: "rgb(174, 155, 91)",
              }}
            >
              {g.title}
            </h3>

            <div style={{ display: "grid", gap: 10 }}>
              {g.slugs.map((slug) => {
                const pick = bySlug[slug];
                if (!pick) return null;
                const nominees: Options<Option> = pick.nomineesList.map(
                  (nom, index) => ({
                    value: nom,
                    label: nom,
                  }),
                );

                // Turn into own component
                return (
                  <div
                    key={slug}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: getBackgroundColor(pick.winner, pick.nominee),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        opacity: 0.65,
                        marginBottom: 4,
                        color: "white",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{ flex: 1 }}
                        onClick={() => console.log("PRESS")}
                      >
                        <FaEdit
                          style={{
                            fontSize: 12,
                            opacity: 0.5,
                            color: "white",
                          }}
                        />
                      </div>
                      <div style={{ flex: 10 }}>{pick.category_name}</div>
                      {pick.winner && pick.winner == pick.nominee ? (
                        <div
                          style={{
                            fontSize: 10,
                            opacity: 0.75,
                            color: "white",
                            flex: 1,
                          }}
                        >
                          + {pick.points}
                        </div>
                      ) : (
                        <div style={{ flex: 1 }}></div>
                      )}
                    </div>
                    <div style={styles.nomineeContainer}>
                      <div style={{ width: "100%", flex: 4, marginRight: 10 }}>
                        <Select<Option, false>
                          styles={customStyles}
                          options={nominees}
                          defaultValue={{
                            value: pick.nominee,
                            label: pick.nominee,
                          }}
                        />
                      </div>
                      <button
                        style={{
                          minHeight: 25,
                          flex: 1,
                          borderRadius: 12,
                          backgroundColor: "rgba(239, 219, 149, 0.8)",
                          color: "black",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Submit
                      </button>

                      {/* {pick.nominee} */}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: state.isFocused
      ? "rgba(239, 219, 149, 0.8)"
      : "rgba(255,255,255,0.16)",
    boxShadow: state.isFocused ? "0 0 0 1px rgba(239, 219, 149, 0.8)" : "none",
    borderRadius: 12,
  }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: "#2f2f2f",
    borderRadius: 12,
    overflow: "hidden",
  }),

  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(239, 219, 149, 0.2)"
      : state.isFocused
        ? "rgba(255,255,255,0.08)"
        : "transparent",
    color: "white",
    fontSize: 12,
    textAlign: "left",
  }),

  singleValue: (base: any) => ({
    ...base,
    color: "white",
    fontSize: 12,
    textAlign: "left",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "rgba(255,255,255,0.6)",
  }),

  dropdownIndicator: (base: any) => ({
    ...base,
    color: "rgba(239, 219, 149, 0.9)",
  }),
};

const styles = {
  container: {
    width: "90%",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "column" as "column",
    marginTop: 10,
    width: "100%",
  },

  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
  },

  sub: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    opacity: 0.6,
    color: "white",
  },
  nomineeContainer: {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
};

export default UserSelections;
