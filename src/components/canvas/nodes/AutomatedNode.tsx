import type { FC } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { AutomatedNodeData } from '../../../types/workflow';

const AutomatedNode: FC<NodeProps<AutomatedNodeData>> = ({ data, selected }) => {
    return (
        <div className={`node node-automated ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">⚙️</span>
                AUTOMATED
            </div>
            <div className="node-title">{data.label || 'Automated Step'}</div>
            {data.actionId && <div className="node-sub">🔧 {data.actionId}</div>}
            {data.params && Object.keys(data.params).length > 0 && (
                <div className="node-badge" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                    {Object.keys(data.params).length} params
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

export default AutomatedNode;
