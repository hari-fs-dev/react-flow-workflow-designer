import type { Node, Edge } from 'reactflow';

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface BaseNodeData {
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  metadata: KeyValuePair[];
}

export interface TaskNodeData extends BaseNodeData {
  assignee?: string;
  dueDate?: string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId?: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage?: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData> & { type: NodeKind };
export type WorkflowEdge = Edge;

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface SimulationStep {
  stepIndex: number;
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface SimulationResponse {
  valid: boolean;
  errors: string[];
  steps: SimulationStep[];
}
