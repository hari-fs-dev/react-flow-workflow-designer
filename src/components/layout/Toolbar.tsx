import type { FC, ChangeEvent } from 'react';
import { useRef } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const Toolbar: FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const {
        exportWorkflow,
        importWorkflow,
        clearWorkflow,
        undo,
        redo,
        canUndo,
        canRedo,
        nodes,
        edges,
    } = useWorkflowStore();

    const handleExport = () => {
        const json = exportWorkflow();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target?.result as string;
            importWorkflow(json);
        };
        reader.readAsText(file);
        
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClear = () => {
        if (nodes.length === 0 && edges.length === 0) return;
        
        if (confirm('Are you sure you want to clear the entire workflow? This cannot be undone.')) {
            clearWorkflow();
        }
    };

    return (
        <div className="toolbar">
            <button
                className="btn-ghost btn"
                onClick={() => fileInputRef.current?.click()}
                title="Import workflow (Ctrl+I)"
            >
                📁 Import
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
            />
            
            <button
                className="btn-ghost btn"
                onClick={handleExport}
                disabled={nodes.length === 0}
                title="Export workflow (Ctrl+E)"
            >
                💾 Export
            </button>

            <div className="toolbar-divider" />

            <button
                className="btn-icon"
                onClick={undo}
                disabled={!canUndo()}
                title="Undo (Ctrl+Z)"
            >
                ↶
            </button>

            <button
                className="btn-icon"
                onClick={redo}
                disabled={!canRedo()}
                title="Redo (Ctrl+Y)"
            >
                ↷
            </button>

            <div className="toolbar-divider" />

            <button
                className="btn-ghost btn"
                onClick={handleClear}
                disabled={nodes.length === 0 && edges.length === 0}
                title="Clear canvas"
            >
                🗑️ Clear
            </button>

            <div className="toolbar-divider" />

            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {nodes.length} nodes • {edges.length} edges
            </div>
        </div>
    );
};

export default Toolbar;
