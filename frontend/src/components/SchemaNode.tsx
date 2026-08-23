import { Handle, Position } from "reactflow";
import { deleteEntity } from "../services/schema.service";
import toast from "react-hot-toast";
import type { Entity, Field } from "../types/schema";

type Props = {
  data: {
    id: string;
    label: string;
    fields: Field[];
    onRefresh?: () => void;
    onEdit?: (entity: Entity) => void;
  };
};

const datatypeColors: Record<string, { text: string; bg: string }> = {
  uuid:    { text: "#818cf8", bg: "rgba(129,140,248,0.12)" },
  string:  { text: "#34d399", bg: "rgba(52,211,153,0.1)"  },
  number:  { text: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },
  boolean: { text: "#f472b6", bg: "rgba(244,114,182,0.1)" },
  date:    { text: "#38bdf8", bg: "rgba(56,189,248,0.1)"  },
  json:    { text: "#c084fc", bg: "rgba(192,132,252,0.1)" },
  text:    { text: "#34d399", bg: "rgba(52,211,153,0.1)"  }
};

export default function SchemaNode({ data }: Props) {

  const handleDelete = async () => {
    try {
      await deleteEntity(data.id);
      toast.success("Table deleted");
      data.onRefresh?.();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed";
      toast.error(message);
    }
  };

  const handleEdit = () => {
    data.onEdit?.({
      id: data.id,
      name: data.label,
      fields: data.fields
    });
  };

  return (
    <div style={{
      background: "#111827",
      borderRadius: "12px",
      minWidth: "220px",
      maxWidth: "280px",
      overflow: "hidden",
      border: "1px solid rgba(148,163,184,0.12)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      transition: "box-shadow 0.2s ease, border-color 0.2s ease"
    }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)");
        (e.currentTarget.style.boxShadow = "0 8px 32px rgba(56,189,248,0.12)");
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)");
        (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)");
      }}
    >

      <Handle type="target" position={Position.Left}
        style={{ background: "#38bdf8", width: "8px", height: "8px", border: "2px solid #111827" }} />

      <div style={{
        padding: "11px 12px",
        background: "linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(129,140,248,0.1) 100%)",
        borderBottom: "1px solid rgba(148,163,184,0.1)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 6px rgba(56,189,248,0.9)", flexShrink: 0 }} />
          <span style={{ fontWeight: "700", fontSize: "13px", color: "#f1f5f9", letterSpacing: "-0.3px" }}>
            {data.label}
          </span>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            title="Edit table"
            style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: "12px", padding: "2px 4px", borderRadius: "4px", transition: "all 0.15s ease", lineHeight: 1 }}
            onMouseEnter={(e) => { (e.currentTarget.style.color = "#38bdf8"); (e.currentTarget.style.background = "rgba(56,189,248,0.1)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.color = "#334155"); (e.currentTarget.style.background = "transparent"); }}
          >
            ✎
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            title="Delete table"
            style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: "13px", padding: "2px 4px", borderRadius: "4px", transition: "all 0.15s ease", lineHeight: 1 }}
            onMouseEnter={(e) => { (e.currentTarget.style.color = "#f87171"); (e.currentTarget.style.background = "rgba(239,68,68,0.1)"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.color = "#334155"); (e.currentTarget.style.background = "transparent"); }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ padding: "4px 12px", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
        <span style={{ color: "#334155", fontSize: "10px", fontWeight: "600", letterSpacing: "1px" }}>
          {data.fields.length} {data.fields.length === 1 ? "FIELD" : "FIELDS"}
        </span>
      </div>

      {data.fields.map((field) => {
        const color = datatypeColors[field.datatype] || { text: "#64748b", bg: "rgba(100,116,139,0.1)" };
        return (
          <div key={field.name}
            style={{ padding: "8px 12px", borderBottom: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.1s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
              {field.primary && <span style={{ fontSize: "10px", flexShrink: 0 }} title="Primary Key">🔑</span>}
              {field.name.endsWith("_id") && !field.primary && <span style={{ fontSize: "10px", flexShrink: 0 }} title="Foreign Key">🔗</span>}
              <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {field.name}
              </span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: "600", fontFamily: "JetBrains Mono, monospace", color: color.text, padding: "2px 7px", borderRadius: "4px", background: color.bg, flexShrink: 0, marginLeft: "8px" }}>
              {field.datatype}
            </span>
          </div>
        );
      })}

      <Handle type="source" position={Position.Right}
        style={{ background: "#818cf8", width: "8px", height: "8px", border: "2px solid #111827" }} />
    </div>
  );
}
