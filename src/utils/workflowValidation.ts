import type { WorkflowGraph } from '../types/workflow';

export function validateWorkflow(graph: WorkflowGraph): string[] {
  const errors: string[] = [];

  const startNodes = graph.nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node.');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow must have exactly one Start node.');
  }

  const endNodes = graph.nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow should have at least one End node.');
  }

  const incomingCount: Record<string, number> = {};
  graph.nodes.forEach((n) => {
    incomingCount[n.id] = 0;
  });
  graph.edges.forEach((e) => {
    if (incomingCount[e.target] !== undefined) {
      incomingCount[e.target] += 1;
    }
  });

  graph.nodes.forEach((n) => {
    const label = (n.data as any).label ?? n.id;
    if (n.type === 'start' && incomingCount[n.id] > 0) {
      errors.push('Start node cannot have incoming edges.');
    }
    if (n.type !== 'start' && incomingCount[n.id] === 0) {
      errors.push(`Node "${label}" has no incoming connection.`);
    }
  });

  const adjacency: Record<string, string[]> = {};
  graph.edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const visited = new Set<string>();
  const stack = new Set<string>();

  const dfs = (id: string): boolean => {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    for (const next of adjacency[id] || []) {
      if (dfs(next)) return true;
    }
    stack.delete(id);
    return false;
  };

  const hasCycle = graph.nodes.some((n) => dfs(n.id));
  if (hasCycle) {
    errors.push('Cycle detected in workflow.');
  }

  return errors;
}
