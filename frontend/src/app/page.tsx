"use client";

import { useEffect, useState } from "react";

import ReactFlow, {
  Background,
  Controls
} from "reactflow";

import "reactflow/dist/style.css";

import SchemaNode from "../components/SchemaNode";

import {
  fetchEntities,
  fetchRelations
} from "../services/schema.service";

import type { Entity, Relation } from "../types/schema";

const nodeTypes = { schemaNode: SchemaNode };

export default function Home() {

  const [nodes, setNodes] =
    useState<any[]>([]);

  const [edges, setEdges] =
    useState<any[]>([]);


  useEffect(() => {

    const loadSchema =
    async () => {

      // FETCH ENTITIES
      const entities =
        await fetchEntities();

      // FETCH RELATIONS
      const relations =
        await fetchRelations();


      // GENERATE NODES
      const generatedNodes =
        entities.map(
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

            label: entity.name,

            fields:
              entity.fields.map(
                (field: any) =>
                  field.name
              )
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

          target: relation.to
        }));


      setNodes(generatedNodes);

      setEdges(generatedEdges);
    };

    loadSchema();

  }, []);


  return (

    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#030712"
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
  );
}
