import type { FC } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { StartNodeData } from '../../../types/workflow';

const StartNode: FC<NodeProps<StartNodeData>> = ({ data, selected }) => {
    return (
        <div className={`node node-start ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">▶️</span>
                START
            </div>
            <div className="node-title">{data.label || 'Start'}</div>
            {data.description && <div className="node-sub">{data.description}</div>}
            {data.metadata && data.metadata.length > 0 && (
                <div className="node-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                    {data.metadata.length} metadata
                </div>
            )}
            <Handle type="source" position={Position.Bottom} id="bottom" />
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Left} id="left" />
            <Handle type="source" position={Position.Top} id="top" />
        </div>
    );
};

export default StartNode;
