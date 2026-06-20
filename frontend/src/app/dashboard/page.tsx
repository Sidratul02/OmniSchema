"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import SchemaNode from "../../components/SchemaNode";
import toast from "react-hot-toast";
import { fetchEntities, fetchRelations, generateSchema, createEntity, createRelation } from "../../services/schema.service";
import { logout, getUser } from "../../services/auth.service";

const nodeTypes = { schemaNode: SchemaNode };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [selectedParser, setSelectedParser] = useState("postgres");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState([{ name: "", datatype: "string" }]);
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [fromTable, setFromTable] = useState("");
  const [toTable, setToTable] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    setUser(getUser());
  }, []);

  const loadSchema = async () => {
    const fetchedEntities = await fetchEntities();
    setEntities(fetchedEntities);
    const relations = await fetchRelations();
    setNodes(fetchedEntities.map((entity: any, index: number) => ({
      id: entity.id, type: "schemaNode",
      position: { x: index * 300, y: 120 },
      data: { id: entity.id, label: entity.name, fields: entity.fields }
    })));
    setEdges(relations.map((relation: any, index: number) => ({
      id: `e-${index}`, source: relation.from, target: relation.to,
      animated: true, style: { stroke: "#c4a882", strokeWidth: 2 }
    })));
  };

  useEffect(() => { loadSchema(); }, []);

  useEffect(() => {
    const load = async () => {
      const generated = await generateSchema(selectedParser);
      setGeneratedCode(generated.sql || generated.code);
    };
    load();
  }, [selectedParser]);

  const handleCreateTable = async () => {
    try {
      if (!tableName) { toast.error("Table name required"); return; }
      await createEntity({ id: tableName.toLowerCase().replace(/\s+/g, "_"), name: tableName, fields });
      toast.success("Table created!");
      setShowModal(false); setTableName(""); setFields([{ name: "", datatype: "string" }]);
      loadSchema();
    } catch { toast.error("Failed to create table"); }
  };

  const handleCreateRelation = async () => {
    try {
      if (!fromTable || !toTable) { toast.error("Select both tables"); return; }
      await createRelation({ from: fromTable, to: toTable, type: "one-to-many" });
      toast.success("Relation created!");
      setShowRelationModal(false); setFromTable(""); setToTable("");
      loadSchema();
    } catch { toast.error("Failed to create relation"); }
  };

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(100,70,30,0.15)",
    backdropFilter: "blur(8px)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 1000
  };

  const modalBox: React.CSSProperties = {
    width: "500px", background: "#fffcf8",
    border: "1.5px solid #e8dcc8", borderRadius: "20px",
    padding: "32px", color: "#3d2e1e",
    boxShadow: "0 20px 60px rgba(120,90,50,0.15)"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "#fffaf4", color: "#3d2e1e",
    border: "1.5px solid #e0d0b8", borderRadius: "10px",
    outline: "none", fontSize: "14px",
    fontFamily: "Inter, sans-serif", boxSizing: "border-box",
    transition: "border-color 0.2s ease"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: "#fdf6ee", fontFamily: "Inter, sans-serif" }}>

        {/* NAVBAR */}
        <div className="glass animate-fadeInDown" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 24px", borderBottom: "1.5px solid #e8dcc8", flexShrink: 0, zIndex: 10
        }}>
          <span className="gradient-text" style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            OmniSchema
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "#fdeee0", border: "1.5px solid #e8dcc8", borderRadius: "10px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #c4782a, #e85d8a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white" }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span style={{ color: "#8a6848", fontSize: "13px", fontWeight: "500" }}>{user?.name || "User"}</span>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} className="btn-secondary" style={{ padding: "7px 16px", fontSize: "13px" }}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* CANVAS */}
          <div style={{ flex: 1, background: "#fdf6ee" }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
              <Background color="#e8dcc8" gap={24} />
              <Controls style={{ background: "white", border: "1.5px solid #e8dcc8", borderRadius: "10px" }} />
            </ReactFlow>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ width: "380px", borderLeft: "1.5px solid #e8dcc8", background: "white", padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column" }}>

            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#2c1a0e", marginBottom: "3px" }}>Schema Builder</h2>
              <p style={{ color: "#d9c9b0", fontSize: "12px" }}>{entities.length} table{entities.length !== 1 ? "s" : ""} in your schema</p>
            </div>

            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: "100%", padding: "11px", fontSize: "14px", marginBottom: "8px" }}>
              + Add Table
            </button>

            <button onClick={() => setShowRelationModal(true)} style={{
              width: "100%", padding: "11px", fontSize: "14px", fontWeight: "600",
              background: "#fdf0e0", color: "#a07840", border: "1.5px solid #e8dcc8",
              borderRadius: "12px", cursor: "pointer", marginBottom: "18px",
              transition: "all 0.2s ease", fontFamily: "Inter, sans-serif"
            }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = "#fde8cc"); (e.currentTarget.style.borderColor = "#c4a882"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = "#fdf0e0"); (e.currentTarget.style.borderColor = "#e8dcc8"); }}
            >
              + Add Relation
            </button>

            <div style={{ height: "1px", background: "#f5ece0", marginBottom: "18px" }} />

            <label style={{ color: "#b09070", fontSize: "11px", fontWeight: "700", marginBottom: "7px", display: "block", letterSpacing: "1px" }}>EXPORT FORMAT</label>
            <select value={selectedParser} onChange={(e) => setSelectedParser(e.target.value)}
              style={{ ...inputStyle, marginBottom: "10px", cursor: "pointer" }}>
              {["postgres", "mysql", "sqlite", "prisma", "drizzle", "sequelize"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <button onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              toast.success("Copied to clipboard!");
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} style={{
              width: "100%", padding: "10px", fontSize: "13px", fontWeight: "600",
              background: copied ? "#f0fdf4" : "#fdf0e0",
              color: copied ? "#16a34a" : "#a07840",
              border: `1.5px solid ${copied ? "#bbf7d0" : "#e8dcc8"}`,
              borderRadius: "10px", cursor: "pointer", marginBottom: "14px",
              transition: "all 0.3s ease", fontFamily: "Inter, sans-serif"
            }}>
              {copied ? "✓ Copied!" : "⎘ Copy Code"}
            </button>

            <pre style={{
              flex: 1, background: "#fffaf4", padding: "14px", borderRadius: "12px",
              overflow: "auto", whiteSpace: "pre-wrap", fontSize: "11.5px",
              border: "1.5px solid #e8dcc8", lineHeight: "1.7", minHeight: "380px",
              color: "#8a6848", fontFamily: "JetBrains Mono, monospace"
            }}>
              {generatedCode || "-- Your schema will appear here"}
            </pre>
          </div>
        </div>
      </div>

      {/* TABLE MODAL */}
      {showModal && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={modalBox} className="animate-scaleIn">
            <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "20px" }}>Create Table</h2>
            <label style={{ color: "#b09070", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "7px", letterSpacing: "1px" }}>TABLE NAME</label>
            <input placeholder="e.g. users, products" value={tableName} onChange={(e) => setTableName(e.target.value)} style={{ ...inputStyle, marginBottom: "18px" }} />
            <label style={{ color: "#b09070", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "9px", letterSpacing: "1px" }}>FIELDS</label>
            {fields.map((field, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input placeholder="field_name" value={field.name} onChange={(e) => { const u = [...fields]; u[index]!.name = e.target.value; setFields(u); }} style={{ ...inputStyle, flex: 1 }} />
                <select value={field.datatype} onChange={(e) => { const u = [...fields]; u[index]!.datatype = e.target.value; setFields(u); }} style={{ ...inputStyle, width: "120px", cursor: "pointer" }}>
                  <option>string</option><option>uuid</option><option>number</option><option>boolean</option>
                </select>
              </div>
            ))}
            <button onClick={() => setFields([...fields, { name: "", datatype: "string" }])} style={{ marginTop: "8px", padding: "8px 14px", background: "transparent", color: "#b09070", border: "1.5px dashed #e8dcc8", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Inter, sans-serif", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "#c4a882"); (e.currentTarget.style.color = "#8a6848"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "#e8dcc8"); (e.currentTarget.style.color = "#b09070"); }}>
              + Add Field
            </button>
            <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
              <button onClick={handleCreateTable} className="btn-primary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Create Table</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* RELATION MODAL */}
      {showRelationModal && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setShowRelationModal(false)}>
          <div style={modalBox} className="animate-scaleIn">
            <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "20px" }}>Add Relation</h2>
            <label style={{ color: "#b09070", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "7px", letterSpacing: "1px" }}>FROM TABLE</label>
            <select value={fromTable} onChange={(e) => setFromTable(e.target.value)} style={{ ...inputStyle, marginBottom: "14px", cursor: "pointer" }}>
              <option value="">Select table...</option>
              {entities.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <label style={{ color: "#b09070", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "7px", letterSpacing: "1px" }}>TO TABLE</label>
            <select value={toTable} onChange={(e) => setToTable(e.target.value)} style={{ ...inputStyle, marginBottom: "24px", cursor: "pointer" }}>
              <option value="">Select table...</option>
              {entities.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleCreateRelation} className="btn-primary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Create Relation</button>
              <button onClick={() => setShowRelationModal(false)} className="btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
