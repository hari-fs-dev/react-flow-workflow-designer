import type { FC, ChangeEvent } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { StartNodeData, WorkflowNode, KeyValuePair } from '../../types/workflow';

interface Props {
  node: WorkflowNode;
}

const createPairId = () => Math.random().toString(36).slice(2, 9);

const StartNodeForm: FC<Props> = ({ node }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const data = node.data as StartNodeData;

  const updateField = (field: keyof StartNodeData, value: string | boolean) => {
    updateNodeData(node.id, (prev) => ({
      ...(prev as StartNodeData),
      [field]: value,
    }));
  };

  const handleMetaChange = (id: string, field: 'key' | 'value', value: string) => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as StartNodeData;
      const updated: KeyValuePair[] = prevData.metadata.map((kv) =>
        kv.id === id ? { ...kv, [field]: value } : kv
      );
      return { ...prevData, metadata: updated };
    });
  };

  const addMeta = () => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as StartNodeData;
      return {
        ...prevData,
        metadata: [...prevData.metadata, { id: createPairId(), key: '', value: '' }],
      };
    });
  };

  const removeMeta = (id: string) => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as StartNodeData;
      return {
        ...prevData,
        metadata: prevData.metadata.filter((kv) => kv.id !== id),
      };
    });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Start title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('label', e.target.value)}
          placeholder="Employee onboarding start"
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
          placeholder="Optional context about when this workflow starts."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Metadata (optional key–value pairs)</label>
        {data.metadata.map((pair) => (
          <div key={pair.id} className="form-inline-row">
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Key"
              value={pair.key}
              onChange={(e) => handleMetaChange(pair.id, 'key', e.target.value)}
            />
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Value"
              value={pair.value}
              onChange={(e) => handleMetaChange(pair.id, 'value', e.target.value)}
            />
            <button type="button" className="danger-button" onClick={() => removeMeta(pair.id)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="small-button" onClick={addMeta}>
          + Add metadata
        </button>
      </div>
    </div>
  );
};

export default StartNodeForm;
