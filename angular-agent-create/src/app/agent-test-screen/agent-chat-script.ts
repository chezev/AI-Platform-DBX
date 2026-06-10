// Frontend-only scripted demo conversation for the Test screen. No backend/LLM:
// we infer a domain from the agent's name and generate a coherent ~10-turn
// "back and forth" so any agent — including a freshly created one — has a
// believable suggested chat with real-looking answers + traces.

export interface ScriptTurn {
  /** Suggested user prompt (rendered as a clickable chip). */
  prompt: string;
  /** Canned assistant reply. */
  response: string;
  /** Existing trace case reused so the trace panel still works. */
  traceCaseId: string;
}

export interface AgentScript {
  greeting: string;
  turns: ScriptTurn[];
}

interface Theme {
  /** Area of work, e.g. "payroll compliance". */
  noun: string;
  /** A concrete task phrased as a verb, e.g. "run a compliance check…". */
  task: string;
  /** What a single unit of work is called, e.g. "payroll record". */
  recordType: string;
  /** What the agent reasons over, e.g. "the payroll ledger and tax rules". */
  dataSource: string;
}

const GENERIC: Theme = {
  noun: 'your workflows',
  task: 'run a task and recommend the next steps',
  recordType: 'record',
  dataSource: 'your connected data sources',
};

// Ordered: first keyword match wins, so put specific themes before broad ones.
const THEMES: Array<{ match: RegExp; theme: Theme }> = [
  {
    match: /payroll|compliance|tax/,
    theme: {
      noun: 'payroll compliance',
      task: "run a compliance check on this month's payroll",
      recordType: 'payroll record',
      dataSource: 'the payroll ledger and local labour & tax rules',
    },
  },
  {
    match: /onboard/,
    theme: {
      noun: 'employee onboarding',
      task: 'onboard a new hire and set up their buddy',
      recordType: 'new hire',
      dataSource: 'the HRIS and onboarding policy',
    },
  },
  {
    match: /talent|recruit|candidate|hir|screen/,
    theme: {
      noun: 'talent acquisition',
      task: 'screen a candidate and update the hiring pipeline',
      recordType: 'candidate',
      dataSource: 'the ATS and the role scorecard',
    },
  },
  {
    match: /attendance|leave|shift|roster/,
    theme: {
      noun: 'attendance & leave',
      task: 'review attendance anomalies and recommend policy adjustments',
      recordType: 'employee',
      dataSource: 'the attendance logs and leave policy',
    },
  },
  {
    match: /performance|review|goal|appraisal/,
    theme: {
      noun: 'performance reviews',
      task: 'compile performance feedback and flag goal conflicts',
      recordType: 'employee',
      dataSource: 'the review cycles and goal data',
    },
  },
  {
    match: /learning|develop|skill|training|course/,
    theme: {
      noun: 'learning & development',
      task: 'recommend a learning path from a skill-gap analysis',
      recordType: 'employee',
      dataSource: 'the skills matrix and course catalog',
    },
  },
  {
    match: /engage|sentiment|survey|culture|pulse/,
    theme: {
      noun: 'employee engagement',
      task: 'analyse survey feedback and surface engagement risks',
      recordType: 'team',
      dataSource: 'the pulse-survey results',
    },
  },
  {
    match: /benefit/,
    theme: {
      noun: 'benefits optimization',
      task: 'benchmark benefits usage and recommend improvements',
      recordType: 'employee',
      dataSource: 'the benefits utilisation data',
    },
  },
  {
    match: /expense|finance|audit|claim/,
    theme: {
      noun: 'expense auditing',
      task: 'flag expense anomalies for review',
      recordType: 'claim',
      dataSource: 'the expense policy and claim history',
    },
  },
  {
    match: /adoption|product|usage/,
    theme: {
      noun: 'product adoption',
      task: 'analyse adoption metrics and recommend actions',
      recordType: 'account',
      dataSource: 'the product-usage metrics',
    },
  },
  {
    match: /attrition|retention|risk/,
    theme: {
      noun: 'attrition risk',
      task: 'identify attrition signals and prioritise interventions',
      recordType: 'employee',
      dataSource: 'engagement trends and manager patterns',
    },
  },
  {
    match: /workforce|planning|headcount/,
    theme: {
      noun: 'workforce planning',
      task: 'forecast headcount demand and supply',
      recordType: 'team',
      dataSource: 'historical headcount and hiring plans',
    },
  },
  {
    match: /knowledge|policy|retriev|faq|assist/,
    theme: {
      noun: 'knowledge retrieval',
      task: 'answer a policy question from the knowledge base',
      recordType: 'query',
      dataSource: 'the indexed playbooks and SOPs',
    },
  },
];

function themeFor(agentName: string): Theme {
  const name = agentName.toLowerCase();
  return THEMES.find((entry) => entry.match.test(name))?.theme ?? GENERIC;
}

/** Builds the greeting + suggested-turn script for a given agent name. */
export function buildAgentScript(agentName: string): AgentScript {
  const agent = agentName?.trim() || 'this agent';
  const t = themeFor(agent);
  const sample = 'Amit Sharma (EMP-2041)';

  return {
    greeting:
      `Hi, I'm ${agent}. I can help you ${t.task} — I pull the right data, run the checks, ` +
      `and recommend next steps, with every action traceable. Pick a suggested question below to see how I work, or ask your own.`,
    turns: [
      {
        prompt: 'What can you do?',
        response:
          `I handle ${t.noun} end to end. You can ask me to look up a ${t.recordType}, run a task, and validate it ` +
          `against ${t.dataSource} — and I'll recommend what to do next. Every reply has a trace you can open.`,
        traceCaseId: 'simple-llm-response',
      },
      {
        prompt: 'Walk me through a typical task.',
        response:
          `Sure. A common one is to ${t.task}. I gather the inputs, check them against ${t.dataSource}, ` +
          `call the right tool, and hand back a summary you can act on. Want me to run it on a real ${t.recordType}?`,
        traceCaseId: 'simple-llm-response',
      },
      {
        prompt: `Yes — try it on ${sample}.`,
        response:
          `Got it. I've pulled the record for ${sample}. I have the core details I need — ` +
          `shall I go ahead and ${t.task}?`,
        traceCaseId: 'tool-success',
      },
      {
        prompt: 'Go ahead.',
        response:
          `Done ✅ — I completed the task for ${sample} and updated the system. ` +
          `Summary: 3 fields updated, 1 follow-up queued. Everything checked out against ${t.dataSource}.`,
        traceCaseId: 'tool-success',
      },
      {
        prompt: 'What data did you use to decide that?',
        response:
          `I referenced ${t.dataSource} plus the agent's knowledge base. Open the trace on any reply ` +
          `to see the exact tool calls, their inputs, and the token usage for each step.`,
        traceCaseId: 'high-token-usage',
      },
      {
        prompt: 'What happens if some details are missing?',
        response:
          `If a required field is missing I flag it before changing anything and ask you for it — ` +
          `I won't write incomplete data. For ${sample}, everything required was present.`,
        traceCaseId: 'missing-input',
      },
      {
        prompt: 'Does this need an approval?',
        response:
          `Some actions do. When a step crosses a policy threshold I pause and route it for approval ` +
          `instead of proceeding. This one was within limits, so no approval was needed.`,
        traceCaseId: 'human-approval',
      },
      {
        prompt: 'Show me the impact.',
        response:
          `Here's the impact: 1 ${t.recordType} processed, ~2 minutes saved vs. doing it manually, and 0 errors. ` +
          `Across a week of similar volume that's roughly an afternoon back.`,
        traceCaseId: 'conditional-branch',
      },
      {
        prompt: 'Can you summarise what we did?',
        response:
          `We tested ${agent}: ran "${t.task}" on ${sample}, confirmed the data sources, and reviewed how ` +
          `missing fields and approvals are handled. Every step is captured in the trace.`,
        traceCaseId: 'simple-llm-response',
      },
      {
        prompt: "Great, that's all.",
        response:
          `Anytime! When you're ready, activate ${agent} and it'll handle ${t.noun} for every ${t.recordType} ` +
          `automatically. Feel free to keep testing with your own questions too.`,
        traceCaseId: 'simple-llm-response',
      },
    ],
  };
}
