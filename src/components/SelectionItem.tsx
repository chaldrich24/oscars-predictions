import Select, {
  GroupBase,
  OptionsOrGroups,
  Options,
  SingleValue,
} from "react-select";
import { UserSelections } from "./UserSelections";
import { FaEdit, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { updateEntry } from "../lib/supabaseClient";

type Option = { value: string; label: string };

type SelectionItemProms = {
  nominees: Options<Option>;
  pick: UserSelections;
  slug: string;
  user_id: string;
};

type UpdateEntryRequestBody = {
  user_id: string;
  category_id: string;
  nominee: string;
};

type UpdatedNominee = {
  display: string[];
  value: string;
};

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

function SelectionItem({ nominees, pick, slug, user_id }: SelectionItemProms) {
  const updateNominee = (nominee: string): UpdatedNominee => {
    const display = nominee.includes("—")
      ? nominee.split("—").map((i) => i.trim())
      : [nominee];
    return {
      display: display,
      value: nominee,
    };
  };

  const [editing, setEditing] = useState<boolean>(false);
  const [nominee, setNominee] = useState<UpdatedNominee>(
    updateNominee(pick.nominee),
  );
  const [newNominee, setNewNominee] = useState<string>("");

  const editButton = () => {
    return (
      <FaEdit
        style={{
          fontSize: 14,
          opacity: 0.5,
          color: "white",
        }}
      />
    );
  };

  const exitEditButton = () => {
    return (
      <FaTimes
        style={{
          fontSize: 14,
          opacity: 0.5,
          color: "white",
        }}
      />
    );
  };

  const setNewEntry = (option: SingleValue<Option>) => {
    if (option && option.value != nominee.value) {
      setNewNominee(option.value);
    }
  };

  const updateEntryHandler = (request: UpdateEntryRequestBody) => {
    if (request.nominee && request.nominee != nominee.value) {
      updateEntry(request)
        .then(() => {
          setEditing(false);
          setNominee(updateNominee(request.nominee));
          setNewNominee("");
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div
      key={slug}
      style={{
        padding: 12,
        borderRadius: 10,
        background: getBackgroundColor(pick.winner, nominee.value),
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
        {pick.winner !== null ? (
          <div style={{ flex: 1 }}>
          </div>
        ) : (
          <div style={{ flex: 1 }} onClick={() => setEditing(!editing)}>
            {editing ? exitEditButton() : editButton()}
          </div>
        )}

        <div style={{ flex: 10 }}>{pick.category_name}</div>
        {pick.winner && pick.winner == nominee.value ? (
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
      {editing ? (
        <div style={styles.nomineeContainer}>
          <div style={{ width: "100%", flex: 4, marginRight: 10 }}>
            <Select<Option, false>
              styles={customStyles}
              options={nominees}
              defaultValue={{
                value: nominee.value,
                label: nominee.value,
              }}
              onChange={(option) => setNewEntry(option)}
              isSearchable={false}
            />
          </div>
          <button
            style={{
              minHeight: 25,
              flex: 1,
              borderRadius: 12,
              backgroundColor: "rgb(174, 155, 91)",
              color: "black",
              border: "none",
              cursor: "pointer",
              marginTop: 10,
              padding: "4px 12px",
            }}
            onClick={() =>
              updateEntryHandler({
                user_id,
                category_id: pick.category_id,
                nominee: newNominee,
              })
            }
          >
            Submit
          </button>
        </div>
      ) : (
        <div style={{ ...styles.nomineeContainer, flexDirection: "column" }}>
          {nominee.display.length == 1 ? (
            <div style={{ fontSize: 17 }}>{nominee.display[0]}</div>
          ) : (
            <div>
              <div style={{ fontSize: 17}}>{nominee.display[0]}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {nominee.display[1]}
              </div>
            </div>
          )}
        </div>
      )}
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

    // IMPORTANT:
    fontSize: 16,
    minHeight: 38,
  }),

  // this targets the actual input element react-select uses
  input: (base: any) => ({
    ...base,
    fontSize: 16,
    fontWeight: 400,
  }),

  singleValue: (base: any) => ({
    ...base,
    color: "white",
    fontSize: 16, // was 12
    textAlign: "left",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
  }),

  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(239, 219, 149, 0.2)"
      : state.isFocused
        ? "rgba(255,255,255,0.08)"
        : "transparent",
    color: "white",
    fontSize: 16, // was 12
    textAlign: "left",
    fontWeight: 600,
  }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: "#2f2f2f",
    borderRadius: 12,
    overflow: "hidden",
  }),

  dropdownIndicator: (base: any) => ({
    ...base,
    color: "rgba(239, 219, 149, 0.9)",
  }),
};

const styles = {
  nomineeContainer: {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as "column",
    width: "100%",
  },
};

export default SelectionItem;
