import type { FC } from 'react';
import { useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { simulateWorkflow } from '../../api/simulateApi';
import type { SimulationResponse } from '../../types/workflow';

const SimulationPanel: FC = () => {
    const nodes = useWorkflowStore((state) => state.nodes);
    const edges = useWorkflowStore((state) => state.edges);

    const [result, setResult] = useState<SimulationResponse | null>(null);
    const [running, setRunning] = useState(false);

    const handleRun = async () => {
        setRunning(true);
        try {
            const res = await simulateWorkflow({ nodes, edges });
            setResult(res);
        } finally {
            setRunning(false);
        }
    };

    const handleClear = () => {
        setResult(null);
    };

    return (
        <div className="panel" style={{ height: '50%' }}>
            <div className="panel-header">
                <span className="panel-header-title">
                    <span className="panel-header-icon">🧪</span>
                    Workflow Simulation
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {result && (
                        <button
                            className="btn-icon"
                            onClick={handleClear}
                            title="Clear results"
                            style={{ fontSize: '0.875rem' }}
                        >
                            🗑️
                        </button>
                    )}
                    <button
                        className="btn-primary btn"
                        onClick={handleRun}
                        disabled={running || nodes.length === 0}
                        style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                    >
                        {running ? '⏳ Running…' : '▶️ Run Test'}
                    </button>
                </div>
            </div>
            <div className="panel-body">
                {nodes.length === 0 && !result && (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        color: '#9ca3af',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                        <div>Build a workflow on the canvas,</div>
                        <div>then run a simulation to test it.</div>
                    </div>
                )}

                {result && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            {result.valid ? (
                                <div className="badge badge-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                    ✅ Valid Workflow
                                </div>
                            ) : (
                                <div className="badge badge-error" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                    ❌ Workflow Has Issues
                                </div>
                            )}
                        </div>

                        {result.errors.length > 0 && (
                            <div className="simulation-errors">
                                <strong>⚠️ Validation Issues:</strong>
                                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0 0' }}>
                                    {result.errors.map((err, i) => (
                                        <li key={i} style={{ marginBottom: '0.25rem' }}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="simulation-steps">
                            <strong style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                📋 Execution Log:
                            </strong>
                            {result.steps.length === 0 ? (
                                <div style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: '#9ca3af',
                                    fontSize: '0.8125rem'
                                }}>
                                    No steps executed.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {result.steps.map((step) => (
                                        <div key={step.stepIndex} className="simulation-step">
                                            <div className="simulation-step-label">
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '1.5rem',
                                                    height: '1.5rem',
                                                    borderRadius: '50%',
                                                    background: step.status === 'success' ? '#10b981' : step.status === 'warning' ? '#f59e0b' : '#ef4444',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    lineHeight: '1.5rem',
                                                    fontSize: '0.75rem',
                                                    marginRight: '0.5rem',
                                                    fontWeight: 600
                                                }}>
                                                    {step.stepIndex + 1}
                                                </span>
                                                {step.nodeLabel}
                                            </div>
                                            <div className="simulation-step-message">
                                                {step.status === 'success' && '✅ '}
                                                {step.status === 'warning' && '⚠️ '}
                                                {step.status === 'error' && '❌ '}
                                                {step.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </>
                )}
            </div>
        </div>
    );
};

export default SimulationPanel;
