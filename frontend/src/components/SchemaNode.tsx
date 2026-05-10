import {
  Handle,
  Position
} from "reactflow";


type Props = {
  data: {
    label: string;
    fields: string[];
  };
};


export default function SchemaNode({
  data
}: Props) {

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
          "0 4px 12px rgba(0,0,0,0.4)"
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
          background: "#1f2937",
          fontWeight: "bold",
          fontSize: "16px",
          borderBottom:
            "1px solid #374151"
        }}
      >
        {data.label}
      </div>

      {/* FIELDS */}
      <div>

        {data.fields.map((field) => (

          <div
            key={field}

            style={{
              padding: "12px 14px",
              borderBottom:
                "1px solid #374151",
              fontSize: "14px"
            }}
          >
            {field}
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