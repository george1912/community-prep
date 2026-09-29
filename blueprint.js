// Curated against the teacher's Autumn 2026 blueprint. IDs refer to the existing
// Quizlet export, not to teacher-provided questions or exam weighting.
window.BLUEPRINT = {
  title: 'ATI: Community Health Midterm Blueprint',
  term: 'Autumn 2026',
  studyMethods: [
    'Review each ATI module concepts',
    'Review class notes and discussions',
    'Describe and apply levels of prevention',
    'Review and analyze theories/models (HBM, TTM, Ecological, etc)',
    'Identify ethical principles'
  ],
  sections: [
    {
      id: 'bp-population', title: 'Population Health & Nursing Roles',
      conversation: 'What does the nurse do for the whole community?',
      description: 'Start with the big picture. Talk through the nurse’s role, then explain which level of prevention fits the situation and why.',
      objectives: [
        'The functions of the population health nurse (education, dissemination, promotion)',
        'Levels of prevention: primary, secondary, tertiary'
      ],
      focuses: [
        { title: 'The nurse’s role', prompt: 'If you were the community nurse, what would you assess, teach, or help put into action?', ids: [68,81,84,85,87,19,95,141] },
        { title: 'Education, outreach & promotion', prompt: 'How would you get useful health information to the people who need it and involve the community?', ids: [13,72,77,78,106,113,115,124,127,129,133,136,137,143,147] },
        { title: 'Name the prevention level', prompt: 'Is this primary, secondary, or tertiary prevention? Explain what makes it fit.', ids: [63,30,76,29,36,46,252,253,258,265] }
      ]
    },
    {
      id: 'bp-models', title: 'Health Promotion Theories & Models',
      conversation: 'What helps someone feel ready to make a change?',
      description: 'Listen to what the client is telling you. Choose the model that helps explain their thinking, readiness, or surroundings.',
      objectives: [
        'Health Belief Model (HBM): perceived susceptibility, benefits, barriers, cues to action',
        'Transtheoretical Model',
        'Review and analyze theories/models (HBM, TTM, Ecological, etc) — from the suggested study methods'
      ],
      focuses: [
        { title: 'Health Belief Model', prompt: 'What does the person believe about their risk, the benefits of change, and the barriers in their way? What might prompt action?', ids: [122,64], gap: 'The deck names HBM and includes a barrier-assessment scenario. Use your ATI module for a fuller review of susceptibility, benefits, barriers, and cues to action.' },
        { title: 'Stages of change', prompt: 'Where is this person in the change process, and how would you meet them at that stage?', ids: [109,62,116,123,79,69] },
        { title: 'Look beyond the individual', prompt: 'How would an ecological model change the way you look at this person’s situation?', ids: [146] },
        { title: 'Compare another model', prompt: 'How does learning from another person’s example differ from the other models?', ids: [65] }
      ]
    },
    {
      id: 'bp-prevention', title: 'Prevention & Screening',
      conversation: 'What would prevention look like in this setting?',
      description: 'Move between work, home, and school. For each scenario, say what you would do and which prevention level it represents.',
      objectives: ['Prevention strategies in occupational health, home health, and school nursing'],
      focuses: [
        { title: 'At work', prompt: 'What could the occupational health nurse do to reduce risks, screen for problems, or support workers?', ids: [36,67,74,180,188,253,261] },
        { title: 'At home', prompt: 'During a home visit, what would you notice first, and how could you prevent a complication?', ids: [45,46,51,59,80,184,196,233,240,265] },
        { title: 'At school', prompt: 'How would you apply prevention when working with students and their families?', ids: [73,106,183,185,191,202] },
        { title: 'Screening & prevention levels', prompt: 'What is this screening or intervention trying to accomplish? Connect that goal to the prevention level.', ids: [29,30,34,37,49,63,72,76,150,155,162,170,177,178,252,258] }
      ]
    },
    {
      id: 'bp-systems', title: 'Health Systems & Policy',
      conversation: 'Who does what, and where can this client get coverage?',
      description: 'Practice matching organizations with their jobs. Then talk through Medicare and Medicaid without mixing them up.',
      objectives: ['Roles of major agencies (ex. UNICEF, CDC, etc)', 'Compare and contrast Medicare vs Medicaid'],
      focuses: [
        { title: 'Match the agency to its role', prompt: 'Which agency or organization would you turn to in this situation, and why?', ids: [1,5,9,130,241,246,248,250,251,254], gap: 'UNICEF is named in the blueprint, but the current deck has no direct UNICEF question. Review its role in your course materials.' },
        { title: 'Medicare vs Medicaid', prompt: 'How would you explain the difference to a client? Consider eligibility, coverage, funding, and administration.', ids: [9,12,179,242,243,249,255,260,263,264,270] },
        { title: 'Put policy in context', prompt: 'Who makes health policy, and how can a policy affect the care a community receives?', ids: [4,8,20,244,245,247,257,266,267,268,269] }
      ]
    },
    {
      id: 'bp-ethics', title: 'Advocacy & Ethics',
      conversation: 'What is the right nursing action, and what principle supports it?',
      description: 'Don’t stop at naming the principle. Explain how it changes your next step with a client or your advocacy for the community.',
      objectives: [
        'Ethical principles: autonomy, beneficence, justice, nonmaleficence in community health practice',
        'Applications of political advocacy',
        'Nursing advocacy roles: ensuring informed consent, respecting client choices, policy engagement'
      ],
      focuses: [
        { title: 'Apply the ethical principles', prompt: 'Is the key issue autonomy, beneficence, justice, or nonmaleficence? What in the scenario points you there?', ids: [86,92,100,162,163,164] },
        { title: 'Speak up for the client', prompt: 'How would you protect the person’s choices, understanding, and access to care?', ids: [93,96,98,104,206] },
        { title: 'Advocate beyond one bedside', prompt: 'Who needs to hear about this problem? How could you advocate through leadership, community partners, or policy?', ids: [2,29,83,91,105,106,158,164,191,197,247,266,268] }
      ]
    },
    {
      id: 'bp-sdoh', title: 'Social Determinants of Health (SDoH)',
      conversation: 'What in this person’s daily life is shaping their health?',
      description: 'Look at the conditions around the client. Ask what makes healthy choices or access to care easier—or harder—and what support could help.',
      objectives: [
        'Economic stability, education, food access, built environment',
        'Food deserts and faulty built environments',
        'Role of transportation and housing in access to care'
      ],
      focuses: [
        { title: 'Money, education & support', prompt: 'How might work, education, income, or social support affect this person’s options?', ids: [66,70,172,181,182,183,190,192,193,197,198,200,202] },
        { title: 'Access to food', prompt: 'What clues tell you that getting enough food is difficult? How would you connect the household with support?', ids: [199,203], gap: 'These cards address food insecurity. The deck does not directly test food deserts; review that distinct concept in your notes.' },
        { title: 'Housing, transport & surroundings', prompt: 'Could the place someone lives or the trip to an appointment be part of the problem?', ids: [44,186,191,195,215,229,230,232,233,236,240], gap: 'These are related scenarios about transportation, residential location, and environmental risks. Review the blueprint’s broader built-environment and housing-access concepts in your notes too.' }
      ]
    },
    {
      id: 'bp-culture', title: 'Cultural Competence',
      conversation: 'How can you understand the person without making assumptions?',
      description: 'Notice your assumptions, ask about what matters to the client, and explain how your approach supports respectful, effective care.',
      objectives: [
        'Concepts: implicit bias, stereotyping, diversity',
        'Benefits of culturally competent care: improved health outcomes, lower disparities',
        'Variations in health beliefs, decision-making, service utilization'
      ],
      focuses: [
        { title: 'Bias, stereotypes & diversity', prompt: 'Are you responding to this individual, or making an assumption about a group? How would you check yourself?', ids: [205,212,218,220,221,225], gap: 'The deck directly covers stereotyping, diversity, and cultural humility. Review implicit bias explicitly in your course notes.' },
        { title: 'Better care across cultures', prompt: 'What could the nurse or organization change to improve communication and reduce disparities?', ids: [82,206,207,208,211,215,217,223,226,228] },
        { title: 'Beliefs, decisions & use of services', prompt: 'What would you ask about the client’s beliefs, family roles, preferences, or experiences with health care?', ids: [204,210,213,214,216,219,222,224,227] }
      ]
    },
    {
      id: 'bp-communication', title: 'Communication & Client-Centered Care',
      conversation: 'What would you actually say to this client?',
      description: 'Try saying your response out loud. Keep it clear and compassionate, check understanding, and leave room for the client’s own choices.',
      objectives: ['Active listening, compassion, direct communication', 'Client self-efficacy and autonomy'],
      focuses: [
        { title: 'Listen and respond', prompt: 'What response would help the client feel heard and encourage them to tell you more?', ids: [40,43,79,89,101,213] },
        { title: 'Make the message understandable', prompt: 'How would you explain this clearly and check that your teaching made sense?', ids: [82,90,108,111,117,120,201,211,216,228] },
        { title: 'Confidence, choices & autonomy', prompt: 'How would you help the person build confidence while respecting their decisions?', ids: [58,64,65,69,92,93,96,98,114,116,121,162] }
      ]
    }
  ]
};

window.BLUEPRINT.sections.forEach(section => {
  section.ids = [...new Set(section.focuses.flatMap(focus => focus.ids))];
});
