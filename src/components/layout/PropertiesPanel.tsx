import type { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import StartNodeForm from '../forms/StartNodeForm';
import TaskNodeForm from '../forms/TaskNodeForm';
import ApprovalNodeForm from '../forms/ApprovalNodeForm';
import AutomatedNodeForm from '../forms/AutomatedNodeForm';
import EndNodeForm from '../forms/EndNodeForm';
import type { WorkflowNode } from '../../types/workflow';

const nodeTypeIcons: Record<string, string> = {
    start: '▶️',
    task: '📋',
    approval: '✅',
    automated: '⚙️',
    end: '🏁',
};

const nodeTypeLabels: Record<string, string> = {
    start: 'Start Node',
    task: 'Task Node',
    approval: 'Approval Node',
    automated: 'Automated Node',
    end: 'End Node',
};

const PropertiesPanel: FC = () => {
    const { selectedNodeId, nodes, deleteSelected } = useWorkflowStore(
        useShallow((state) => ({
            selectedNodeId: state.selectedNodeId,
            nodes: state.nodes,
            deleteSelected: state.deleteSelected,
        }))
    );

    const node: WorkflowNode | undefined = nodes.find((n) => n.id === selectedNodeId);

    return (
        <div className="panel" style={{ height: '50%' }}>
            <div className="panel-header">
                <span className="panel-header-title">
                    <span className="panel-header-icon">⚙️</span>
                    {node ? (
                        <>
                            {nodeTypeIcons[node.type]} {nodeTypeLabels[node.type]}
                        </>
                    ) : (
                        'Node Properties'
                    )}
                </span>
                {node && (
                    <button className="danger-button" onClick={deleteSelected} title="Delete node (Del)">
                        🗑️ Delete
                    </button>
                )}
            </div>
            <div className="panel-body">
                {!node && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem 1rem', 
                        color: '#9ca3af',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                        <div>Select a node on the canvas</div>
                        <div>to edit its configuration.</div>
                    </div>
                )}
                {node && (
                    <>
                        {node.type === 'start' && <StartNodeForm node={node} />}
                        {node.type === 'task' && <TaskNodeForm node={node} />}
                        {node.type === 'approval' && <ApprovalNodeForm node={node} />}
                        {node.type === 'automated' && <AutomatedNodeForm node={node} />}
                        {node.type === 'end' && <EndNodeForm node={node} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
