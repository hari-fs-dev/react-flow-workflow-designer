import type { FC } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { EndNodeData } from '../../../types/workflow';

const EndNode: FC<NodeProps<EndNodeData>> = ({ data, selected }) => {
    return (
        <div className={`node node-end ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">🏁</span>
                END
            </div>
            <div className="node-title">{data.label || 'End'}</div>
            {data.endMessage && <div className="node-sub">💬 {data.endMessage}</div>}
            {data.showSummary && (
                <div className="node-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                    📊 Show summary
                </div>
            )}
            <Handle type="target" position={Position.Top} id="top" />
            <Handle type="target" position={Position.Left} id="left" />
            <Handle type="target" position={Position.Right} id="right" />
            <Handle type="target" position={Position.Bottom} id="bottom" />
        </div>
    );
};

export default EndNode;
