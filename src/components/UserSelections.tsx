import { use, useEffect, useRef, useState } from "react";
import { Options } from "react-select";
import SelectionItem from "./SelectionItem";
import { useParams } from "react-router-dom";
import { getEntry } from "../lib/supabaseClient";
import { GROUPS } from "../data/CategoryGroupings";

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
  user_id: string;
  selections: UserSelections[];
};

export type UserSelectionsProps = {
  userSelections: UserSelectionsObj;
};

function UserSelections() {
  const { userId, name } = useParams();
  console.log(name)
  const [userSelections, setUserSelections] =
    useState<UserSelectionsObj | null>(null);
  const [error, setError] = useState<string | null>(null);
  const calledAPI = useRef(false);
  
  useEffect(() => {
    if (!userId || calledAPI.current) return;
    calledAPI.current = true;
    console.log(userId)
    getEntry({user_id: userId})
      .then((data) => {
        console.log("Fetched entry data:", data);
        setUserSelections({...data.data, name: name ? name : "Unknown User"});
      })
      .catch((err) => {
        console.error("Error fetching entry data:", err);
        setError("Failed to load user selections.");
      });
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selections = userSelections?.selections ?? [];

  const bySlug = Object.fromEntries(selections.map((p) => [p.slug, p]));

  const currentPoints = selections.reduce((acc, sel) => {
    return sel.nominee === sel.winner ? acc + sel.points : acc;
  }, 0);

  if (error) return <div style={{ padding: 16, color: "white" }}>{error}</div>;
  if (!userSelections)
    return <div style={{ padding: 16, color: "white" }}>Loading…</div>;
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 25,
      }}
    >
      {/* <div style={styles.profileHeader}>
        <div style={styles.name}>{userSelections.name}</div>
        <div style={styles.sub}>Points: {currentPoints}</div>
      </div> */}
      <div style={styles.profileHeader} className="nine">
        <h1>{userSelections.name} <span>Points: {currentPoints}</span></h1>
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

                return (
                  <SelectionItem
                    key={slug}
                    nominees={nominees}
                    pick={pick}
                    slug={slug}
                    user_id={userSelections.user_id}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: 600,
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "column" as "column",
    marginTop: 10,
    width: "80%",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    textTransform: "uppercase",
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
