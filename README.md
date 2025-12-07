# HR Workflow Designer

A production-quality, visual workflow designer built with React and React Flow for creating and managing HR workflows such as employee onboarding, leave approval, and document verification.

![HR Workflow Designer](https://img.shields.io/badge/React-19.2.0-blue) ![React Flow](https://img.shields.io/badge/React%20Flow-11.11.4-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)

## 🎯 Overview

This application demonstrates deep knowledge of React, React Flow, and modern front-end architecture through a fully functional HR workflow designer prototype. It showcases:

- **Visual Workflow Design**: Drag-and-drop interface for creating complex workflows
- **Custom Node Types**: 5 specialized node types (Start, Task, Approval, Automated, End)
- **Dynamic Forms**: Configurable properties for each node type with validation
- **Mock API Integration**: Realistic async API layer for automations and simulation
- **Workflow Simulation**: Test workflows with step-by-step execution visualization
- **State Management**: Zustand for efficient, scalable state handling
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Import/Export**: Save and load workflows as JSON
- **Templates**: Pre-configured workflow templates for common HR processes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Features

### 1. Workflow Canvas (React Flow)

- **Drag-and-Drop**: Drag nodes from sidebar onto canvas
- **Connect Nodes**: Create edges between nodes to define workflow flow
- **Select & Edit**: Click nodes to edit their properties
- **Delete**: Use Delete/Backspace key or delete button
- **Zoom & Pan**: Built-in controls and minimap for navigation
- **Auto-validation**: Real-time workflow validation

### 2. Node Types

#### Start Node
- Workflow entry point
- Optional metadata key-value pairs
- No incoming edges allowed

#### Task Node
- Human task assignment
- Configurable: title, description, assignee, due date
- Custom fields support

#### Approval Node
- Manager/HR approval step
- Configurable: approver role, auto-approve threshold
- Supports conditional logic

#### Automated Step Node
- System-triggered actions
- Choose from 10 realistic automation actions
- Dynamic parameter configuration based on action type

#### End Node
- Workflow completion
- Configurable end message and summary flag
- No outgoing edges allowed

### 3. Node Configuration Forms

Each node type has a dedicated configuration panel with:

- **Controlled Components**: All form inputs are fully controlled
- **Real-time Updates**: Changes reflect immediately on canvas
- **Type Safety**: Full TypeScript support
- **Validation**: Input validation and error handling
- **Dynamic Fields**: Add/remove custom fields and parameters

### 4. Mock API Layer
 
 Located in `src/api/` and `src/mocks/`, provides:
 
 > [!NOTE]
 > This project uses **Mock Service Worker (MSW)** to intercept network requests. You will see real `fetch` requests in your browser's Network tab that are intercepted by the Service Worker.

#### Automation Actions API
```typescript
GET /automations
```
Returns 10 realistic HR automation actions:
- Send Email
- Send Onboarding Email
- Create Jira Ticket
- Update HRIS System
- Schedule Meeting
- Generate Offer Letter
- Generate Document
- Assign Equipment
- Create Access Request
- Send Slack Notification

#### Workflow Simulation API
```typescript
POST /simulate
```
Accepts workflow JSON and returns:
- Validation errors
- Step-by-step execution log
- Success/warning/error status for each step

### 5. Workflow Testing / Sandbox

- **Serialize Workflow**: Converts canvas to JSON structure
- **Validate Structure**: Checks for cycles, disconnected nodes, missing start/end
- **Step-by-Step Execution**: Simulates workflow execution
- **Visual Feedback**: Color-coded execution log with icons
- **Error Reporting**: Detailed validation errors with suggestions

### 6. Advanced Features

#### Undo/Redo
- **Keyboard Shortcuts**: Ctrl+Z (undo), Ctrl+Y (redo)
- **History Management**: Tracks up to 50 states
- **Smart History**: Ignores selection/position changes

#### Import/Export
- **Export**: Download workflow as JSON file
- **Import**: Load workflow from JSON file
- **Metadata**: Includes workflow name, description, version

#### Templates
- **Pre-configured Workflows**: 3 ready-to-use templates
  - Employee Onboarding
  - Leave Approval
  - Document Verification
- **One-Click Load**: Replace current workflow with template

#### Keyboard Shortcuts
- `Delete` / `Backspace`: Delete selected node
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+E`: Export workflow
- `Ctrl+I`: Import workflow

## 🏗️ Architecture

### Project Structure

```
src/
├── api/                    # Mock API layer
│   ├── automationApi.ts   # Automation actions API
│   └── simulateApi.ts     # Workflow simulation API
├── components/
│   ├── canvas/            # React Flow canvas components
│   │   ├── nodes/         # Custom node components
│   │   └── WorkflowCanvas.tsx
│   ├── forms/             # Node configuration forms
│   │   ├── StartNodeForm.tsx
│   │   ├── TaskNodeForm.tsx
│   │   ├── ApprovalNodeForm.tsx
│   │   ├── AutomatedNodeForm.tsx
│   │   └── EndNodeForm.tsx
│   └── layout/            # Layout components
│       ├── AppShell.tsx
│       ├── Toolbar.tsx
│       ├── SidebarPalette.tsx
│       ├── PropertiesPanel.tsx
│       └── SimulationPanel.tsx
├── data/                  # Static data
│   └── templates.ts       # Workflow templates
├── hooks/                 # Custom React hooks
│   ├── useWorkflowStore.ts
│   └── useAutomations.ts
├── types/                 # TypeScript type definitions
│   └── workflow.ts
├── utils/                 # Utility functions
│   └── workflowValidation.ts
├── index.css             # Global styles
├── App.tsx               # Root component
└── main.tsx              # Entry point
```

### State Management

**Zustand** is used for global state management:

```typescript
interface WorkflowStore {
  // Core state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  metadata: WorkflowMetadata;
  
  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  
  // Actions
  onNodesChange, onEdgesChange, onConnect
  addNode, updateNodeData, deleteNode
  undo, redo, exportWorkflow, importWorkflow
}
```

### Component Hierarchy

```
App
└── AppShell
    ├── Header (Toolbar)
    ├── SidebarPalette (Node Types + Templates)
    ├── WorkflowCanvas (React Flow)
    │   └── Custom Nodes (Start, Task, Approval, Automated, End)
    └── Sidebar Right
        ├── PropertiesPanel (Node Forms)
        └── SimulationPanel
```

### Data Flow

1. **User Action** → Component
2. **Component** → Zustand Store Action
3. **Store Action** → Update State
4. **State Change** → Re-render Components
5. **Components** → Display Updated UI

### Design Patterns

- **Container/Presentational**: Separation of logic and UI
- **Custom Hooks**: Reusable stateful logic
- **Compound Components**: Related components working together
- **Controlled Components**: Form inputs controlled by React state
- **Factory Pattern**: Node creation with type-specific defaults

## 🎨 Design System

### Color Palette

- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Info**: #3b82f6 (Blue)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Visual Effects

- **Gradients**: Linear gradients for depth
- **Shadows**: Layered shadows for elevation
- **Animations**: Smooth transitions (150-350ms)
- **Glassmorphism**: Backdrop blur effects

## 🧪 Testing Strategy

While automated tests are not implemented in this prototype, the architecture supports:

### Unit Tests
- Validation logic (`workflowValidation.ts`)
- State management (`useWorkflowStore.ts`)
- Utility functions

### Integration Tests
- Form submission and state updates
- API mock responses
- Workflow simulation logic

### Component Tests
- Node rendering
- Form interactions
- Canvas operations

## 🔧 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| React Flow | 11.11.4 | Workflow canvas |
| TypeScript | 5.9.3 | Type safety |
| Zustand | 5.0.9 | State management |
| Vite | 7.2.4 | Build tool |
| ESLint | 9.39.1 | Code linting |

## 📌 Assumptions

The following assumptions were made during the development of this prototype:

1.  **Single Session**: There is no backend persistence. All workflow data is stored in the client's memory and will be lost upon page refresh (unless exported).
2.  **Single User**: The application is designed for a single administrator; no multi-user collaboration or authentication is implemented.
3.  **Happy Path Focus**: While validation exists, the primary focus is on demonstrating the "happy path" of creating and simulating a valid workflow.
4.  **Modern Browser**: The application relies on modern web features and is optimized for current versions of Chrome, Edge, Firefox, and Safari.
5.  **Mock Data Volatility**: API responses are mocked locally (MSW/custom mocks). Any "changes" made via API (like simulating a workflow) do not persist permanently.

## 📝 Design Decisions

### Why Zustand over Redux?
- **Simpler API**: Less boilerplate, easier to learn
- **Better TypeScript**: Native TypeScript support
- **Smaller Bundle**: ~1KB vs ~10KB for Redux
- **Performance**: Optimized re-renders with selectors

### Why React Flow?
- **Purpose-Built**: Designed specifically for node-based UIs
- **Customizable**: Full control over node appearance and behavior
- **Performance**: Handles large graphs efficiently
- **Active Development**: Regular updates and community support

### Why Mock API?
- **Realistic Behavior**: Simulates async operations
- **Easy Replacement**: Same interface as real API
- **No Backend Required**: Fully functional without server
- **Testable**: Predictable responses for testing

### Component Structure
- **Separation of Concerns**: Canvas, forms, and layout are independent
- **Reusability**: Forms can be used in different contexts
- **Scalability**: Easy to add new node types
- **Maintainability**: Clear boundaries between components

## 🗺️ Requirement Mapping

| Requirement | Implementation Location | Status |
|-------------|-------------------------|--------|
| **React App (Vite + TS)** | `vite.config.ts`, `tsconfig.json` | ✅ Implemented |
| **Canvas (React Flow)** | `src/components/canvas/WorkflowCanvas.tsx` | ✅ Implemented |
| **Node Types** | `src/components/canvas/nodes/` | ✅ Implemented |
| - Start Node | `StartNode.tsx` | ✅ Implemented |
| - Task Node | `TaskNode.tsx` | ✅ Implemented |
| - Approval Node | `ApprovalNode.tsx` | ✅ Implemented |
| - Automated Node | `AutomatedNode.tsx` | ✅ Implemented |
| - End Node | `EndNode.tsx` | ✅ Implemented |
| **Actions** | `useWorkflowStore.ts` | ✅ Implemented |
| - Drag & Drop | `WorkflowCanvas.tsx` (onDrop) | ✅ Implemented |
| - Connect Nodes | `useWorkflowStore.ts` (onConnect) | ✅ Implemented |
| - Select/Edit | `PropertiesPanel.tsx` | ✅ Implemented |
| - Delete | `useWorkflowStore.ts` (deleteNode) | ✅ Implemented |
| **Node Configuration Forms** | `src/components/forms/` | ✅ Implemented |
| - Start (Title, Metadata) | `StartNodeForm.tsx` | ✅ Implemented |
| - Task (Title, Desc, Assignee, Due, Custom) | `TaskNodeForm.tsx` | ✅ Implemented |
| - Approval (Role, Threshold) | `ApprovalNodeForm.tsx` | ✅ Implemented |
| - Automated (Action, Dynamic Params) | `AutomatedNodeForm.tsx` | ✅ Implemented |
| - End (Message, Summary) | `EndNodeForm.tsx` | ✅ Implemented |
| **Mock API Layer** | `src/api/` | ✅ Implemented |
| - GET /automations | `automationApi.ts` (with delays/logs) | ✅ Implemented |
| - POST /simulate | `simulateApi.ts` (with delays/logs) | ✅ Implemented |
| **Simulation Panel** | `src/components/layout/SimulationPanel.tsx` | ✅ Implemented |
| - Run Simulation | Calls `simulateWorkflow` | ✅ Implemented |
| - Validation (Start, Cycles, etc.) | `src/utils/workflowValidation.ts` | ✅ Implemented |
| - Execution Log | `SimulationPanel.tsx` | ✅ Implemented |

## 🚧 Future Enhancements

If I had more time, I would implement:

1.  **Visual Validation Badges**: Show error icons directly on nodes that have missing required fields or connection errors.
2.  **Auto Layout**: Implement Dagre or Elkjs to automatically arrange nodes in a clean tree structure.
3.  **Better Styling / Theme**: Refine the UI with a more polished design system, dark mode toggle, and smoother animations.
4.  **Undo/Redo**: (Already implemented! See `useWorkflowStore.ts`)
5.  **Export/Import JSON**: (Already implemented! See Toolbar)



## 📊 Performance Considerations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Shallow Comparison**: Zustand selectors prevent unnecessary re-renders
- **Debouncing**: Form inputs debounced to reduce updates
- **Virtual Scrolling**: For large node lists (if needed)

## 🐛 Known Limitations

- **No Backend**: All data is client-side only
- **No Authentication**: No user management
- **Limited Validation**: Basic validation only
- **No Tests**: Automated tests not implemented
- **Browser Support**: Modern browsers only (ES2020+)

## 📄 License

This is a prototype for interview assessment purposes.

## 👤 Author

Created as part of an interview assessment for a Senior Front-End Engineer position.

## 🙏 Acknowledgments

- React Flow team for the excellent library
- React team for the framework
- Zustand team for the state management solution

---

**Note**: This is a time-boxed prototype (4-6 hours) focusing on architectural clarity and working functionality. It demonstrates proficiency in React, React Flow, TypeScript, and modern front-end development practices.
