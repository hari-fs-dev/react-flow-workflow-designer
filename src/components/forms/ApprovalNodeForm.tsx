import type { FC, ChangeEvent } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { ApprovalNodeData, WorkflowNode } from '../../types/workflow';

interface Props {
  node: WorkflowNode;
}

const ApprovalNodeForm: FC<Props> = ({ node }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const data = node.data as ApprovalNodeData;

  const updateField = (
    field: keyof ApprovalNodeData,
    value: string | number | undefined
  ) => {
    updateNodeData(node.id, (prev) => ({
      ...(prev as ApprovalNodeData),
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Approval title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('label', e.target.value)}
          placeholder="Manager approval"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={data.description ?? ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updateField('description', e.target.value)
          }
          placeholder="Optional description about this approval step."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Approver role</label>
        <input
          className="form-input"
          value={data.approverRole}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateField('approverRole', e.target.value)
          }
          placeholder='e.g., "Manager", "HRBP", "Director"'
        />
      </div>

      <div className="form-group">
        <label className="form-label">Auto-approve threshold (days)</label>
        <input
          className="form-input"
          type="number"
          value={data.autoApproveThreshold ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateField(
              'autoApproveThreshold',
              e.target.value === '' ? undefined : Number(e.target.value)
            )
          }
          placeholder="If pending longer than this, auto-approve."
        />
      </div>
    </div>
  );
};

export default ApprovalNodeForm;
