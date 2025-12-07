import type { FC, DragEvent } from 'react';
import { useState } from 'react';
import type { NodeKind } from '../../types/workflow';
import { workflowTemplates } from '../../data/templates';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const paletteItems: { type: NodeKind; label: string; description: string; icon: string }[] = [
    { type: 'start', label: 'Start Node', description: 'Workflow entry point', icon: '▶️' },
    { type: 'task', label: 'Task Node', description: 'Human task step', icon: '📋' },
    { type: 'approval', label: 'Approval Node', description: 'Manager / HR approval', icon: '✅' },
    { type: 'automated', label: 'Automated Step', description: 'System-triggered action', icon: '⚙️' },
    { type: 'end', label: 'End Node', description: 'Workflow completion', icon: '🏁' },
];

const SidebarPalette: FC = () => {
    const [activeTab, setActiveTab] = useState<'nodes' | 'templates'>('nodes');
    const { loadWorkflow } = useWorkflowStore();

    const handleDragStart = (event: DragEvent<HTMLDivElement>, type: string, isTemplate = false) => {
        event.dataTransfer.setData('application/reactflow', type);
        event.dataTransfer.setData('application/reactflow/type', isTemplate ? 'template' : 'node');
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleLoadTemplate = (templateId: string) => {
        const template = workflowTemplates.find((t) => t.id === templateId);
        if (template) {
            loadWorkflow(template.workflow.nodes, template.workflow.edges);
        }
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <span className="panel-header-title">
                    <span className="panel-header-icon">🎨</span>
                    Workflow Builder
                </span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <button
                        onClick={() => setActiveTab('nodes')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            background: activeTab === 'nodes' ? '#ffffff' : 'transparent',
                            borderBottom: activeTab === 'nodes' ? '2px solid #6366f1' : '2px solid transparent',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'nodes' ? 600 : 400,
                            fontSize: '0.875rem',
                            color: activeTab === 'nodes' ? '#6366f1' : '#6b7280',
                            transition: 'all 0.2s',
                        }}
                    >
                        🧩 Node Types
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            background: activeTab === 'templates' ? '#ffffff' : 'transparent',
                            borderBottom: activeTab === 'templates' ? '2px solid #6366f1' : '2px solid transparent',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'templates' ? 600 : 400,
                            fontSize: '0.875rem',
                            color: activeTab === 'templates' ? '#6366f1' : '#6b7280',
                            transition: 'all 0.2s',
                        }}
                    >
                        📋 Templates
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '0.75rem 1rem 1rem' }}>
                    {activeTab === 'nodes' && (
                        <>
                            {paletteItems.map((item) => (
                                <div
                                    key={item.type}
                                    className="palette-item"
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, item.type)}
                                >
                                    <div className="palette-item-content">
                                        <div className="palette-item-title">
                                            <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                                            {item.label}
                                        </div>
                                        <div className="palette-item-description">{item.description}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'templates' && (
                        <>
                            {workflowTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, template.id, true)}
                                    onClick={() => handleLoadTemplate(template.id)}
                                    style={{
                                        borderRadius: '0.75rem',
                                        padding: '1rem',
                                        border: '2px solid #e5e7eb',
                                        marginBottom: '0.75rem',
                                        cursor: 'grab',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                                        transition: 'all 0.25s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#6366f1';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        marginBottom: '0.25rem',
                                        color: '#111827'
                                    }}>
                                        <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>
                                            {template.icon}
                                        </span>
                                        {template.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {template.description}
                                    </div>
                                    <div style={{
                                        marginTop: '0.5rem',
                                        fontSize: '0.7rem',
                                        color: '#9ca3af',
                                        display: 'flex',
                                        gap: '0.75rem'
                                    }}>
                                        <span>📊 {template.workflow.nodes.length} nodes</span>
                                        <span>🔗 {template.workflow.edges.length} connections</span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarPalette;
