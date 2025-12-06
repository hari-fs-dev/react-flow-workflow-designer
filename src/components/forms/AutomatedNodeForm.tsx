import type { FC, ChangeEvent } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { AutomatedNodeData, WorkflowNode } from '../../types/workflow';
import { useAutomations } from '../../hooks/useAutomations';

interface Props {
  node: WorkflowNode;
}

const AutomatedNodeForm: FC<Props> = ({ node }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const data = node.data as AutomatedNodeData;
  const { automations, loading, error } = useAutomations();

  const updateField = (field: keyof AutomatedNodeData, value: string) => {
    updateNodeData(node.id, (prev) => ({
      ...(prev as AutomatedNodeData),
      [field]: value,
    }));
  };

  const handleSelectAction = (actionId: string) => {
    const selected = automations.find((a) => a.id === actionId);
    updateNodeData(node.id, (prev) => {
      const prevData = prev as AutomatedNodeData;
      const params: Record<string, string> = {};
      if (selected) {
        selected.params.forEach((p: string | number) => {
          params[p] = prevData.params[p] ?? '';
        });
      }
      return {
        ...prevData,
        actionId: actionId || undefined,
        params,
      };
    });
  };

  const handleParamChange = (paramName: string, value: string) => {
    updateNodeData(node.id, (prev) => {
      const prevData = prev as AutomatedNodeData;
      return {
        ...prevData,
        params: {
          ...prevData.params,
          [paramName]: value,
        },
      };
    });
  };

  const selectedAction = automations.find((a) => a.id === data.actionId);

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Step title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('label', e.target.value)}
          placeholder="Send welcome email"
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
          placeholder="Optional description about this automated action."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Automation action</label>
        {loading && <div style={{ fontSize: '0.8rem' }}>Loading actions…</div>}
        {error && (
          <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
            Failed to load actions. Using cached values if any.
          </div>
        )}
        {!loading && (
          <select
            className="form-select"
            value={data.actionId ?? ''}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectAction(e.target.value)}
          >
            <option value="">Select action…</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && (
        <div className="form-group">
          <label className="form-label">Action parameters</label>
          {selectedAction.params.map((param: any) => (
            <div key={param} className="form-group">
              <label className="form-label">{param}</label>
              <input
                className="form-input"
                value={data.params[param] ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleParamChange(param, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomatedNodeForm;
