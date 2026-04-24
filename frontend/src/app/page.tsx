"use client";

import { useState } from "react";
import { useBfhl } from "../logic/useBfhl";
import { TerminalInput } from "../components/TerminalInput";
import { StatsDashboard } from "../components/StatsDashboard";
import { EdgeClassification } from "../components/EdgeClassification";
import { TreeHierarchy } from "../components/TreeHierarchy";

export default function Home() {
  const [input, setInput] = useState("");
  const { response, loading, error, executeBfhl, clear } = useBfhl();

  const handleClear = () => {
    setInput("");
    clear();
  };

  return (
    <div className="container" style={{ paddingBottom: "40px" }}>
      {/* --- Header --- */}
      <header className="page-header">
        <h1>BFHL Graph Engine</h1>
        <p className="subtitle">
          Parse directed edges → Build trees → Detect cycles
        </p>
        <div className="badge">SRM Engineering Challenge</div>
      </header>

      {/* --- Terminal Input Component --- */}
      <TerminalInput
        input={input}
        setInput={setInput}
        onExecute={() => executeBfhl(input)}
        onClear={handleClear}
        loading={loading}
      />

      {/* --- Error Banner --- */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* --- Response Section --- */}
      {response && (
        <>
          <StatsDashboard
            summary={response.summary}
            totalHierarchies={response.hierarchies.length}
          />

          <EdgeClassification
            validEdges={response.valid_edges}
            invalidEntries={response.invalid_entries}
            duplicateEdges={response.duplicate_edges}
          />

          <TreeHierarchy hierarchies={response.hierarchies} />
        </>
      )}

      {/* --- Footer / Identity --- */}
      <footer className="identity-bar">
        <span>prathmesh_24102005</span> · pp9136@srmist.edu.in ·
        RA2311028010150
      </footer>
    </div>
  );
}
