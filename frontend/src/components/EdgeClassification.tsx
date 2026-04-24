interface EdgeClassificationProps {
  validEdges: string[];
  invalidEntries: string[];
  duplicateEdges: string[];
}

export const EdgeClassification = ({
  validEdges,
  invalidEntries,
  duplicateEdges,
}: EdgeClassificationProps) => {
  return (
    <>
      <div className="section-title">
        <span className="dot" /> Edge Classification
      </div>
      <div className="edge-section">
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-green)", fontWeight: 700 }}>
            Valid Edges ({validEdges.length})
          </span>
          <div className="edge-list">
            {validEdges.length > 0 ? (
              validEdges.map((e, i) => (
                <span key={`v-${i}`} className="edge-chip valid">
                  {e}
                </span>
              ))
            ) : (
              <span className="edge-empty">None</span>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-red)", fontWeight: 700 }}>
            Invalid Entries ({invalidEntries.length})
          </span>
          <div className="edge-list">
            {invalidEntries.length > 0 ? (
              invalidEntries.map((e, i) => (
                <span key={`i-${i}`} className="edge-chip invalid">
                  {e}
                </span>
              ))
            ) : (
              <span className="edge-empty">None</span>
            )}
          </div>
        </div>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
            Duplicate Edges ({duplicateEdges.length})
          </span>
          <div className="edge-list">
            {duplicateEdges.length > 0 ? (
              duplicateEdges.map((e, i) => (
                <span key={`d-${i}`} className="edge-chip duplicate">
                  {e}
                </span>
              ))
            ) : (
              <span className="edge-empty">None</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
