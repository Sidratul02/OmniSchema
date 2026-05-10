import {
  Handle,
  Position
} from "reactflow";

import {
  deleteEntity
} from "../services/schema.service";

import toast from "react-hot-toast";


type Props = {
  data: {
    id: string;

    label: string;

    fields: {
      name: string;
      datatype: string;
      primary?: boolean;
    }[];
  };
};


export default function SchemaNode({
  data
}: Props) {

  const handleDelete =
  async () => {

    try {

      await deleteEntity(
        data.id
      );

      toast.success(
        "Table deleted"
      );

      window.location.reload();

    } catch {

      toast.error(
        "Delete failed"
      );
    }
  };

  return (

    <div
      style={{
        background: "#111827",
        color: "white",
        borderRadius: "12px",
        minWidth: "240px",
        overflow: "hidden",
        border: "1px solid #374151",
        fontFamily: "sans-serif",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.4)",
        transition:
          "all 0.2s ease"
      }}
    >

      {/* TARGET HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
      />

      {/* HEADER */}
      <div
        style={{
          padding: "14px",
          background:
            "linear-gradient(to right, #2563eb, #7c3aed)",
          fontWeight: "bold",
          fontSize: "16px",
          borderBottom:
            "1px solid #374151"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >

          <span>
            {data.label}
          </span>

          <button

            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}

            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🗑
          </button>

        </div>
      </div>

      {/* FIELDS */}
      <div>

      {data.fields.map((field) => (

  <div
    key={field.name}

    style={{
      padding: "12px 14px",
      borderBottom:
        "1px solid #374151",
      fontSize: "14px",
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center"
    }}
  >

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >

      {/* PRIMARY KEY */}
      {
        field.primary && (

          <span>
            🔑
          </span>
        )
      }

      {/* FOREIGN KEY */}
      {
        field.name.endsWith("_id") &&
        !field.primary && (

          <span>
            🔗
          </span>
        )
      }

      <span>
        {field.name}
      </span>

    </div>



    {/* DATATYPE */}
    <span
      style={{
        color: "#9ca3af",
        fontSize: "12px"
      }}
    >
      {field.datatype}
    </span>

  </div>
))}

      </div>

      {/* SOURCE HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
      />

    </div>
  );
}