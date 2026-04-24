export interface TreeResult {
  root: string;
  has_cycle: boolean;
  tree: Record<string, string[]>;
  depth: number;
}

export interface BfhlResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  valid_edges: string[];
  invalid_entries: string[];
  duplicate_edges: string[];
  hierarchies: TreeResult[];
  summary: {
    total_valid_trees: number;
    largest_tree_root: string | null;
    largest_tree_depth: number;
  };
}
