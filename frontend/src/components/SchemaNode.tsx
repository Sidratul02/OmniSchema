import { Handle, Position } from "reactflow";
import { deleteEntity } from "../services/schema.service";
import toast from "react-hot-toast";

type Props = {
  data: {
    id: string;
    label: string;
    fields: { name: string; datatype: string; primary?: boolean; }[];
  };
};

const datatypeColor: Record<string, { text: string; bg: string }> = {
  uuid:    { text: "#7c5cbf", bg: "#f0ebff" },
  string:  { text: "#2d7d5a", bg: "#e8f8ef" },
  number:  { text: "#b45309", bg: "#fef3c7" },
  boolean: { text: "#b5468a", bg: "#fce7f6" },
  date:    { text: "#1d6fa0", bg: "#e0f2fe" },
  json:    { text: "#7c5cbf", bg: "#f5f0ff" },
  text:    { text: "#2d7d5a", bg: "#e8f8ef" }
};

export default function SchemaNode({ data }: Props) {

  const handleDelete = async () => {
    try {
      await deleteEntity(data.id);
      toast.success("Table deleted");
      window.location.reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "14px",
      minWidth: "240px",
      overflow: "hidden",
      border: "1.5px solid #e8dcc8",
      fontFamily: "Inter, sans-serif",
      boxShadow: "0 4px 20px rgba(120,90,50,0.1)",
      transition: "all 0.2s ease"
    }}>

      <Handle type="target" position={Position.Left}
        style={{ background: "#c4782a", width: "10px", height: "10px", border: "2px solid white" }} />

      {/* HEADER */}
      <div style={{
        padding: "12px 14px",
        background: "linear-gradient(135deg, #fde8cc, #fdd8b8)",
        borderBottom: "1.5px solid #e8dcc8",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c4782a", boxShadow: "0 0 6px rgba(196,120,42,0.5)" }} />
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#2c1a0e", letterSpacing: "-0.2px" }}>
            {data.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          style={{ background: "rgba(200,60,60,0.08)", border: "1px solid rgba(200,60,60,0.2)", color: "#c45050", cursor: "pointer", fontSize: "12px", borderRadius: "6px", padding: "3px 8px", transition: "all 0.2s ease", fontFamily: "Inter, sans-serif", lineHeight: 1 }}
          onMouseEnter={(e) => { (e.currentTarget.style.background = "rgba(200,60,60,0.16)"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(200,60,60,0.08)"); }}
        >
          ✕
        </button>
      </div>

      {/* FIELD COUNT */}
      <div style={{ padding: "5px 14px", background: "#fffaf4", borderBottom: "1px solid #f0e8d8" }}>
        <span style={{ color: "#c4a882", fontSize: "10px", fontWeight: "600", letterSpacing: "0.8px" }}>
          {data.fields.length} FIELD{data.fields.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* FIELDS */}
      {data.fields.map((field) => {
        const color = datatypeColor[field.datatype] || { text: "#8a6848", bg: "#f5ece0" };
        return (
          <div key={field.name} style={{ padding: "9px 14px", borderBottom: "1px solid #f5ece0", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fffaf4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {field.primary && <span style={{ fontSize: "11px" }} title="Primary Key">🔑</span>}
              {field.name.endsWith("_id") && !field.primary && <span style={{ fontSize: "11px" }} title="Foreign Key">🔗</span>}
              <span style={{ fontSize: "13px", color: "#3d2e1e", fontWeight: "500" }}>{field.name}</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "600", fontFamily: "JetBrains Mono, monospace", color: color.text, padding: "2px 8px", borderRadius: "4px", background: color.bg }}>
              {field.datatype}
            </span>
          </div>
        );
      })}

      <Handle type="source" position={Position.Right}
        style={{ background: "#e85d8a", width: "10px", height: "10px", border: "2px solid white" }} />
    </div>
  );
}
