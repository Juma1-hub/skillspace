export type Task = {
  id: string;
  category: string;
  title: string;
  description: string;
  instructions: string;
  reward: number;
  active: boolean;
};

export type Contact = {
  email: string;
  whatsapp: string;
  message: string;
};

export const categories = [
  'Article Writing',
  'Research',
  'Data Entry',
  'AI & Data',
  'Design',
  'Social Media'
];

const briefs: Record<string, string[]> = {
  'Article Writing': [
    'Write a short informative article from the supplied topic.',
    'Create a clear introduction and three useful sections for the reader.',
    'Rewrite a rough paragraph into polished, original copy.',
    'Prepare a concise product explainer for a general audience.',
    'Write a helpful how-to article with practical steps.',
    'Create an engaging blog introduction and conclusion.',
    'Turn a list of notes into a structured article.',
    'Write a 300-word educational article using simple language.',
    'Create five suitable headings for an article and explain each briefly.',
    'Proofread and improve a short article while preserving its meaning.'
  ],
  'Research': [
    'Find and summarize five useful facts about the assigned subject.',
    'Create a short research brief with sources and key findings.',
    'Compare two products or services using objective information.',
    'Prepare a list of relevant resources for a client research project.',
    'Extract the most important facts from a provided brief.',
    'Organize research notes into a clean summary.',
    'Identify three reliable sources for a given topic.',
    'Create a simple comparison table from supplied information.',
    'Summarize a topic for a reader who has no prior knowledge.',
    'Write a concise research conclusion based on the supplied evidence.'
  ],
  'Data Entry': [
    'Convert the supplied information into a clean list.',
    'Organize names, dates and values into a consistent format.',
    'Check a small data set for missing or duplicated entries.',
    'Sort the provided records according to the requested rule.',
    'Standardize inconsistent capitalization and spacing.',
    'Extract contact details from the supplied text.',
    'Create a clean table from the provided records.',
    'Identify obvious formatting errors in the sample data.',
    'Count and summarize the supplied records.',
    'Prepare a final cleaned version of the supplied data.'
  ],
  'AI & Data': [
    'Label the supplied examples using the requested categories.',
    'Classify short text samples according to the given rules.',
    'Identify duplicate examples in a small data set.',
    'Review sample AI outputs and flag obvious errors.',
    'Create concise labels for the supplied data points.',
    'Group examples into the provided categories.',
    'Check a sample data set for missing labels.',
    'Write a short quality-control note for the supplied examples.',
    'Compare two sample AI responses against the stated criteria.',
    'Summarize the quality issues found in the sample data.'
  ],
  'Design': [
    'Create a simple visual concept from the supplied brief.',
    'Suggest a clean layout for a social media graphic.',
    'Write a design specification for a small banner.',
    'Choose suitable typography and spacing for the supplied concept.',
    'Create three visual directions for the client brief.',
    'Suggest an improved layout for a simple promotional card.',
    'Describe a consistent visual style for a small brand.',
    'Create a simple wireframe description for a landing section.',
    'Prepare a checklist for reviewing a graphic design.',
    'Suggest practical improvements to the supplied design concept.'
  ],
  'Social Media': [
    'Write three social posts from the supplied campaign brief.',
    'Create five short captions for the assigned topic.',
    'Suggest a one-week social content plan.',
    'Rewrite a post to make it clearer and more engaging.',
    'Create a short promotional announcement.',
    'Write three audience-friendly call-to-action lines.',
    'Suggest hashtags relevant to the supplied topic.',
    'Create a short community engagement question.',
    'Turn a product feature into a social media post.',
    'Create a simple seven-day posting schedule.'
  ]
};

export const starterTasks: Task[] = categories.flatMap((category, categoryIndex) =>
  Array.from({ length: 10 }, (_, index) => ({
    id: `starter-${categoryIndex + 1}-${index + 1}`,
    category,
    title: `${category} Test Task ${index + 1}`,
    description: briefs[category][index],
    instructions: `${briefs[category][index]}\n\nUse clear, original work. Keep your response organized and make sure it directly answers the brief. This is a frontend test task; no real client submission is made at this stage.`,
    reward: [1, 1.5, 2, 2.5, 3][index % 5],
    active: true
  }))
);

export const defaultContact: Contact = {
  email: 'skillspace@gmail.com',
  whatsapp: '+254 700 000 000',
  message: 'Need help? Contact SkillSpace support and we will assist you.'
};

export const USD_TO_KES = 130;
export const ACCESS_FEE_USD = 2;
export const ACCESS_FEE_KES = 260;
export const FREE_TASKS = 5;
export const BATCH_SIZE = 5;
export const MIN_WITHDRAWAL_USD = 100;
