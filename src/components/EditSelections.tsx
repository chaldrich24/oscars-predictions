import Select, { GroupBase, OptionsOrGroups, Options } from "react-select";
import { UserSelections } from "./UserSelections";

type Option = { value: string; label: string };

type EditSelectionsProps = {
  nominees: Options<Option>;
  pick: UserSelections;
  nomineeContainerStyle?: React.CSSProperties;
};

function EditSelections({nominees, pick, nomineeContainerStyle}: EditSelectionsProps) {
  return (
    <div
      style={nomineeContainerStyle}
    >
      <div style={{ width: "100%", flex: 4, marginRight: 10 }}>
        <Select<Option, false>
          styles={customStyles}
          options={nominees}
          defaultValue={{ value: pick.nominee, label: pick.nominee }}
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
  );
}

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: state.isFocused
      ? "rgba(239, 219, 149, 0.8)"
      : "rgba(255,255,255,0.16)",
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(239, 219, 149, 0.8)"
      : "none",
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

export default EditSelections;
