import type { FC } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { TaskNodeData } from '../../../types/workflow';

const TaskNode: FC<NodeProps<TaskNodeData>> = ({ data, selected }) => {
    return (
        <div className={`node node-task ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">📋</span>
                TASK
            </div>
            <div className="node-title">{data.label || 'Task'}</div>
            {data.assignee && <div className="node-sub">👤 {data.assignee}</div>}
            {data.dueDate && <div className="node-sub">📅 {data.dueDate}</div>}
            {data.customFields && data.customFields.length > 0 && (
                <div className="node-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                    {data.customFields.length} custom fields
                </div>
            )}
            <Handle type="target" position={Position.Top} id="top" />
            <Handle type="target" position={Position.Left} id="left-target" />
            <Handle type="target" position={Position.Right} id="right-target" />
            
            <Handle type="source" position={Position.Bottom} id="bottom" />
            <Handle type="source" position={Position.Right} id="right-source" />
            <Handle type="source" position={Position.Left} id="left-source" />
        </div>
    );
};

export default TaskNode;
