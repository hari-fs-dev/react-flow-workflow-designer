import { create } from 'zustand';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    type Connection,
    type EdgeChange,
    type NodeChange,
} from 'reactflow';
import type {
    WorkflowNode,
    WorkflowEdge,
    WorkflowNodeData,
    NodeKind,
    StartNodeData,
    TaskNodeData,
    ApprovalNodeData,
    AutomatedNodeData,
    EndNodeData,
    WorkflowGraph,
} from '../types/workflow';

function createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
}

function createDefaultData(type: NodeKind): WorkflowNodeData {
    switch (type) {
        case 'start':
            return {
                label: 'Start',
                description: '',
                metadata: [],
            } as StartNodeData;
        case 'task':
            return {
                label: 'Task',
                description: '',
                assignee: '',
                dueDate: '',
                customFields: [],
            } as TaskNodeData;
        case 'approval':
            return {
                label: 'Approval',
                description: '',
                approverRole: 'Manager',
                autoApproveThreshold: undefined,
            } as ApprovalNodeData;
        case 'automated':
            return {
                label: 'Automated Step',
                description: '',
                actionId: undefined,
                params: {},
            } as AutomatedNodeData;
        case 'end':
            return {
                label: 'End',
                description: '',
                endMessage: 'Workflow complete',
                showSummary: true,
            } as EndNodeData;
        default:
            return { label: 'Node' } as WorkflowNodeData;
    }
}

interface WorkflowMetadata {
    name: string;
    description: string;
    version: string;
}

interface HistoryState {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

interface WorkflowStore {
    // Core state
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    selectedNodeId?: string;
    metadata: WorkflowMetadata;

    // History for undo/redo
    history: HistoryState[];
    historyIndex: number;

    // Node validation errors
    nodeErrors: Record<string, string[]>;

    // Actions
    setSelectedNodeId: (id?: string) => void;
    setNodes: (nodes: WorkflowNode[]) => void;
    setEdges: (edges: WorkflowEdge[]) => void;
    addNodes: (nodes: WorkflowNode[]) => void;
    addEdges: (edges: WorkflowEdge[]) => void;
    pushHistory: () => void;
    loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
    setMetadata: (metadata: Partial<WorkflowMetadata>) => void;

    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    addNode: (type: NodeKind, position: { x: number; y: number }) => WorkflowNode;
    updateNodeData: (id: string, updater: (prev: WorkflowNodeData) => WorkflowNodeData) => void;
    deleteSelected: () => void;
    deleteNode: (id: string) => void;

    // Undo/Redo
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Import/Export
    exportWorkflow: () => string;
    importWorkflow: (json: string) => void;
    clearWorkflow: () => void;

    // Validation
    setNodeErrors: (errors: Record<string, string[]>) => void;
}

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: undefined,
    metadata: {
        name: 'Untitled Workflow',
        description: '',
        version: '1.0.0',
    },
    history: [],
    historyIndex: -1,
    nodeErrors: {},

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    setNodes: (nodes) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            nodes,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    setEdges: (edges) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            edges,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    addNodes: (newNodes) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            nodes: [...current.nodes, ...newNodes],
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    addEdges: (newEdges) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            edges: [...current.edges, ...newEdges],
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    pushHistory: () => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    loadWorkflow: (nodes, edges) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            nodes,
            edges,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    setMetadata: (metadata) => set({ metadata: { ...get().metadata, ...metadata } }),

    onNodesChange: (changes) => {
        const current = get();
        const newNodes = applyNodeChanges(changes, current.nodes) as WorkflowNode[];

        // Only add to history for significant changes (not just selection)
        const hasSignificantChange = changes.some(
            (change) => change.type !== 'select' && change.type !== 'position'
        );

        if (hasSignificantChange) {
            const newHistory = current.history.slice(0, current.historyIndex + 1);
            newHistory.push({ nodes: current.nodes, edges: current.edges });
            if (newHistory.length > MAX_HISTORY) {
                newHistory.shift();
            }
            set({
                nodes: newNodes,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            });
        } else {
            set({ nodes: newNodes });
        }
    },

    onEdgesChange: (changes) => {
        const current = get();
        const newEdges = applyEdgeChanges(changes, current.edges);

        const hasSignificantChange = changes.some((change) => change.type !== 'select');

        if (hasSignificantChange) {
            const newHistory = current.history.slice(0, current.historyIndex + 1);
            newHistory.push({ nodes: current.nodes, edges: current.edges });
            if (newHistory.length > MAX_HISTORY) {
                newHistory.shift();
            }
            set({
                edges: newEdges,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            });
        } else {
            set({ edges: newEdges });
        }
    },

    onConnect: (connection) => {
        const current = get();
        const newEdges = addEdge(connection, current.edges);
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            edges: newEdges,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    addNode: (type, position) => {
        const current = get();
        const newNode: WorkflowNode = {
            id: createId(),
            type,
            position,
            data: createDefaultData(type),
        };
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            nodes: [...current.nodes, newNode],
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
        return newNode;
    },

    updateNodeData: (id, updater) => {
        const current = get();
        set({
            nodes: current.nodes.map((node) =>
                node.id === id ? { ...node, data: updater(node.data) } : node
            ),
        });
    },

    deleteSelected: () => {
        const { selectedNodeId } = get();
        if (selectedNodeId) {
            get().deleteNode(selectedNodeId);
        }
    },

    deleteNode: (id) => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            selectedNodeId: current.selectedNodeId === id ? undefined : current.selectedNodeId,
            nodes: current.nodes.filter((n) => n.id !== id),
            edges: current.edges.filter((e) => e.source !== id && e.target !== id),
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    undo: () => {
        const current = get();
        if (current.historyIndex > 0) {
            const prevState = current.history[current.historyIndex - 1];
            set({
                nodes: prevState.nodes,
                edges: prevState.edges,
                historyIndex: current.historyIndex - 1,
            });
        }
    },

    redo: () => {
        const current = get();
        if (current.historyIndex < current.history.length - 1) {
            const nextState = current.history[current.historyIndex + 1];
            set({
                nodes: nextState.nodes,
                edges: nextState.edges,
                historyIndex: current.historyIndex + 1,
            });
        }
    },

    canUndo: () => {
        const current = get();
        return current.historyIndex > 0;
    },

    canRedo: () => {
        const current = get();
        return current.historyIndex < current.history.length - 1;
    },

    exportWorkflow: () => {
        const current = get();
        const workflow: WorkflowGraph & { metadata: WorkflowMetadata } = {
            metadata: current.metadata,
            nodes: current.nodes,
            edges: current.edges,
        };
        return JSON.stringify(workflow, null, 2);
    },

    importWorkflow: (json: string) => {
        try {
            const workflow = JSON.parse(json) as WorkflowGraph & { metadata?: WorkflowMetadata };
            const current = get();
            const newHistory = current.history.slice(0, current.historyIndex + 1);
            newHistory.push({ nodes: current.nodes, edges: current.edges });
            if (newHistory.length > MAX_HISTORY) {
                newHistory.shift();
            }
            set({
                nodes: workflow.nodes,
                edges: workflow.edges,
                metadata: workflow.metadata || current.metadata,
                history: newHistory,
                historyIndex: newHistory.length - 1,
                selectedNodeId: undefined,
            });
        } catch (error) {
            console.error('Failed to import workflow:', error);
            alert('Failed to import workflow. Please check the JSON format.');
        }
    },

    clearWorkflow: () => {
        const current = get();
        const newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push({ nodes: current.nodes, edges: current.edges });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            nodes: [],
            edges: [],
            selectedNodeId: undefined,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    setNodeErrors: (errors) => set({ nodeErrors: errors }),
}));
