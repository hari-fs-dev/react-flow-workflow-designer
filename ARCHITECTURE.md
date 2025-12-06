# Architecture Documentation

## System Overview

The HR Workflow Designer is a single-page application (SPA) built with React and React Flow. It follows a component-based architecture with unidirectional data flow and centralized state management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Application                   │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   AppShell   │  │  Zustand     │  │  React Flow │ │  │
│  │  │   (Layout)   │──│   Store      │──│   Canvas    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  │         │                  │                  │        │  │
│  │  ┌──────┴──────────────────┴──────────────────┘       │  │
│  │  │                                                     │  │
│  │  │  Components Layer                                  │  │
│  │  │  ├─ Sidebar (Palette + Templates)                 │  │
│  │  │  ├─ Canvas (Nodes + Edges)                        │  │
│  │  │  ├─ Properties Panel (Forms)                      │  │
│  │  │  └─ Simulation Panel                              │  │
│  │  │                                                     │  │
│  │  └─────────────────────────────────────────────────── │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Mock API Layer                      │  │
│  │  │  ├─ Automation Actions API                       │  │
│  │  │  └─ Workflow Simulation API                      │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Architectural Patterns

### 1. Component-Based Architecture

The application is built using React's component model, with clear separation of concerns:

- **Container Components**: Manage state and business logic
- **Presentational Components**: Focus on UI rendering
- **Custom Hooks**: Encapsulate reusable stateful logic

### 2. Unidirectional Data Flow

```
User Action → Component → Store Action → State Update → Re-render
```

This pattern ensures predictable state changes and makes debugging easier.

### 3. State Management with Zustand

Zustand provides a lightweight, hook-based state management solution:

```typescript
// Store Definition
const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  // ... state and actions
}));

// Component Usage
const nodes = useWorkflowStore((state) => state.nodes);
const addNode = useWorkflowStore((state) => state.addNode);
```

**Benefits:**
- No Provider wrapper needed
- Minimal boilerplate
- Excellent TypeScript support
- Optimized re-renders with selectors

### 4. Custom Node System

React Flow's custom node system is extended with 5 specialized node types:

```typescript
const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
```

Each node type:
- Has its own component
- Has its own data interface
- Has its own configuration form
- Supports validation

## Data Models

### Workflow Graph

```typescript
interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
```

### Node Types

```typescript
type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

type WorkflowNode = Node<WorkflowNodeData> & { type: NodeKind };

type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;
```

### State Structure

```typescript
interface WorkflowStore {
  // Core workflow state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  metadata: WorkflowMetadata;
  
  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  
  // Validation
  nodeErrors: Record<string, string[]>;
  
  // Actions
  setNodes, setEdges, setMetadata
  onNodesChange, onEdgesChange, onConnect
  addNode, updateNodeData, deleteNode
  undo, redo
  exportWorkflow, importWorkflow, clearWorkflow
  setNodeErrors
}
```

## Component Hierarchy

```
App
└── AppShell
    ├── Header
    │   ├── Workflow Title (editable)
    │   └── Toolbar
    │       ├── Import Button
    │       ├── Export Button
    │       ├── Undo Button
    │       ├── Redo Button
    │       ├── Clear Button
    │       └── Stats Display
    │
    ├── Sidebar Left
    │   └── SidebarPalette
    │       ├── Tabs (Nodes / Templates)
    │       ├── Node Palette (drag-and-drop)
    │       └── Template List (click to load)
    │
    ├── Canvas (center)
    │   └── WorkflowCanvas
    │       ├── ReactFlowProvider
    │       ├── ReactFlow
    │       │   ├── Custom Nodes
    │       │   ├── Edges
    │       │   ├── Background
    │       │   ├── Controls
    │       │   └── MiniMap
    │       └── Event Handlers
    │
    └── Sidebar Right
        ├── PropertiesPanel (50% height)
        │   ├── Header (node type indicator)
        │   ├── Delete Button
        │   └── Node Form (dynamic based on type)
        │       ├── StartNodeForm
        │       ├── TaskNodeForm
        │       ├── ApprovalNodeForm
        │       ├── AutomatedNodeForm
        │       └── EndNodeForm
        │
        └── SimulationPanel (50% height)
            ├── Header (Run button)
            ├── Validation Badge
            ├── Error List
            └── Execution Log
```

## Data Flow Patterns

### 1. Node Creation Flow

```
User drags node from palette
  ↓
onDrop event in WorkflowCanvas
  ↓
Calculate drop position
  ↓
Call store.addNode(type, position)
  ↓
Store creates new node with default data
  ↓
Store adds to history
  ↓
Store updates nodes array
  ↓
React Flow re-renders canvas
  ↓
New node appears on canvas
```

### 2. Node Update Flow

```
User edits form field
  ↓
onChange event in form component
  ↓
Call store.updateNodeData(id, updater)
  ↓
Store applies updater function to node data
  ↓
Store updates nodes array (no history)
  ↓
React Flow re-renders affected node
  ↓
Node displays updated data
```

### 3. Workflow Simulation Flow

```
User clicks "Run Test"
  ↓
SimulationPanel calls simulateWorkflow(graph)
  ↓
Mock API validates workflow structure
  ↓
Mock API simulates step-by-step execution
  ↓
Mock API returns results
  ↓
SimulationPanel displays results
  ↓
User sees validation errors and execution log
```

## State Management Strategy

### History Management

The undo/redo system uses a history stack:

```typescript
interface HistoryState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// On significant change:
1. Slice history at current index
2. Push current state to history
3. Update history index
4. Apply new state

// On undo:
1. Move index back
2. Load state from history[index - 1]

// On redo:
1. Move index forward
2. Load state from history[index + 1]
```

**Optimization**: Only significant changes (add, delete, connect) are added to history. Selection and position changes are ignored to prevent history pollution.

### Selective Re-rendering

Zustand selectors are used to prevent unnecessary re-renders:

```typescript
// ❌ Bad: Re-renders on any state change
const store = useWorkflowStore();

// ✅ Good: Only re-renders when nodes change
const nodes = useWorkflowStore((state) => state.nodes);

// ✅ Better: Shallow comparison for multiple values
const { nodes, edges } = useWorkflowStore(
  useShallow((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }))
);
```

## API Layer Architecture

### Mock API Pattern

The mock API simulates real async behavior:

```typescript
export function fetchAutomations(): Promise<AutomationAction[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 300);
  });
}
```

**Benefits:**
- Same interface as real API
- Easy to replace with fetch/axios
- Predictable for testing
- No backend dependency

### API Contracts

#### Automation Actions API

```typescript
interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description?: string;
}

// GET /automations
function fetchAutomations(): Promise<AutomationAction[]>
```

#### Simulation API

```typescript
interface SimulationResponse {
  valid: boolean;
  errors: string[];
  steps: SimulationStep[];
}

// POST /simulate
function simulateWorkflow(workflow: WorkflowGraph): Promise<SimulationResponse>
```

## Validation Strategy

### Workflow Validation Rules

1. **Must have exactly one Start node**
2. **Must have at least one End node**
3. **Start node cannot have incoming edges**
4. **All non-Start nodes must have incoming edges**
5. **No cycles allowed**

### Validation Implementation

```typescript
export function validateWorkflow(graph: WorkflowGraph): string[] {
  const errors: string[] = [];
  
  // Check Start nodes
  const startNodes = graph.nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) errors.push('...');
  if (startNodes.length > 1) errors.push('...');
  
  // Check End nodes
  // Check connectivity
  // Check for cycles (DFS)
  
  return errors;
}
```

## Performance Optimizations

### 1. Memoization

```typescript
// Memoize expensive computations
const nodeTypes = useMemo(() => ({
  start: StartNode,
  task: TaskNode,
  // ...
}), []);
```

### 2. Shallow Comparison

```typescript
// Use shallow comparison for object selectors
const { nodes, edges } = useWorkflowStore(
  useShallow((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }))
);
```

### 3. Debouncing

Form inputs could be debounced to reduce update frequency (not implemented in prototype).

### 4. Lazy Loading

Components could be lazy-loaded for faster initial load (not needed for this size).

## Scalability Considerations

### Adding New Node Types

1. Define data interface in `types/workflow.ts`
2. Create node component in `components/canvas/nodes/`
3. Create form component in `components/forms/`
4. Add to `nodeTypes` object in `WorkflowCanvas.tsx`
5. Add to `PropertiesPanel.tsx` switch statement
6. Update `createDefaultData` in `useWorkflowStore.ts`

### Adding New Features

The architecture supports easy extension:

- **New Panels**: Add to `AppShell.tsx`
- **New Actions**: Add to store interface
- **New Validations**: Extend `validateWorkflow`
- **New APIs**: Add to `api/` directory

## Security Considerations

### Input Validation

- All form inputs are validated
- JSON import is validated before parsing
- Node data is type-checked with TypeScript

### XSS Prevention

- React automatically escapes output
- No `dangerouslySetInnerHTML` used
- User input is never executed as code

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// Example: Validation logic
describe('validateWorkflow', () => {
  it('should require a Start node', () => {
    const graph = { nodes: [], edges: [] };
    const errors = validateWorkflow(graph);
    expect(errors).toContain('Workflow must have a Start node.');
  });
});
```

### Integration Tests (Recommended)

```typescript
// Example: Store actions
describe('useWorkflowStore', () => {
  it('should add node to canvas', () => {
    const { result } = renderHook(() => useWorkflowStore());
    act(() => {
      result.current.addNode('task', { x: 100, y: 100 });
    });
    expect(result.current.nodes).toHaveLength(1);
  });
});
```

### Component Tests (Recommended)

```typescript
// Example: Node rendering
describe('TaskNode', () => {
  it('should display task label', () => {
    const data = { label: 'Test Task', assignee: 'John' };
    render(<TaskNode data={data} id="1" />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## Deployment Considerations

### Build Optimization

```bash
npm run build
```

Vite optimizes:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

### Environment Variables

For production deployment, consider:
- API endpoints
- Feature flags
- Analytics keys

### Browser Support

Targets modern browsers (ES2020+):
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Monitoring & Debugging

### Development Tools

- React DevTools: Component inspection
- Redux DevTools: State inspection (Zustand compatible)
- React Flow DevTools: Canvas debugging

### Error Handling

- Try-catch blocks for async operations
- Error boundaries for component errors (could be added)
- Console logging for debugging

## Future Architecture Improvements

### Backend Integration

```
Frontend (React)
    ↓ HTTP/WebSocket
Backend (Node.js/Python)
    ↓
Database (PostgreSQL/MongoDB)
```

### Real-time Collaboration

```
Frontend A ←→ WebSocket Server ←→ Frontend B
                    ↓
              Operational Transform
                    ↓
              Shared State
```

### Microservices

```
API Gateway
    ├─ Workflow Service
    ├─ User Service
    ├─ Automation Service
    └─ Analytics Service
```

## Conclusion

This architecture provides:

✅ **Scalability**: Easy to add features and node types
✅ **Maintainability**: Clear separation of concerns
✅ **Performance**: Optimized re-renders and state updates
✅ **Type Safety**: Full TypeScript coverage
✅ **Testability**: Modular, testable components
✅ **Developer Experience**: Clear patterns and conventions

The design balances simplicity with extensibility, making it suitable for both prototyping and production development.
