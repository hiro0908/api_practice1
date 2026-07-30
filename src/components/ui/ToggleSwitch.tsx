"use client";
type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
};
export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <label
      style={{ display: "inline-flex", alignItems: "center", marginLeft: 12 }}
    >
      <div
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        style={{
          width: 40,
          height: 20,
          background: checked ? "#4ade80" : "#d1d5db",
          borderRadius: 9999,
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <span
          style={{
            display: "block",
            width: 16,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            position: "absolute",
            top: 2,
            left: checked ? 22 : 2,
            transition: "left 0.18s ease",
          }}
        />
      </div>
    </label>
  );
}
