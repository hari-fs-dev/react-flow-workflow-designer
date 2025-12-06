import type React from 'react';
import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeTypes,
} from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { NodeKind, WorkflowNodeData } from '../../types/workflow';
import { workflowTemplates } from '../../data/templates';
import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';
import ApprovalNode from './nodes/ApprovalNode';
import AutomatedNode from './nodes/AutomatedNode';
import EndNode from './nodes/EndNode';

const CanvasInner = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId, addNode, addNodes, addEdges, pushHistory } =
    useWorkflowStore(
      useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        setSelectedNodeId: state.setSelectedNodeId,
        addNode: state.addNode,
        addNodes: state.addNodes,
        addEdges: state.addEdges,
        pushHistory: state.pushHistory,
      }))
    );

  const reactFlowInstance = useReactFlow<WorkflowNodeData>();

  // Memoize nodeTypes to prevent recreation on every render
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      start: StartNode,
      task: TaskNode,
      approval: ApprovalNode,
      automated: AutomatedNode,
      end: EndNode,
    }),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const dropType = event.dataTransfer.getData('application/reactflow/type');

      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (dropType === 'template') {
        const template = workflowTemplates.find((t) => t.id === type);
        
        if (template) {
          const idSuffix = Date.now().toString();
          const idMap = new Map<string, string>();

          // Calculate center of template to offset correctly
          const xs = template.workflow.nodes.map((n) => n.position.x);
          const ys = template.workflow.nodes.map((n) => n.position.y);
          const minX = Math.min(...xs);
          const minY = Math.min(...ys);

          const newNodes = template.workflow.nodes.map((node) => {
            const newId = `${node.id}-${idSuffix}`;
            idMap.set(node.id, newId);
            return {
              ...node,
              id: newId,
              position: {
                x: position.x + (node.position.x - minX),
                y: position.y + (node.position.y - minY),
              },
              selected: false,
            };
          });

          const newEdges = template.workflow.edges.map((edge) => ({
            ...edge,
            id: `${edge.id}-${idSuffix}`,
            source: idMap.get(edge.source)!,
            target: idMap.get(edge.target)!,
            selected: false,
          }));

          addNodes(newNodes);
          addEdges(newEdges);
        }
      } else {
        addNode(type as NodeKind, position);
      }
    },
    [addNode, addNodes, addEdges, reactFlowInstance]
  );

  return (
    <div className="workflow-canvas" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => setSelectedNodeId(undefined)}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        fitView={false}
        style={{ width: '100%', height: '100%' }}
        deleteKeyCode={['Backspace', 'Delete']}
        onNodeDragStop={pushHistory}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

const WorkflowCanvas = () => <CanvasInner />;

export default WorkflowCanvas;
