import type { FC, ChangeEvent } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { EndNodeData, WorkflowNode } from '../../types/workflow';

interface Props {
  node: WorkflowNode;
}

const EndNodeForm: FC<Props> = ({ node }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const data = node.data as EndNodeData;

  const updateField = (field: keyof EndNodeData, value: string | boolean) => {
    updateNodeData(node.id, (prev) => ({
      ...(prev as EndNodeData),
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">End title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('label', e.target.value)}
          placeholder="Workflow complete"
        />
      </div>

      <div className="form-group">
        <label className="form-label">End message</label>
        <textarea
          className="form-textarea"
          value={data.endMessage ?? ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updateField('endMessage', e.target.value)
          }
          placeholder="Message shown when the workflow ends."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Include summary</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            type="checkbox"
            checked={data.showSummary}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateField('showSummary', e.target.checked)
            }
          />
          <span style={{ fontSize: '0.8rem' }}>Generate end-of-workflow summary</span>
        </div>
      </div>
    </div>
  );
};

export default EndNodeForm;
