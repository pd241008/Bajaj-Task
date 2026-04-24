import { BfhlResponse } from "../types/bfhl";

interface StatsDashboardProps {
  summary: BfhlResponse["summary"];
  totalHierarchies: number;
}

export const StatsDashboard = ({ summary, totalHierarchies }: StatsDashboardProps) => {
  return (
    <>
      <div className="section-title">
        <span className="dot" /> Summary Dashboard
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Valid Trees</div>
          <div className="stat-value">{summary.total_valid_trees}</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-label">Largest Tree Root</div>
          <div className="stat-value">{summary.largest_tree_root || "—"}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Max Depth</div>
          <div className="stat-value">{summary.largest_tree_depth}</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Total Hierarchies</div>
          <div className="stat-value">{totalHierarchies}</div>
        </div>
      </div>
    </>
  );
};
