import type { FC, ChangeEvent } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { TaskNodeData, WorkflowNode, KeyValuePair } from '../../types/workflow';

interface Props {
  node: WorkflowNode;
}

const createPairId = () => Math.random().toString(36).slice(2, 9);

const TaskNodeForm: FC<Props> = ({ node }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const data = node.data as TaskNodeData;

  const updateField = (field: keyof TaskNodeData, value: string) => {
    updateNodeData(node.id, (prev) => ({
      ...(prev as TaskNodeData),
      [field]: value,
    }));
  };

  const handleCustomChange = (id: string, field: 'key' | 'value', value: string) => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as TaskNodeData;
      const updated: KeyValuePair[] = prevData.customFields.map((kv) =>
        kv.id === id ? { ...kv, [field]: value } : kv
      );
      return { ...prevData, customFields: updated };
    });
  };

  const addCustom = () => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as TaskNodeData;
      return {
        ...prevData,
        customFields: [...prevData.customFields, { id: createPairId(), key: '', value: '' }],
      };
    });
  };

  const removeCustom = (id: string) => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as TaskNodeData;
      return {
        ...prevData,
        customFields: prevData.customFields.filter((kv) => kv.id !== id),
      };
    });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Task title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('label', e.target.value)}
          placeholder="Collect employee documents"
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
          placeholder="Optional description of this task."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          value={data.assignee ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('assignee', e.target.value)}
          placeholder="Assignee (e.g., HR Ops)"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Due date</label>
        <input
          className="form-input"
          type="text"
          value={data.dueDate ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('dueDate', e.target.value)}
          placeholder="e.g., Within 3 business days"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Custom fields</label>
        {data.customFields.map((pair) => (
          <div key={pair.id} className="form-inline-row">
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Field name"
              value={pair.key}
              onChange={(e) => handleCustomChange(pair.id, 'key', e.target.value)}
            />
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Default value"
              value={pair.value}
              onChange={(e) => handleCustomChange(pair.id, 'value', e.target.value)}
            />
            <button type="button" className="danger-button" onClick={() => removeCustom(pair.id)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="small-button" onClick={addCustom}>
          + Add custom field
        </button>
      </div>
    </div>
  );
};

export default TaskNodeForm;
