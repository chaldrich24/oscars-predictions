import { useEffect, useState } from "react";
import "../App.css";
import OscarQuestion from "./OscarQuestion";
import PinInput from "./PinInput";
import { getCategories, submitEntry } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

import { GROUPS } from "../data/CategoryGroupings";

type Category = {
  id: string;
  display_name: string;
  points: number;
  nominees: string[];
  slug: string;
};

export type SubmitRequest = {
  name: string;
  pin: string;
  selections: {
    nominee: string;
    categoryId: string;
  }[];
};

export type Selection = {
  nominee: string;
  categoryId: string;
};

function CreateEntry() {
  const navigate = useNavigate();
  const [data, setData] = useState<Category[] | null>(null);
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [submitPressed, setSubmitPressed] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => {
        console.log("Fetched categories:", data);
        setData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (submitPressed) {
      setTimeout(() => setSubmitPressed(false), 5000);
    }
  }, [submitPressed]);

  const handleSubmit = () => {
    const request: SubmitRequest = {
      name: name,
      pin: pin,
      selections: Object.entries(selections).map(
        ([category, { nominee, categoryId }]) => ({
          nominee,
          categoryId,
        }),
      ),
    };
    if (request.selections.length !== data?.length) {
      alert("Please make a selection for every category before submitting.");
      return;
    } else if (request.pin.length !== 4) {
      alert("PIN must be exactly 4 digits.");
      return;
    } else if (name.trim() === "") {
      alert("Name cannot be empty.");
      return;
    } else {
      submitEntry(request)
        .then((response) => {
          console.log("Submission response:", response);
          // TODO: "remove alerts and replace with nicer UI feedback"
          navigate("/");
          // alert("Entry submitted successfully!");
        })
        .catch((error) => {
          console.error("Submission error:", error);
          // TODO: "remove alerts and replace with nicer UI feedback"
          alert("Error submitting entry: " + error.message);
        });
    }
  };
  const categoryData = data ? data : [];
  const bySlug = Object.fromEntries(categoryData.map((p) => [p.slug, p]));
  const reversedGroups = [...GROUPS] // copy whole array
    .reverse() // reverse group order
    .map((group) => {
      if (group.title === "Top Awards") {
        return {
          ...group,
          slugs: [...group.slugs].reverse(), // reverse only this group
        };
      }
      return group;
    });

  return (
    <div
      style={{
        padding: "0px 16px 16px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {data &&
        reversedGroups.map((g, index) => (
          <section
            key={g.title}
            style={{
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h3
              style={{
                margin: "10px 0",
                color: "rgb(168, 155, 111)",
                fontSize: 20,
                borderBottom: "2px solid rgb(168, 155, 111)",
                paddingBottom: 4,
                maxWidth: 600,
              }}
            >
              {index + 1}. {g.title}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "100%",
                maxWidth: 600,
              }}
            >
              {g.slugs.map((slug) => {
                const item = bySlug[slug];
                if (!item) return null;

                return (
                  <OscarQuestion
                    key={item.display_name}
                    category={item.display_name}
                    nominees={item.nominees}
                    points={item.points}
                    selections={selections}
                    setSelections={setSelections}
                    categoryId={item.id}
                  />
                );
              })}
            </div>
          </section>
        ))}
      {data && (
        <div style={styles.input}>
          {Object.keys(selections).length !== data.length && submitPressed && (
            <div style={styles.errorContainer}>
              <p style={styles.error}>
                Error: Missing {data.length - Object.keys(selections).length}{" "}
                selections
              </p>
            </div>
          )}
          <div style={{ color: "white", marginBottom: 12, fontSize: 14 }}>
            Create a 4-digit PIN so you can come back later and edit your picks.
            Don't forget it!
          </div>
          <input
            style={{ marginBottom: 12, padding: 12, background: "var(--section-item-bg)", border: "none", borderRadius: 8, color: "white", fontSize: 16 }}
            className="create-entry-input"
            type="text"
            placeholder="Name"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <PinInput pin={pin} setPin={setPin} />
          <button
            className="submit-btn"
            onClick={() => {
              setSubmitPressed(true);
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 48,
    position: "relative" as "relative",
  },
  error: {
    color: "red",
    fontSize: 14,
    margin: 0,
  },
  errorContainer: {
    position: "absolute" as "absolute",
    top: -25,
    backgroundColor: "#ffecec",
    padding: "0px 8px",
    borderRadius: 4,
  },
};

export default CreateEntry;
