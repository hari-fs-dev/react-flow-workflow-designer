import { http, HttpResponse } from 'msw';
import { validateWorkflow } from '../utils/workflowValidation';
import type { WorkflowGraph, SimulationResponse, SimulationStep, WorkflowNode } from '../types/workflow';

const MOCK_AUTOMATIONS = [
    {
        id: 'send_email',
        label: 'Send Email',
        params: ['to', 'subject', 'body'],
        description: 'Send an automated email notification',
    },
    {
        id: 'send_onboarding_email',
        label: 'Send Onboarding Email',
        params: ['employee_email', 'template_name'],
        description: 'Send welcome email with onboarding instructions',
    },
    {
        id: 'create_jira_ticket',
        label: 'Create Jira Ticket',
        params: ['project', 'summary', 'assignee'],
        description: 'Create a new Jira ticket for task tracking',
    },
    {
        id: 'update_hris',
        label: 'Update HRIS System',
        params: ['employee_id', 'field', 'value'],
        description: 'Update employee record in HR Information System',
    },
    {
        id: 'schedule_meeting',
        label: 'Schedule Meeting',
        params: ['attendees', 'duration', 'subject'],
        description: 'Schedule a calendar meeting automatically',
    },
    {
        id: 'generate_offer_letter',
        label: 'Generate Offer Letter',
        params: ['candidate_id', 'position', 'salary'],
        description: 'Generate and send offer letter document',
    },
    {
        id: 'generate_doc',
        label: 'Generate Document',
        params: ['template', 'recipient', 'format'],
        description: 'Generate a document from template',
    },
    {
        id: 'assign_equipment',
        label: 'Assign Equipment',
        params: ['employee_id', 'equipment_type', 'asset_id'],
        description: 'Assign laptop, phone, or other equipment',
    },
    {
        id: 'create_access_request',
        label: 'Create Access Request',
        params: ['employee_id', 'systems', 'access_level'],
        description: 'Request system access for new employee',
    },
    {
        id: 'send_slack_notification',
        label: 'Send Slack Notification',
        params: ['channel', 'message'],
        description: 'Post notification to Slack channel',
    },
];

export const handlers = [
    http.get('/api/automations', async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return HttpResponse.json(MOCK_AUTOMATIONS);
    }),

    http.post('/api/simulate', async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const workflow = (await request.json()) as WorkflowGraph;
        const errors = validateWorkflow(workflow);
        const steps: SimulationStep[] = [];

        const startNodes = workflow.nodes.filter((n) => n.type === 'start');
        if (startNodes.length === 0) {
            errors.push('Cannot simulate without a Start node.');
            return HttpResponse.json({ valid: false, errors, steps });
        }

        const outgoing: Record<string, string[]> = {};
        workflow.edges.forEach((e) => {
            if (!outgoing[e.source]) outgoing[e.source] = [];
            outgoing[e.source].push(e.target);
        });

        const queue: WorkflowNode[] = [...startNodes];
        const visited = new Set<string>();
        let index = 0;

        while (queue.length > 0) {
            const current = queue.shift()!;

            if (visited.has(current.id)) continue;
            visited.add(current.id);

            steps.push({
                stepIndex: index++,
                nodeId: current.id,
                nodeLabel: (current.data as any).label ?? current.id,
                status: 'success',
                message: `Executed ${current.type} node.`,
            });

            const nextIds: string[] = outgoing[current.id] || [];

            nextIds.forEach(nextId => {
                const nextNode = workflow.nodes.find(n => n.id === nextId);
                if (nextNode) {
                    queue.push(nextNode);
                }
            });
        }

        if (visited.size !== workflow.nodes.length) {
            errors.push('Some nodes were not visited during simulation.');
        }

        return HttpResponse.json({ valid: errors.length === 0, errors, steps });
    }),
];
