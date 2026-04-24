import { TreeResult } from "../types/bfhl";

interface TreeHierarchyProps {
  hierarchies: TreeResult[];
}

export const TreeHierarchy = ({ hierarchies }: TreeHierarchyProps) => {
  return (
    <>
      <div className="section-title">
        <span className="dot" /> Tree Hierarchies
      </div>
      <div className="tree-grid">
        {hierarchies.map((h, idx) => (
          <div
            key={`tree-${idx}`}
            className={`tree-card ${h.has_cycle ? "cyclic" : ""}`}
          >
            <div className="tree-header">
              <div className="tree-root-label">
                Root: <span>{h.root}</span>
              </div>
              {h.has_cycle ? (
                <span className="tree-tag cycle">⟲ Cycle</span>
              ) : (
                <span className="tree-tag valid">✓ Valid</span>
              )}
            </div>
            {!h.has_cycle && (
              <div className="tree-depth">
                Depth: {h.depth} node{h.depth !== 1 ? "s" : ""}
              </div>
            )}
            <div className="tree-structure">
              {h.has_cycle ? (
                <span style={{ color: "var(--accent-red)" }}>
                  ⚠ Cyclic group — no tree structure available
                </span>
              ) : Object.keys(h.tree).length === 0 ? (
                <span style={{ color: "var(--text-muted)" }}>
                  Leaf node (no children)
                </span>
              ) : (
                Object.entries(h.tree).map(([parent, children]) => (
                  <div key={parent}>
                    <span className="node-parent">{parent}</span>
                    <span className="node-arrow"> → </span>
                    <span className="node-child">
                      [{children.join(", ")}]
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
