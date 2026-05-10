"use client";

import {
  useEffect,
  useState
} from "react";

import ReactFlow, {
  Background,
  Controls
} from "reactflow";

import "reactflow/dist/style.css";

import SchemaNode
from "../components/SchemaNode";

import {
  fetchEntities,
  fetchRelations,
  generateSchema,
  createEntity,
  createRelation
} from "../services/schema.service";

import toast
from "react-hot-toast";

const nodeTypes = {
  schemaNode: SchemaNode
};


export default function Home() {

  const [nodes, setNodes] =
    useState<any[]>([]);

  const [edges, setEdges] =
    useState<any[]>([]);

  const [entities,
  setEntities] =
    useState<any[]>([]);

  const [selectedParser,
  setSelectedParser] =
    useState("postgres");

  const [generatedCode,
  setGeneratedCode] =
    useState("");

  const [copied, setCopied] =
    useState(false);


  // TABLE MODAL
  const [showModal,
  setShowModal] =
    useState(false);

  const [tableName,
  setTableName] =
    useState("");

  const [fields,
  setFields] =
    useState([
      {
        name: "",
        datatype: "string"
      }
    ]);


  // RELATION MODAL
  const [showRelationModal,
  setShowRelationModal] =
    useState(false);

  const [fromTable,
  setFromTable] =
    useState("");

  const [toTable,
  setToTable] =
    useState("");



  // LOAD SCHEMA
  const loadSchema =
  async () => {

    // FETCH ENTITIES
    const fetchedEntities =
      await fetchEntities();

    setEntities(fetchedEntities);

    // FETCH RELATIONS
    const relations =
      await fetchRelations();


    // GENERATE NODES
    const generatedNodes =
      fetchedEntities.map(
        (
          entity: any,
          index: number
        ) => ({

        id: entity.id,

        type: "schemaNode",

        position: {
          x: index * 350,
          y: 150
        },

        data: {

          id: entity.id,

          label: entity.name,

          fields: entity.fields
        }

      }));


    // GENERATE EDGES
    const generatedEdges =
      relations.map(
        (
          relation: any,
          index: number
        ) => ({

        id: `e-${index}`,

        source: relation.from,

        target: relation.to,

        animated: true,

        style: {
          stroke: "#ffffff",
          strokeWidth: 2
        }

      }));


    setNodes(generatedNodes);

    setEdges(generatedEdges);
  };



  useEffect(() => {

    loadSchema();

  }, []);




  // LOAD GENERATED CODE
  useEffect(() => {

    const loadGenerated =
    async () => {

      const generated =
        await generateSchema(
          selectedParser
        );

      setGeneratedCode(
        generated.sql ||
        generated.code
      );
    };

    loadGenerated();

  }, [selectedParser]);




  // CREATE TABLE
  const handleCreateTable =
  async () => {

    try {

      if (!tableName) {
        toast.error("Table name required");
        return;
      }

      await createEntity({
        id: tableName.toLowerCase(),
        name: tableName,
        fields
      });

      toast.success("Table created successfully");

      setShowModal(false);
      setTableName("");
      setFields([{ name: "", datatype: "string" }]);

      loadSchema();

    } catch (error) {
      toast.error("Failed to create table");
    }
  };




  // CREATE RELATION
  const handleCreateRelation =
  async () => {

    try {

      if (!fromTable || !toTable) {
        toast.error("Select both tables");
        return;
      }

      await createRelation({
        from: fromTable,
        to: toTable,
        type: "one-to-many"
      });

      toast.success("Relation created successfully");

      setShowRelationModal(false);
      setFromTable("");
      setToTable("");

      loadSchema();

    } catch (error) {
      toast.error("Failed to create relation");
    }
  };




  return (

    <>

    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(to bottom, #020617, #111827)"
      }}
    >

      {/* LEFT PANEL */}
      <div
        style={{
          flex: 1
        }}
      >

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
        >

          <Background />

          <Controls />

        </ReactFlow>

      </div>



      {/* RIGHT PANEL */}
      <div
        style={{
          width: "420px",
          borderLeft:
            "1px solid #1f2937",
          background: "#111827",
          padding: "20px",
          color: "white",
          overflow: "auto"
        }}
      >

        <h2
          style={{
            marginBottom: "10px",
            fontSize: "24px",
            fontWeight: "bold"
          }}
        >
          OmniSchema
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "20px"
          }}
        >
          Universal Database Schema Generator
        </p>



        {/* ADD TABLE BUTTON */}
        <button

          onClick={() =>
            setShowModal(true)
          }

          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "16px"
          }}
        >
          + Add Table
        </button>



        {/* ADD RELATION BUTTON */}
        <button

          onClick={() =>
            setShowRelationModal(true)
          }

          style={{
            width: "100%",
            padding: "12px",
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          + Add Relation
        </button>



        {/* LABEL */}
        <p
          style={{
            marginBottom: "8px",
            color: "#9ca3af",
            fontSize: "14px"
          }}
        >
          Select Schema Format
        </p>



        {/* DROPDOWN */}
        <select

          value={selectedParser}

          onChange={(e) =>
            setSelectedParser(
              e.target.value
            )
          }

          style={{
            width: "100%",
            padding: "12px",
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px"
          }}
        >

          <option value="postgres">
            postgres
          </option>

          <option value="mysql">
            mysql
          </option>

          <option value="sqlite">
            sqlite
          </option>

          <option value="prisma">
            prisma
          </option>

          <option value="drizzle">
            drizzle
          </option>

          <option value="sequelize">
            sequelize
          </option>

        </select>



        {/* COPY BUTTON */}
        <button

          onClick={() => {

            navigator.clipboard.writeText(
              generatedCode
            );
            toast.success(
  "Schema copied"
);

            setCopied(true);

            setTimeout(() => {
              setCopied(false);
            }, 2000);

          }}

          style={{
            marginTop: "16px",
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%"
          }}
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>



        {/* GENERATED CODE */}
        <pre
          style={{
            marginTop: "20px",
            background: "#030712",
            padding: "16px",
            borderRadius: "10px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontSize: "13px",
            border: "1px solid #1f2937",
            lineHeight: "1.6",
            minHeight: "500px"
          }}
        >
          {generatedCode}
        </pre>

      </div>

    </div>




    {/* TABLE MODAL */}
    {
      showModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >

          <div
            style={{
              width: "500px",
              background: "#111827",
              padding: "24px",
              borderRadius: "12px",
              color: "white"
            }}
          >

            <h2>Create Table</h2>


            {/* TABLE NAME */}
            <input

              placeholder="Table Name"

              value={tableName}

              onChange={(e) =>
                setTableName(
                  e.target.value
                )
              }

              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#1f2937",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "8px"
              }}
            />


            {/* FIELDS */}
            {
              fields.map(
                (field, index) => (

                <div
                  key={index}

                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "16px"
                  }}
                >

                  <input

                    placeholder="Field Name"

                    value={field.name}

                    onChange={(e) => {

                      const updated =
                        [...fields];

                      updated[index].name =
                        e.target.value;

                      setFields(updated);
                    }}

                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#1f2937",
                      color: "white",
                      border:
                        "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  />



                  <select

                    value={field.datatype}

                    onChange={(e) => {

                      const updated =
                        [...fields];

                      updated[index].datatype =
                        e.target.value;

                      setFields(updated);
                    }}

                    style={{
                      padding: "12px",
                      background: "#1f2937",
                      color: "white",
                      border:
                        "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  >

                    <option>string</option>
                    <option>uuid</option>
                    <option>number</option>
                    <option>boolean</option>

                  </select>

                </div>
              ))
            }



            {/* ADD FIELD */}
            <button

              onClick={() =>

                setFields([
                  ...fields,

                  {
                    name: "",
                    datatype: "string"
                  }
                ])
              }

              style={{
                marginTop: "20px",
                padding: "10px 16px",
                background: "#374151",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              + Add Field
            </button>



            {/* ACTION BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "24px"
              }}
            >

              <button

                onClick={handleCreateTable}

                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Create Table
              </button>



              <button

                onClick={() =>
                  setShowModal(false)
                }

                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )
    }




    {/* RELATION MODAL */}
    {
      showRelationModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >

          <div
            style={{
              width: "500px",
              background: "#111827",
              padding: "24px",
              borderRadius: "12px",
              color: "white"
            }}
          >

            <h2>Add Relation</h2>



            {/* FROM TABLE */}
            <select

              value={fromTable}

              onChange={(e) =>
                setFromTable(
                  e.target.value
                )
              }

              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#1f2937",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "8px"
              }}
            >

              <option value="">
                Select From Table
              </option>

              {
                entities.map(
                  (entity: any) => (

                  <option
                    key={entity.id}
                    value={entity.id}
                  >
                    {entity.name}
                  </option>
                ))
              }

            </select>



            {/* TO TABLE */}
            <select

              value={toTable}

              onChange={(e) =>
                setToTable(
                  e.target.value
                )
              }

              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#1f2937",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "8px"
              }}
            >

              <option value="">
                Select To Table
              </option>

              {
                entities.map(
                  (entity: any) => (

                  <option
                    key={entity.id}
                    value={entity.id}
                  >
                    {entity.name}
                  </option>
                ))
              }

            </select>



            {/* RELATION BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "24px"
              }}
            >

              <button

                onClick={handleCreateRelation}

                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Create Relation
              </button>



              <button

                onClick={() =>
                  setShowRelationModal(false)
                }

                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )
    }

    </>
  );
}