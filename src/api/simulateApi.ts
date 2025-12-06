import type { WorkflowGraph, SimulationResponse } from '../types/workflow';

export async function simulateWorkflow(workflow: WorkflowGraph): Promise<SimulationResponse> {
    const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
    });

    if (!response.ok) {
        throw new Error('Failed to simulate workflow');
    }

    return response.json();
}
