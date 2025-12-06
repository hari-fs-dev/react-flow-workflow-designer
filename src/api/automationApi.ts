export interface AutomationAction {
    id: string;
    label: string;
    params: string[];
    description?: string;
}

export async function fetchAutomations(): Promise<AutomationAction[]> {
    const response = await fetch('/api/automations');
    if (!response.ok) {
        throw new Error('Failed to fetch automations');
    }
    return response.json();
}
