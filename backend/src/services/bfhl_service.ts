// ------------------------------------------------------------------
// bfhl_service.ts  –  Graph-from-edges engine for the SRM challenge
// Validates edge strings, builds trees, detects cycles, etc.
// ------------------------------------------------------------------

// Quick type aliases to keep things readable
type AdjList = Map<string, string[]>;

interface TreeResult {
  root: string;
  has_cycle: boolean;
  tree: Record<string, string[]>;
  depth: number;
}

interface BfhlResponse {
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

// The only pattern we accept: single uppercase letter -> single uppercase letter
const EDGE_PATTERN = /^[A-Z]->[A-Z]$/;

/**
 * Main entry point – takes a raw list of node strings and returns the full response.
 */
export function processBfhl(nodes: string[]): BfhlResponse {
  const validEdges: string[] = [];
  const invalidEntries: string[] = [];
  const duplicateEdges: string[] = [];

  // Keep track of edges we've already seen to catch dupes
  const seenEdges = new Set<string>();

  // --- Step 1: Validate and categorise each input string ---
  for (const entry of nodes) {
    // Check basic format first
    if (!EDGE_PATTERN.test(entry)) {
      // Self-loops, multi-char nonsense, or bad separators all land here
      invalidEntries.push(entry);
      continue;
    }

    // Split on the arrow to grab source and target
    const parts = entry.split("->");
    const source = parts[0];
    const target = parts[1];

    // Self-loops are invalid (e.g. A->A)
    if (source === target) {
      invalidEntries.push(entry);
      continue;
    }

    // Duplicate check – first occurrence is fine, rest are dupes
    if (seenEdges.has(entry)) {
      duplicateEdges.push(entry);
      continue;
    }

    seenEdges.add(entry);
    validEdges.push(entry);
  }

  // --- Step 2: Build the adjacency list with the multi-parent rule ---
  const adjacency: AdjList = new Map();
  // Track which nodes already have a parent assigned
  const parentOf = new Map<string, string>();

  for (const edge of validEdges) {
    const parts = edge.split("->");
    const from = parts[0];
    const to = parts[1];

    // Make sure both nodes exist in the adjacency list
    if (!adjacency.has(from)) adjacency.set(from, []);
    if (!adjacency.has(to)) adjacency.set(to, []);

    // First-parent wins: discarding this edge to maintain tree structure
    if (parentOf.has(to)) {
      continue;
    }

    // Assign parent and add the child
    parentOf.set(to, from);
    adjacency.get(from)!.push(to);
  }

  // --- Step 3: Find connected components ---
  const allNodes = new Set(adjacency.keys());
  const visited = new Set<string>();
  const components: string[][] = [];

  // Simple BFS to group connected nodes together
  for (const node of allNodes) {
    if (visited.has(node)) continue;

    const component: string[] = [];
    const queue: string[] = [node];
    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);

      // Check children
      const children = adjacency.get(current) || [];
      for (const child of children) {
        if (!visited.has(child)) {
          visited.add(child);
          queue.push(child);
        }
      }

      // Also check parent direction (so we don't miss disconnected-looking parents)
      const parent = parentOf.get(current);
      if (parent && !visited.has(parent)) {
        visited.add(parent);
        queue.push(parent);
      }
    }

    components.push(component);
  }

  // --- Step 4: Process each component into a tree result ---
  const hierarchies: TreeResult[] = [];

  for (const component of components) {
    // Roots are nodes that never appear as a child
    const roots: string[] = [];
    for (const node of component) {
      if (!parentOf.has(node)) {
        roots.push(node);
      }
    }

    // Check for cycles using DFS
    const hasCycle = detectCycle(component, adjacency);

    if (hasCycle) {
      // For cyclic groups, pick lex-smallest node as root
      component.sort();
      const cycleRoot = component[0];

      hierarchies.push({
        root: cycleRoot,
        has_cycle: true,
        tree: {},
        depth: 0,
      });
    } else if (roots.length === 0) {
      // No valid root means something weird happened – treat as cyclic
      component.sort();
      hierarchies.push({
        root: component[0],
        has_cycle: true,
        tree: {},
        depth: 0,
      });
    } else {
      // Normal tree – use the first root (should only be one in a valid tree)
      const root = roots.sort()[0];
      const treeObj = buildTreeObject(root, adjacency);
      const depth = calculateDepth(root, adjacency);

      hierarchies.push({
        root: root,
        has_cycle: false,
        tree: treeObj,
        depth: depth,
      });
    }
  }

  // Sort hierarchies by root for consistent output
  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  // --- Step 5: Build the summary ---
  const validTrees = hierarchies.filter((h) => !h.has_cycle);
  let largestRoot: string | null = null;
  let largestDepth = 0;

  for (const tree of validTrees) {
    if (
      tree.depth > largestDepth ||
      (tree.depth === largestDepth &&
        (largestRoot === null || tree.root < largestRoot))
    ) {
      largestDepth = tree.depth;
      largestRoot = tree.root;
    }
  }

  return {
    is_success: true,
    user_id: "prathmesh_24102005",
    email: "pp9136@srmist.edu.in",
    roll_number: "RA2311028010150",
    valid_edges: validEdges,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    hierarchies: hierarchies,
    summary: {
      total_valid_trees: validTrees.length,
      largest_tree_root: largestRoot,
      largest_tree_depth: largestDepth,
    },
  };
}

// ------------------------------------------------------------------
// Helper: Detect cycles in a component using DFS coloring
// White=0 (unvisited), Grey=1 (in progress), Black=2 (done)
// ------------------------------------------------------------------
function detectCycle(
  component: string[],
  adjacency: AdjList
): boolean {
  const color = new Map<string, number>();

  // Initialize all nodes as white
  for (const node of component) {
    color.set(node, 0);
  }

  // Run DFS from each unvisited node in the component
  for (const node of component) {
    if (color.get(node) === 0) {
      if (dfsHasCycle(node, adjacency, color)) {
        return true;
      }
    }
  }

  return false;
}

function dfsHasCycle(
  node: string,
  adjacency: AdjList,
  color: Map<string, number>
): boolean {
  // Mark as grey (currently exploring)
  color.set(node, 1);

  const children = adjacency.get(node) || [];
  for (const child of children) {
    const childColor = color.get(child);

    // Grey child means we've found a back edge = cycle
    if (childColor === 1) return true;

    // Only recurse into unvisited (white) nodes
    if (childColor === 0) {
      if (dfsHasCycle(child, adjacency, color)) return true;
    }
  }

  // Done with this node, mark as black
  color.set(node, 2);
  return false;
}

// ------------------------------------------------------------------
// Helper: Build a nested tree object from root using adjacency list
// ------------------------------------------------------------------
function buildTreeObject(
  root: string,
  adjacency: AdjList
): Record<string, string[]> {
  const tree: Record<string, string[]> = {};
  const queue: string[] = [root];

  // BFS to build the tree representation
  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = adjacency.get(current) || [];

    if (children.length > 0) {
      // Sort children alphabetically for consistency
      tree[current] = [...children].sort();

      for (const child of children) {
        queue.push(child);
      }
    }
  }

  return tree;
}

// ------------------------------------------------------------------
// Helper: Calculate depth (longest root-to-leaf path)
// e.g. A->B->C has depth 3 (counting nodes, not edges)
// ------------------------------------------------------------------
function calculateDepth(root: string, adjacency: AdjList): number {
  const children = adjacency.get(root) || [];

  // Leaf node – depth is 1 (just this node)
  if (children.length === 0) return 1;

  let maxChildDepth = 0;
  for (const child of children) {
    const childDepth = calculateDepth(child, adjacency);
    if (childDepth > maxChildDepth) {
      maxChildDepth = childDepth;
    }
  }

  return 1 + maxChildDepth;
}
