import type { WorkflowGraph } from '../types/workflow';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    workflow: WorkflowGraph;
}

export const workflowTemplates: WorkflowTemplate[] = [
    {
        id: 'employee-onboarding',
        name: 'Employee Onboarding',
        description: 'Complete onboarding workflow for new hires',
        icon: '👋',
        workflow: {
            nodes: [
                {
                    id: 'start-1',
                    type: 'start',
                    position: { x: 50, y: 250 },
                    data: {
                        label: 'New Employee Hired',
                        description: 'Onboarding process begins',
                        metadata: [
                            { id: '1', key: 'department', value: 'HR' },
                            { id: '2', key: 'priority', value: 'high' },
                        ],
                    },
                },
                {
                    id: 'task-1',
                    type: 'task',
                    position: { x: 300, y: 250 },
                    data: {
                        label: 'Collect Employee Documents',
                        description: 'Gather all required documents from new employee',
                        assignee: 'HR Coordinator',
                        dueDate: 'Day 1',
                        customFields: [
                            { id: '1', key: 'documents', value: 'ID, Tax Forms, Bank Details' },
                        ],
                    },
                },
                {
                    id: 'automated-1',
                    type: 'automated',
                    position: { x: 600, y: 150 },
                    data: {
                        label: 'Send Welcome Email',
                        description: 'Automated welcome email with onboarding info',
                        actionId: 'send_onboarding_email',
                        params: {
                            employee_email: '{{employee.email}}',
                            template_name: 'welcome_template',
                        },
                    },
                },
                {
                    id: 'automated-2',
                    type: 'automated',
                    position: { x: 600, y: 350 },
                    data: {
                        label: 'Create System Accounts',
                        description: 'Set up email, Slack, and other accounts',
                        actionId: 'create_access_request',
                        params: {
                            employee_id: '{{employee.id}}',
                            systems: 'Email, Slack, HRIS',
                            access_level: 'standard',
                        },
                    },
                },
                {
                    id: 'task-2',
                    type: 'task',
                    position: { x: 900, y: 250 },
                    data: {
                        label: 'Assign Equipment',
                        description: 'Provide laptop and other necessary equipment',
                        assignee: 'IT Department',
                        dueDate: 'Day 1',
                        customFields: [],
                    },
                },
                {
                    id: 'approval-1',
                    type: 'approval',
                    position: { x: 1200, y: 250 },
                    data: {
                        label: 'Manager Approval',
                        description: 'Manager confirms onboarding completion',
                        approverRole: 'Direct Manager',
                        autoApproveThreshold: undefined,
                    },
                },
                {
                    id: 'end-1',
                    type: 'end',
                    position: { x: 1500, y: 250 },
                    data: {
                        label: 'Onboarding Complete',
                        description: '',
                        endMessage: 'Employee successfully onboarded!',
                        showSummary: true,
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'start-1', target: 'task-1', sourceHandle: 'right', targetHandle: 'left-target' },
                { id: 'e2', source: 'task-1', target: 'automated-1', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e3', source: 'task-1', target: 'automated-2', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e4', source: 'automated-1', target: 'task-2', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e5', source: 'automated-2', target: 'task-2', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e6', source: 'task-2', target: 'approval-1', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e7', source: 'approval-1', target: 'end-1', sourceHandle: 'right-source', targetHandle: 'left' },
            ],
        },
    },
    {
        id: 'leave-approval',
        name: 'Leave Approval',
        description: 'Employee leave request and approval process',
        icon: '🏖️',
        workflow: {
            nodes: [
                {
                    id: 'start-1',
                    type: 'start',
                    position: { x: 50, y: 200 },
                    data: {
                        label: 'Leave Request Submitted',
                        description: 'Employee submits leave request',
                        metadata: [{ id: '1', key: 'type', value: 'leave_request' }],
                    },
                },
                {
                    id: 'approval-1',
                    type: 'approval',
                    position: { x: 300, y: 200 },
                    data: {
                        label: 'Manager Approval',
                        description: 'Direct manager reviews and approves',
                        approverRole: 'Manager',
                        autoApproveThreshold: 2,
                    },
                },
                {
                    id: 'automated-1',
                    type: 'automated',
                    position: { x: 600, y: 100 },
                    data: {
                        label: 'Update HRIS',
                        description: 'Update leave balance in HR system',
                        actionId: 'update_hris',
                        params: {
                            employee_id: '{{employee.id}}',
                            field: 'leave_balance',
                            value: '{{calculated_balance}}',
                        },
                    },
                },
                {
                    id: 'automated-2',
                    type: 'automated',
                    position: { x: 600, y: 300 },
                    data: {
                        label: 'Notify Team',
                        description: 'Send notification to team members',
                        actionId: 'send_slack_notification',
                        params: {
                            channel: '{{team_channel}}',
                            message: '{{employee.name}} will be on leave',
                        },
                    },
                },
                {
                    id: 'end-1',
                    type: 'end',
                    position: { x: 900, y: 200 },
                    data: {
                        label: 'Leave Approved',
                        description: '',
                        endMessage: 'Leave request processed successfully',
                        showSummary: true,
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'start-1', target: 'approval-1', sourceHandle: 'right', targetHandle: 'left-target' },
                { id: 'e2', source: 'approval-1', target: 'automated-1', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e3', source: 'approval-1', target: 'automated-2', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e4', source: 'automated-1', target: 'end-1', sourceHandle: 'right-source', targetHandle: 'left' },
                { id: 'e5', source: 'automated-2', target: 'end-1', sourceHandle: 'right-source', targetHandle: 'left' },
            ],
        },
    },
    {
        id: 'document-verification',
        name: 'Document Verification',
        description: 'Verify and approve employee documents',
        icon: '📄',
        workflow: {
            nodes: [
                {
                    id: 'start-1',
                    type: 'start',
                    position: { x: 50, y: 200 },
                    data: {
                        label: 'Document Submitted',
                        description: 'Employee submits document for verification',
                        metadata: [],
                    },
                },
                {
                    id: 'task-1',
                    type: 'task',
                    position: { x: 300, y: 200 },
                    data: {
                        label: 'Initial Review',
                        description: 'HR reviews document for completeness',
                        assignee: 'HR Specialist',
                        dueDate: '2 business days',
                        customFields: [],
                    },
                },
                {
                    id: 'approval-1',
                    type: 'approval',
                    position: { x: 600, y: 200 },
                    data: {
                        label: 'HR Manager Approval',
                        description: 'Final approval from HR manager',
                        approverRole: 'HR Manager',
                        autoApproveThreshold: undefined,
                    },
                },
                {
                    id: 'automated-1',
                    type: 'automated',
                    position: { x: 900, y: 200 },
                    data: {
                        label: 'Generate Certificate',
                        description: 'Generate verification certificate',
                        actionId: 'generate_doc',
                        params: {
                            template: 'verification_certificate',
                            recipient: '{{employee.email}}',
                            format: 'PDF',
                        },
                    },
                },
                {
                    id: 'end-1',
                    type: 'end',
                    position: { x: 1200, y: 200 },
                    data: {
                        label: 'Document Verified',
                        description: '',
                        endMessage: 'Document verification complete',
                        showSummary: false,
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'start-1', target: 'task-1', sourceHandle: 'right', targetHandle: 'left-target' },
                { id: 'e2', source: 'task-1', target: 'approval-1', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e3', source: 'approval-1', target: 'automated-1', sourceHandle: 'right-source', targetHandle: 'left-target' },
                { id: 'e4', source: 'automated-1', target: 'end-1', sourceHandle: 'right-source', targetHandle: 'left' },
            ],
        },
    },
];
