import type { FC } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../../types/workflow';

const ApprovalNode: FC<NodeProps<ApprovalNodeData>> = ({ data, selected }) => {
    return (
        <div className={`node node-approval ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">✅</span>
                APPROVAL
            </div>
            <div className="node-title">{data.label || 'Approval'}</div>
            {data.approverRole && <div className="node-sub">👔 {data.approverRole}</div>}
            {data.autoApproveThreshold !== undefined && (
                <div className="node-sub">⚡ Auto-approve: ${data.autoApproveThreshold}</div>
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

export default ApprovalNode;
