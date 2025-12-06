import { useState, useEffect } from 'react';
import WorkflowCanvas from '../canvas/WorkflowCanvas';
import SidebarPalette from './SidebarPalette';
import PropertiesPanel from './PropertiesPanel';
import SimulationPanel from './SimulationPanel';
import Toolbar from './Toolbar';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const AppShell = () => {
    const { metadata, setMetadata, undo, redo, deleteSelected } = useWorkflowStore();
    const [isEditingName, setIsEditingName] = useState(false);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo: Ctrl+Z
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Redo: Ctrl+Y or Ctrl+Shift+Z
            else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                redo();
            }
            // Delete: Delete or Backspace
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                // Only delete if not focused on an input
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    deleteSelected();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, deleteSelected]);

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header-left">
                    <div className="app-header-title">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={metadata.name}
                                onChange={(e) => setMetadata({ name: e.target.value })}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsEditingName(false);
                                }}
                                autoFocus
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                }}
                            />
                        ) : (
                            <h1 onClick={() => setIsEditingName(true)} style={{ cursor: 'pointer' }}>
                                {metadata.name}
                            </h1>
                        )}
                        <p>HR Workflow Designer • React + React Flow</p>
                    </div>
                </div>
                <div className="app-header-right">
                    <Toolbar />
                </div>
            </header>
            <main className="app-main">
                <aside className="app-sidebar-left">
                    <SidebarPalette />
                </aside>
                <section className="app-canvas">
                    <WorkflowCanvas />
                </section>
                <aside className="app-sidebar-right">
                    <PropertiesPanel />
                    <SimulationPanel />
                </aside>
            </main>
        </div>
    );
};

export default AppShell;
