# EXPRESS Concepts

This dataset contains the EXPRESS entity type definitions from **Clauses 4 and 5 of ISO 10303-2**, representing the machine-readable data types of the ISO 10303 STEP Library (STEPlib).

## What's Included

7,363 EXPRESS entity concepts extracted from the integrated resources (Clause 4) and application modules (Clause 5) of the ISO 10303 series. These entities define the data structures used for product data representation and exchange across all STEP application protocols.

### Integrated Resources (Clause 4)

The integrated resources provide generic product data constructs that are reusable across multiple application domains. They include schema entities for:

- **Geometry** — points, curves, surfaces, and solids (e.g., `geometry_schema.line`, `geometry_schema.plane`)
- **Topology** — vertices, edges, faces, and their relationships
- **Product structure** — assemblies, components, and configuration management
- **Material properties** — mechanical, thermal, and visual properties
- **Presentation** — visual appearance, styling, and layer assignments
- **Finite element analysis** — mesh definitions, boundary conditions, and results
- **And many more** — covering the full scope of the STEP integrated resources

### Application Modules (Clause 5)

Application modules define modular, domain-specific data exchange requirements. Each module provides an Application Reference Model (ARM) and a Module Interpreted Model (MIM) expressed in EXPRESS. They cover domains including:

- Additive manufacturing
- Analysis and simulation
- Building and construction
- Electrical and electronic design
- Mechanical design
- Process planning
- Systems engineering
- And many more

## How to Use This Dataset

Each EXPRESS concept includes its entity type name, the schema it belongs to, its definition, and relationships to other entities. Use the graph view to visualize inheritance hierarchies and references between entity types. The search feature helps locate specific entities across the 894 schema sections.

## Source

These concepts are extracted from the [ISO 10303 source repository](https://github.com/iso-10303/iso-10303) using the `schemas-smrl-part-2.yml` manifest. They are maintained by ISO/TC 184/SC 4/TF 1.
