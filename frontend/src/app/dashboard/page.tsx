"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, { Background, Controls, BackgroundVariant } from "reactflow";
import "reactflow/dist/style.css";
import SchemaNode from "../../components/SchemaNode";
import toast from "react-hot-toast";
import {
  fetchEntities, fetchRelations, generateSchema, createEntity, createRelation,
  generateSchemaFromAI, updateEntity, deleteRelation
} from "../../services/schema.service";
import { logout, getUser } from "../../services/auth.service";
import type { Entity, Field, Relation } from "../../types/schema";

const nodeTypes = { schemaNode: SchemaNode };

const emptyField = (): Field => ({
  name: "", datatype: "string", primary: false, unique: false, nullable: true
});

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [selectedParser, setSelectedParser] = useState("postgres");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<Field[]>([emptyField()]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editFields, setEditFields] = useState<Field[]>([emptyField()]);
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [fromTable, setFromTable] = useState("");
  const [toTable, setToTable] = useState("");
  const [relationType, setRelationType] = useState("one-to-many");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiLoading, setAILoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    setUser(getUser());
  }, [router]);

  const openEditModal = useCallback((entity: Entity) => {
    setEditingEntity(entity);
    setEditFields(entity.fields.length ? entity.fields.map((f) => ({ ...f })) : [emptyField()]);
    setShowEditModal(true);
  }, []);

  const loadSchema = useCallback(async () => {
    try {
      const fetchedEntities = await fetchEntities();
      const fetchedRelations = await fetchRelations();
      setEntities(fetchedEntities);
      setRelations(fetchedRelations);
      setNodes((prevNodes) => fetchedEntities.map((entity, index) => {
        const existing = prevNodes.find((n) => n.id === entity.id);
        return {
          id: entity.id, type: "schemaNode",
          position: existing?.position || { x: (index % 3) * 320, y: Math.floor(index / 3) * 280 },
          data: {
            id: entity.id,
            label: entity.name,
            fields: entity.fields,
            onRefresh: loadSchema,
            onEdit: openEditModal
          }
        };
      }));
      setEdges(fetchedRelations.map((relation, index) => ({
        id: relation.id || `e-${index}`,
        source: relation.from,
        target: relation.to,
        label: relation.type,
        animated: true,
        style: { stroke: "#38bdf8", strokeWidth: 1.5 }
      })));
    } catch {
      // 401s are handled globally by the axios interceptor (redirects to /login)
    }
  }, [openEditModal]);

  useEffect(() => { loadSchema(); }, [loadSchema]);

  useEffect(() => {
    const load = async () => {
      try {
        const code = await generateSchema(selectedParser);
        setGeneratedCode(code || "");
      } catch {
        setGeneratedCode("");
      }
    };
    load();
  }, [selectedParser, entities.length, relations.length, loadSchema]);

  const handleCreateTable = async () => {
    try {
      if (!tableName) { toast.error("Table name required"); return; }
      await createEntity({ id: tableName.toLowerCase().replace(/\s+/g, "_"), name: tableName, fields });
      toast.success("Table created!");
      setShowModal(false); setTableName(""); setFields([emptyField()]);
      loadSchema();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create table";
      toast.error(message);
    }
  };

  const handleUpdateTable = async () => {
    try {
      if (!editingEntity) return;
      await updateEntity(editingEntity.id, { name: editingEntity.name, fields: editFields });
      toast.success("Table updated!");
      setShowEditModal(false);
      setEditingEntity(null);
      setEditFields([emptyField()]);
      loadSchema();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update table";
      toast.error(message);
    }
  };

  const handleCreateRelation = async () => {
    try {
      if (!fromTable || !toTable) { toast.error("Select both tables"); return; }
      await createRelation({ from: fromTable, to: toTable, type: relationType });
      toast.success("Relation created!");
      setFromTable(""); setToTable(""); setRelationType("one-to-many");
      setShowRelationModal(false);
      loadSchema();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create relation";
      toast.error(message);
    }
  };

  const handleDeleteRelation = async (id: string) => {
    try {
      await deleteRelation(id);
      toast.success("Relation removed");
      loadSchema();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete relation";
      toast.error(message);
    }
  };

  const handleAIGenerate = async () => {
    try {
      if (!aiPrompt) { toast.error("Please enter a prompt"); return; }
      setAILoading(true);
      const res = await generateSchemaFromAI(aiPrompt);
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Schema generated!");
      setShowAIModal(false); setAIPrompt("");
      loadSchema();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "AI generation failed";
      toast.error(message);
    } finally { setAILoading(false); }
  };

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(12px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  };

  const modalBox: React.CSSProperties = {
    width: "520px",
    background: "#0f1520",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "20px", padding: "32px", color: "#e2e8f0",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "rgba(15,21,32,0.8)", color: "#e2e8f0",
    border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px",
    outline: "none", fontSize: "14px",
    fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.2s ease"
  };

  const labelStyle: React.CSSProperties = {
    color: "#475569", fontSize: "11px", fontWeight: "700",
    display: "block", marginBottom: "8px", letterSpacing: "1.2px", textTransform: "uppercase"
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: "#0b0f1a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* NAVBAR */}
        <div className="glass animate-fadeInDown" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: "56px", flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <span className="gradient-text-animated" style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px" }}>OmniSchema</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "500" }}>
                {entities.length} table{entities.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)", borderRadius: "8px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "white" }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>{user?.name || "User"}</span>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "12px" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* CANVAS */}
          <div style={{ flex: 1, position: "relative", background: "#0b0f1a" }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView minZoom={0.3} maxZoom={2}>
              <Background variant={BackgroundVariant.Dots} color="rgba(148,163,184,0.08)" gap={28} size={1.5} />
              <Controls style={{ background: "rgba(15,21,32,0.9)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }} />
            </ReactFlow>

            {/* EMPTY STATE */}
            {entities.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>🗄️</div>
                <p style={{ color: "#334155", fontSize: "15px", fontWeight: "500" }}>No tables yet</p>
                <p style={{ color: "#1e293b", fontSize: "13px", marginTop: "4px" }}>Add a table or generate with AI to get started</p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div style={{ width: "360px", borderLeft: "1px solid rgba(148,163,184,0.08)", background: "#0f1520", display: "flex", flexDirection: "column", flexShrink: 0 }}>

            {/* PANEL HEADER */}
            <div style={{ padding: "18px 18px 0", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f1f5f9", marginBottom: "4px", letterSpacing: "-0.5px" }}>Schema Builder</h2>
              <p style={{ color: "#334155", fontSize: "12px", marginBottom: "16px", fontWeight: "500" }}>Visual database designer</p>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "16px" }}>
                <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: "100%", padding: "10px", fontSize: "13px" }}>
                  + Add Table
                </button>
                <button onClick={() => setShowRelationModal(true)}
                  style={{ width: "100%", padding: "10px", fontSize: "13px", fontWeight: "600", background: "rgba(56,189,248,0.06)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={(e) => { (e.currentTarget.style.background = "rgba(56,189,248,0.12)"); }}
                  onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(56,189,248,0.06)"); }}>
                  + Add Relation
                </button>
                <button onClick={() => setShowAIModal(true)}
                  style={{ width: "100%", padding: "10px", fontSize: "13px", fontWeight: "600", background: "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(192,132,252,0.1))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={(e) => { (e.currentTarget.style.background = "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(192,132,252,0.18))"); }}
                  onMouseLeave={(e) => { (e.currentTarget.style.background = "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(192,132,252,0.1))"); }}>
                  ✨ Generate with AI
                </button>
              </div>
            </div>

            {/* EXPORT SECTION */}
            <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(148,163,184,0.08)", flexShrink: 0 }}>
              <label style={labelStyle}>Export Format</label>

              {/* FORMAT PILLS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "12px" }}>
                {[
                  { id: "postgres", label: "Postgres", color: "#60a5fa" },
                  { id: "mysql",    label: "MySQL",    color: "#34d399" },
                  { id: "sqlite",   label: "SQLite",   color: "#a78bfa" },
                  { id: "prisma",   label: "Prisma",   color: "#f472b6" },
                  { id: "drizzle",  label: "Drizzle",  color: "#fbbf24" },
                  { id: "sequelize",label: "Sequelize",color: "#38bdf8" },
                  { id: "mongoose", label: "Mongoose", color: "#f87171" },
                  { id: "typescript", label: "TypeScript", color: "#818cf8" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedParser(fmt.id)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "all 0.18s ease",
                      border: selectedParser === fmt.id
                        ? `1.5px solid ${fmt.color}`
                        : "1px solid rgba(148,163,184,0.1)",
                      background: selectedParser === fmt.id
                        ? `${fmt.color}18`
                        : "rgba(15,21,32,0.5)",
                      color: selectedParser === fmt.id ? fmt.color : "#475569",
                      boxShadow: selectedParser === fmt.id
                        ? `0 0 12px ${fmt.color}25`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedParser !== fmt.id) {
                        (e.currentTarget.style.borderColor = `${fmt.color}50`);
                        (e.currentTarget.style.color = fmt.color);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedParser !== fmt.id) {
                        (e.currentTarget.style.borderColor = "rgba(148,163,184,0.1)");
                        (e.currentTarget.style.color = "#475569");
                      }
                    }}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <button onClick={() => { navigator.clipboard.writeText(generatedCode); toast.success("Copied to clipboard!"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ width: "100%", padding: "9px", fontSize: "12px", fontWeight: "600", background: copied ? "rgba(34,197,94,0.1)" : "rgba(56,189,248,0.06)", color: copied ? "#22c55e" : "#38bdf8", border: `1px solid ${copied ? "rgba(34,197,94,0.25)" : "rgba(56,189,248,0.15)"}`, borderRadius: "10px", cursor: "pointer", transition: "all 0.3s ease", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {copied ? "✓ Copied!" : "⎘ Copy Generated Code"}
              </button>
            </div>

            {/* CODE PREVIEW */}
            <div style={{ flex: 1, padding: "14px 18px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>Generated Code</label>
              <pre style={{ flex: 1, background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px", overflow: "auto", whiteSpace: "pre-wrap", fontSize: "11px", border: "1px solid rgba(148,163,184,0.08)", lineHeight: "1.8", color: "#64748b", fontFamily: "JetBrains Mono, monospace", margin: 0 }}>
                {generatedCode || "-- Select a format and your\n-- generated code appears here"}
              </pre>
            </div>

          </div>
        </div>
      </div>

      {/* TABLE MODAL */}
      {showModal && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={modalBox} className="animate-scaleIn">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px" }}>🗃️</span>
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>Create Table</h2>
                <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>Define your table name and fields</p>
              </div>
            </div>
            <label style={labelStyle}>Table Name</label>
            <input placeholder="e.g. users, products, orders" value={tableName} onChange={(e) => setTableName(e.target.value)} style={{ ...inputStyle, marginBottom: "18px" }} />
            <label style={labelStyle}>Fields</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
              {fields.map((field, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.08)" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input placeholder="field_name" value={field.name} onChange={(e) => { const u = [...fields]; u[index]!.name = e.target.value; setFields(u); }} style={{ ...inputStyle, flex: 1 }} />
                    <select value={field.datatype} onChange={(e) => { const u = [...fields]; u[index]!.datatype = e.target.value; setFields(u); }} style={{ ...inputStyle, width: "110px", cursor: "pointer" }}>
                      {["string", "uuid", "number", "boolean", "date", "text", "json"].map(t => (
                        <option key={t} style={{ background: "#0f1520" }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[
                      { key: "primary", label: "Primary" },
                      { key: "unique", label: "Unique" },
                      { key: "nullable", label: "Nullable" }
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "11px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(field[key as keyof Field])}
                          onChange={(e) => {
                            const u = [...fields];
                            (u[index] as Field)[key as keyof Field] = e.target.checked as never;
                            setFields(u);
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setFields([...fields, emptyField()])}
              style={{ padding: "7px 14px", background: "transparent", color: "#475569", border: "1px dashed rgba(148,163,184,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"); (e.currentTarget.style.color = "#38bdf8"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)"); (e.currentTarget.style.color = "#475569"); }}>
              + Add Field
            </button>
            <div style={{ display: "flex", gap: "8px", marginTop: "22px" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px" }}>🔗</span>
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>Add Relation</h2>
                <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>Connect two tables together</p>
              </div>
            </div>
            <label style={labelStyle}>From Table</label>
            <select value={fromTable} onChange={(e) => setFromTable(e.target.value)} style={{ ...inputStyle, marginBottom: "14px", cursor: "pointer" }}>
              <option value="" style={{ background: "#0f1520" }}>Select source table...</option>
              {entities.map((e) => <option key={e.id} value={e.id} style={{ background: "#0f1520" }}>{e.name}</option>)}
            </select>
            <label style={labelStyle}>To Table</label>
            <select value={toTable} onChange={(e) => setToTable(e.target.value)} style={{ ...inputStyle, marginBottom: "14px", cursor: "pointer" }}>
              <option value="" style={{ background: "#0f1520" }}>Select target table...</option>
              {entities.map((e) => <option key={e.id} value={e.id} style={{ background: "#0f1520" }}>{e.name}</option>)}
            </select>
            <label style={labelStyle}>Relation Type</label>
            <select value={relationType} onChange={(e) => setRelationType(e.target.value)} style={{ ...inputStyle, marginBottom: "18px", cursor: "pointer" }}>
              <option value="one-to-one" style={{ background: "#0f1520" }}>One to One</option>
              <option value="one-to-many" style={{ background: "#0f1520" }}>One to Many</option>
              <option value="many-to-many" style={{ background: "#0f1520" }}>Many to Many</option>
            </select>
            {relations.length > 0 && (
              <>
                <label style={labelStyle}>Existing Relations</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "18px", maxHeight: "120px", overflowY: "auto" }}>
                  {relations.map((relation) => {
                    const fromName = entities.find((e) => e.id === relation.from)?.name || relation.from;
                    const toName = entities.find((e) => e.id === relation.to)?.name || relation.to;
                    return (
                      <div key={relation.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(0,0,0,0.25)", borderRadius: "8px", fontSize: "12px", color: "#94a3b8" }}>
                        <span>{fromName} → {toName} ({relation.type})</span>
                        {relation.id && (
                          <button onClick={() => handleDeleteRelation(relation.id!)} style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleCreateRelation} className="btn-primary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Create Relation</button>
              <button onClick={() => setShowRelationModal(false)} className="btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TABLE MODAL */}
      {showEditModal && editingEntity && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div style={modalBox} className="animate-scaleIn">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px" }}>✎</span>
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>Edit Table</h2>
                <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>{editingEntity.id}</p>
              </div>
            </div>
            <label style={labelStyle}>Table Name</label>
            <input
              value={editingEntity.name}
              onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
              style={{ ...inputStyle, marginBottom: "18px" }}
            />
            <label style={labelStyle}>Fields</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
              {editFields.map((field, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.08)" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input placeholder="field_name" value={field.name} onChange={(e) => { const u = [...editFields]; u[index]!.name = e.target.value; setEditFields(u); }} style={{ ...inputStyle, flex: 1 }} />
                    <select value={field.datatype} onChange={(e) => { const u = [...editFields]; u[index]!.datatype = e.target.value; setEditFields(u); }} style={{ ...inputStyle, width: "110px", cursor: "pointer" }}>
                      {["string", "uuid", "number", "boolean", "date", "text", "json"].map(t => (
                        <option key={t} style={{ background: "#0f1520" }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[
                      { key: "primary", label: "Primary" },
                      { key: "unique", label: "Unique" },
                      { key: "nullable", label: "Nullable" }
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "11px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(field[key as keyof Field])}
                          onChange={(e) => {
                            const u = [...editFields];
                            (u[index] as Field)[key as keyof Field] = e.target.checked as never;
                            setEditFields(u);
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditFields([...editFields, emptyField()])}
              style={{ padding: "7px 14px", background: "transparent", color: "#475569", border: "1px dashed rgba(148,163,184,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              + Add Field
            </button>
            <div style={{ display: "flex", gap: "8px", marginTop: "22px" }}>
              <button onClick={handleUpdateTable} className="btn-primary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Save Changes</button>
              <button onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* AI MODAL */}
      {showAIModal && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setShowAIModal(false)}>
          <div style={{ ...modalBox, width: "560px" }} className="animate-scaleIn">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(192,132,252,0.2))", border: "1px solid rgba(192,132,252,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                ✨
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>Generate with AI</h2>
                <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>Describe your app, AI builds the schema</p>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(148,163,184,0.08)", margin: "18px 0" }} />

            <label style={labelStyle}>Your Prompt</label>
            <textarea value={aiPrompt} onChange={(e) => setAIPrompt(e.target.value)}
              placeholder={`e.g. "Create an ecommerce database with users, products, orders and reviews"`}
              rows={4} style={{ ...inputStyle, resize: "none", lineHeight: "1.7", marginBottom: "12px" }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {["Ecommerce store", "Blog platform", "Social media app", "School management", "Hospital system"].map((ex) => (
                <button key={ex} onClick={() => setAIPrompt(`Create a ${ex.toLowerCase()} database`)}
                  style={{ padding: "5px 12px", background: "rgba(192,132,252,0.07)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.18)", borderRadius: "999px", fontSize: "12px", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,132,252,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(192,132,252,0.07)")}>
                  {ex}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleAIGenerate} disabled={aiLoading} className="btn-primary" style={{ flex: 1, padding: "12px", fontSize: "14px", opacity: aiLoading ? 0.7 : 1 }}>
                {aiLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Generating...
                  </span>
                ) : "✨ Generate Schema"}
              </button>
              <button onClick={() => setShowAIModal(false)} className="btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
