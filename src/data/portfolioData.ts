export type EditionId = 'calibre' | 'signal' | 'compiler' | 'fusion';

export interface EditionTheme {
  id: EditionId;
  code: string;
  name: string;
  subtitle: string;
  badge: string;
  primaryHex: string;
  secondaryHex: string;
  tertiaryHex: string;
  headingFontClass: string;
  accentTextClass: string;
  accentBorderClass: string;
  accentBgClass: string;
  buttonClass: string;
  description: string;
}

export const EDITION_THEMES: Record<EditionId, EditionTheme> = {
  calibre: {
    id: 'calibre',
    code: 'ED.01 // CALIBRE',
    name: 'Calibre 01 · Aether Horology',
    subtitle: 'Tourbillon Escapement, Ruby Pivot & Sapphire Monolith',
    badge: 'HOROLOGY GOLD',
    primaryHex: '#D4AF37',
    secondaryHex: '#38BDF8',
    tertiaryHex: '#E11D48',
    headingFontClass: 'font-cinzel tracking-wide',
    accentTextClass: 'text-[#D4AF37]',
    accentBorderClass: 'border-[#D4AF37]/40',
    accentBgClass: 'bg-[#D4AF37]/15',
    buttonClass:
      'bg-[#D4AF37] text-[#07080B] hover:bg-[#e5c349] shadow-[0_0_28px_rgba(212,175,55,0.38)]',
    description:
      'High-complication mechanical horology engine with 36-tooth tourbillon cage, meshing pinion train, Archimedean hairspring, and Cinzel display typography.',
  },
  signal: {
    id: 'signal',
    code: 'ED.02 // SIGNAL CORE',
    name: 'Signal Core · Cyber Telemetry',
    subtitle: 'Isometric Architecture, Neural Routing & <SS/> Beacon',
    badge: 'SIGNAL CYAN',
    primaryHex: '#38BDF8',
    secondaryHex: '#D4AF37',
    tertiaryHex: '#10B981',
    headingFontClass: 'font-cinzel tracking-wide',
    accentTextClass: 'text-[#38BDF8]',
    accentBorderClass: 'border-[#38BDF8]/40',
    accentBgClass: 'bg-[#38BDF8]/15',
    buttonClass:
      'bg-[#38BDF8] text-[#07080B] hover:bg-sky-300 shadow-[0_0_28px_rgba(56,189,248,0.38)]',
    description:
      '90-frame piecewise telemetry sequence with isometric VIT Campus Marketplace node graph, live packet streams, and 5-satellite AI agent constellation.',
  },
  compiler: {
    id: 'compiler',
    code: 'ED.03 // COMPILER 3D',
    name: 'Terminal Matrix · 3D Compiler',
    subtitle: '3D AST Node Projection, Pointer Graph & Holographic Ring',
    badge: 'TERMINAL CYAN',
    primaryHex: '#00F2FE',
    secondaryHex: '#D4AF37',
    tertiaryHex: '#10B981',
    headingFontClass: 'font-playfair tracking-normal',
    accentTextClass: 'text-[#00F2FE]',
    accentBorderClass: 'border-[#00F2FE]/40',
    accentBgClass: 'bg-[#00F2FE]/15',
    buttonClass:
      'bg-[#00F2FE] text-[#07080B] hover:bg-[#5ff7ff] shadow-[0_0_28px_rgba(0,242,254,0.4)]',
    description:
      '3D perspective compiler node-graph engine with Z-axis camera push, dynamic pointer edge tessellation, and systems engineering aesthetic.',
  },
  fusion: {
    id: 'fusion',
    code: 'ED.04 // GRAND FUSION',
    name: 'VIT Academic Navy × Horology Gold',
    subtitle: 'Coaxial Tourbillon + Isometric Telemetry + 3D Node Field',
    badge: 'BAENG101 EDITION',
    primaryHex: '#D4AF37',
    secondaryHex: '#38BDF8',
    tertiaryHex: '#10B981',
    headingFontClass: 'font-cinzel tracking-wide',
    accentTextClass: 'text-[#D4AF37]',
    accentBorderClass: 'border-[#D4AF37]/45',
    accentBgClass: 'bg-[#D4AF37]/15',
    buttonClass:
      'bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#38BDF8] text-[#07080B] hover:brightness-110 shadow-[0_0_32px_rgba(212,175,55,0.42)]',
    description:
      'Synthesizes Deep Obsidian (#07080B), VIT Academic Navy (#0B1933), Horology Brushed Gold (#D4AF37), and Signal Cyan (#38BDF8) with all three 60fps engines.',
  },
};

export interface StoryScene {
  id: '01' | '01T' | '02' | '02T' | '03' | '04';
  code: string;
  shortLabel: string;
  hudTitle: string;
  type: 'content' | 'transition';
  alignment: 'left' | 'right' | 'center';
  eyebrow: string;
  heading: string;
  body: string;
  metrics?: { value: string; label: string; colorClass?: string }[];
  tags?: string[];
  primaryCta?: { label: string; target?: string; action?: string };
  secondaryCta?: { label: string; target?: string; url?: string; action?: string };
  frameRange: [number, number];
  holdFrame: number | null;
  scrollRange: [number, number];
  scrollJump: number;
  pacingNote: string;
}

export interface ProjectItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack & Cloud' | 'AI & Agents' | 'Academic & Multidisciplinary' | 'Systems & Algorithms';
  status: string;
  isTemplate: boolean;
  period: string;
  stack: string[];
  summary: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  architectureNodes?: string[];
  liveDisplay?: string;
  codeDisplay?: string;
  pdfUrl?: string;
  pdfLabel?: string;
  links: { label: string; url: string }[];
}

export interface SkillRatingItem {
  name: string;
  score: number;
  max: number;
}

export interface AcademicWorkCard {
  id: string;
  eyebrow: string;
  title: string;
  ratingBadge?: string;
  body: string;
  verdict?: string;
  whatItShows: string;
  highlightsHeader?: string;
  highlights: string[];
  docUrl?: string;
  docLabel?: string;
}

export interface ActivityItem {
  period: string;
  title: string;
  detail: string;
}

export interface CertificateItem {
  id: string;
  num: string;
  title: string;
  organizer: string;
  club: string;
  date: string;
  fest: string;
  sponsor: string;
  credentialType: string;
  recipient: string;
  regNo: string;
  highlightBadge: string;
  description: string;
  verificationCode: string;
  accentColor: string;
  imageUrl: string;
  localPdfUrl: string;
  signatoryLeft?: { name: string; role: string };
  signatoryRight?: { name: string; role: string };
  pdfUrl?: string;
}

export interface ReflectionBlock {
  label: string;
  body: string;
}

export interface QrLinkItem {
  id: string;
  label: string;
  sublabel: string;
  url: string;
  accent: 'gold' | 'cyan';
}

export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  org: string;
  badge: string;
  category: 'Academic' | 'Engineering' | 'Competition' | 'AI & Cloud';
  isTemplate: boolean;
  detail: string;
  metrics?: string;
}

export interface PortfolioContent {
  courseMeta: {
    institutionHeader: string;
    departmentHeader: string;
    courseCodeTitle: string;
    portfolioTitle: string;
    portfolioSubtitle: string;
    registerNumber: string;
    classYear: string;
    faculty: string;
    semester: string;
    rubricBadge: string;
  };
  aboutMe: {
    sidebarStats: { value: string; label: string }[];
    headline: string;
    paragraph1: string;
    paragraph2: string;
    structuredRows: { label: string; value: string }[];
  };
  skillsSection: {
    technical: SkillRatingItem[];
    communication: SkillRatingItem[];
    tools: string[];
    otherNote: string;
    selfAssessedNote: string;
  };
  academicWork: AcademicWorkCard[];
  activities: ActivityItem[];
  certificates: CertificateItem[];
  reflection: ReflectionBlock[];
  conclusion: {
    summary: string;
    vitEmail: string;
    personalEmail: string;
    phone: string;
    linkedinDisplay: string;
    linkedinUrl: string;
    githubDisplay: string;
    githubUrl: string;
    qrLinks: QrLinkItem[];
  };
  profile: {
    name: string;
    monogram: string;
    regNo: string;
    role: string;
    tagline: string;
    institution: string;
    institutionUrl: string;
    cohort: string;
    priorSchool: string;
    priorSchoolUrl: string;
    location: string;
    email: string;
    sgpa: string;
    dsaSolved: string;
    links: {
      github: string;
      campusMarketplaceRepo: string;
      vercel: string;
      geeksforgeeks: string;
      linkedin: string;
      kaggle: string;
      unstop: string;
    };
  };
  scenes: StoryScene[];
  projects: ProjectItem[];
  milestones: MilestoneItem[];
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  courseMeta: {
    institutionHeader: 'Vellore Institute of Technology',
    departmentHeader: 'School of Social Sciences and Languages, Department of English',
    courseCodeTitle: 'BAENG101 Technical English Communication Lab',
    portfolioTitle: 'Saket Subhadarshee — B.Tech. Information Technology',
    portfolioSubtitle: 'Academic & Professional Portfolio',
    registerNumber: '26BIT0190',
    classYear: 'Year 1',
    faculty: 'Dr. Atul Kumar Singh',
    semester: 'Fall Semester 2026–27',
    rubricBadge: 'CAT-2 | CO1 | BT3 | Module 5: Creating a Portfolio',
  },
  aboutMe: {
    sidebarStats: [
      { value: 'Year 1', label: 'B.Tech. IT (26BIT0190)' },
      { value: '4', label: 'technical projects' },
      { value: '3', label: 'graVITas’26 certificates' },
      { value: 'ADS-B & AI', label: 'telemetry & quiz lead' },
    ],
    headline:
      'I am a first-year B.Tech. Information Technology student at VIT Vellore, and I learn best by building and shipping real systems.',
    paragraph1:
      "In my first semester I have built a full-stack peer-to-peer student exchange platform (VIT Campus Marketplace), a live 1090 MHz aircraft telemetry dashboard (AeroPulse ADS-B), and completed the Google Cloud Skills Boost Arcade: Cloud Compute, Data & Observability Suite (achieving 100.0% scores across three timed Google Cloud Challenge Labs), alongside my coursework and a five-member multidisciplinary research project under Dr. John Thomas at VIT's Centre for Nanobiotechnology.",
    paragraph2:
      'Outside the classroom, I graduated from DAV Public School, Chandrasekharpur in Bhubaneswar, completed the 5-Day AI Agents Intensive with Google and Kaggle, qualified for Round 2 Indoor of Clueminati 4.0 at graVITas’26, coordinated ADS-B flight tracking receiver operations with FlightAware, and led student quiz and hackathon squads on Unstop. These experiences taught me how to lead a team, debug under a tight deadline, and communicate clearly with the people who actually use what I build—which is why I gravitate toward work where software engineering meets product strategy.',
    structuredRows: [
      {
        label: 'Career goal',
        value:
          'Full-stack and AI systems engineer who builds products people rely on daily, growing towards technical product architecture and engineering management roles.',
      },
      {
        label: 'Interests',
        value:
          'Full-stack web and app development, agentic AI workflows, aviation ADS-B telemetry, hackathon operations, competitive quizzing, and badminton.',
      },
      {
        label: 'Strengths',
        value:
          'Leadership, learning by doing, cross-disciplinary teamwork, clear technical writing, and ownership under deadlines.',
      },
    ],
  },
  skillsSection: {
    technical: [
      { name: 'HTML, CSS and Tailwind CSS', score: 8, max: 10 },
      { name: 'Python and Data Structures', score: 8, max: 10 },
      { name: 'JavaScript, React and Firebase', score: 7, max: 10 },
      { name: 'Git, GitHub Actions and Vercel CI/CD', score: 7, max: 10 },
      { name: 'AI-assisted development with Gemini API & Claude Code', score: 9, max: 10 },
    ],
    communication: [
      { name: 'Leadership and team management', score: 8, max: 10 },
      { name: 'Event planning and hackathon operations', score: 7, max: 10 },
      { name: 'Technical documentation and research synthesis', score: 8, max: 10 },
      { name: 'Presentation and public speaking', score: 8, max: 10 },
      { name: "Written and technical English (Hyland's Model)", score: 8, max: 10 },
    ],
    tools: [
      'VS Code',
      'GitHub',
      'Python',
      'JavaScript',
      'React',
      'Firebase',
      'Vercel',
      'Google AI Studio',
      'Gemini API',
      'Kaggle',
      'Claude Code',
      'OrCAD PSpice',
      'Canva Pro',
      'Google Workspace',
    ],
    otherNote:
      'Operating ADS-B flight telemetry receivers and managing cloud CI/CD deployments for student teams.',
    selfAssessedNote: 'Skill levels are self-assessed.',
  },
  academicWork: [
    {
      id: 'hyland-abstract-analysis',
      eyebrow: 'BAENG101 · Group presentation & rhetorical move dossier',
      title: 'Technical Writing & Hyland’s Five-Move Abstract Analysis',
      ratingBadge: '5 Foundational AI Papers · 5-Move Matrix',
      body: 'With my lab cohort, I prepared the analytical script, comparative matrix, and supporting slide deck on what makes technical writing and scientific abstracts clear and usable. We evaluated five foundational AI research papers (Attention Is All You Need, ResNet, BERT, Generative Adversarial Nets, and GPT-3) against Ken Hyland’s Five-Move Model (Introduction → Purpose → Method → Product → Conclusion), alongside our Mind Over Motion (Prime Vera) systems ergonomics brief.',
      whatItShows:
        'Organising dense technical literature for an engineering audience, identifying structural omissions (such as ResNet omitting Move 5), and presenting findings cohesively as a team.',
      highlightsHeader: 'EVALUATED RESEARCH CORPUS & ERGONOMICS BRIEF',
      highlights: [
        'Attention Is All You Need (Vaswani et al.) — Complete 5-Move progression with explicit BLEU score Product (M4) & Conclusion (M5).',
        'Deep Residual Learning / ResNet (He et al.) — Structural omission detected: stops at Move 4 (ImageNet 3.57% error) without Move 5.',
        'BERT, GANs & GPT-3 — Comparative mapping of Purpose (M2), Architecture Method (M3), and Empirical Product (M4).',
        'Mind Over Motion (Prime Vera) — Co-authored stakeholder, burden-of-proof, and systems ergonomics argumentation brief.',
      ],
      docUrl: 'https://drive.google.com/open?id=1lTPn5TQl_jiyj5Lyha_LkqKOlTel9eGrWsPbOWs1QUY',
      docLabel: 'Open Abstract Analysis Dossier (Google Drive) ↗',
    },
    {
      id: 'kite-runner-book-review',
      eyebrow: 'BAENG101 · Individual spoken book review, 5½ minutes',
      title: 'Book Review: The Kite Runner by Khaled Hosseini',
      ratingBadge: 'Rated 4.5 / 5 ★',
      body: 'A solo spoken review of The Kite Runner, Khaled Hosseini’s historical novel tracing friendship, betrayal, and redemption across 1970s Kabul and immigrant life in California. I structured and delivered it as seven timed parts with clear narrative transitions: Amir and Hassan’s childhood bond in Kabul, the winter kite-fighting tournament and the betrayal in the alley, Amir and Baba’s displacement to Fremont after the Soviet invasion, Rahim Khan’s phone call ("There is a way to be good again"), the return to Taliban-ruled Kabul to rescue Sohrab, and the closing kite-flying scene.',
      verdict:
        'My verdict was balanced. The storytelling is vivid, emotionally resonant, and easy to follow, and the contrast between Baba’s public strength, Amir’s quiet guilt, and Hassan’s unwavering loyalty ("For you, a thousand times over") gives it lasting depth, though a few late-stage plot coincidences in Kabul feel slightly melodramatic. I rated it 4.5 out of 5.',
      whatItShows:
        'Reading critically, forming a fair literary judgement, and scripting and delivering a timed 5½-minute solo presentation with clear pacing and structure.',
      highlightsHeader: 'SEVEN TIMED SCRIPT SEGMENTS (5M 30S · SOLO PRESENTATION)',
      highlights: [
        '00:00–00:45 · Part 1: Amir and Hassan’s childhood bond in 1970s Kabul.',
        '00:45–01:35 · Part 2: The winter kite-fighting tournament & the betrayal in the alley.',
        '01:35–02:25 · Part 3: Amir and Baba’s displacement to Fremont, California after the Soviet invasion.',
        '02:25–03:15 · Part 4: Rahim Khan’s phone call ("There is a way to be good again").',
        '03:15–04:05 · Part 5: Return to Taliban-ruled Kabul to rescue Hassan’s son, Sohrab.',
        '04:05–04:50 · Part 6: The closing kite-flying scene ("For you, a thousand times over").',
        '04:50–05:30 · Part 7: Balanced literary verdict (4.5 out of 5) & solo closing synthesis.',
      ],
    },
    {
      id: 'psychology-of-memes-presentation',
      eyebrow: 'BAENG101 · Group presentation, 14-slide visual deck',
      title: 'Presentation: The Psychology of Memes — Why Do We Find Them Funny?',
      ratingBadge: '14-Slide Visual Deck · Incongruity Theory',
      body: 'With my group, I prepared and delivered a 14-slide presentation examining how internet memes operate as a high-speed cognitive and social communication medium. We broke down the four psychological drivers of meme humor—relatability, surprise, exaggeration, and shared experiences—and applied Incongruity Theory to explain why absurd or unexpected image-caption pairings trigger laughter and neural reward pathways. Using the classic "This Is Fine" comic and campus exam-week scenarios as running examples, we showed how cultural context, inside jokes, and algorithmic remixing drive viral spread, while also evaluating the dark side of memes (misinformation, cyberbullying, stereotypes, misinterpretation, and overuse).',
      whatItShows:
        'Translating psychological theory (Incongruity Theory & contextual pragmatics) into an engaging visual slide deck, balancing analytical critique with relatable examples, and presenting as a team.',
      highlightsHeader: 'KEY COGNITIVE & PRAGMATIC PILLARS (14-SLIDE DECK)',
      highlights: [
        'Four Psychological Drivers of Humor: Relatability, surprise, exaggeration, and shared generational/campus experiences.',
        'Incongruity Theory & Neural Reward: Why unexpected image-caption mismatches ("This Is Fine" comic & exam-week tropes) trigger cognitive resolution and laughter.',
        'Virality & Cultural Pragmatics: Shared cultural context, inside jokes, and algorithmic remixing across digital communities.',
        'Critical Evaluation (The Dark Side): Misinformation, cyberbullying, stereotypes, contextual misinterpretation, and semantic fatigue.',
      ],
      docUrl: 'https://drive.google.com/file/d/1lly3HbEb4qrEc9x_-wvRF7_RpZGzKEQ1/view?usp=drivesdk',
      docLabel: 'Open 14-Slide Psychology of Memes Deck (Google Drive) ↗',
    },
    {
      id: 'nep-2020-group-discussion',
      eyebrow: 'BAENG101 · Three-round structured academic group discussion',
      title: 'Group Discussion: National Education Policy (NEP) 2020’s Linguistic Policies',
      ratingBadge: '3-Round Panel · Bilingual Scaffolding Model',
      body: 'A three-round academic group discussion evaluating NEP 2020’s recommendation of prioritizing mother-tongue or regional-language instruction up to Grade 5 and Grade 8. Across Round 1 (Opening & Framing the Core Dilemma) and Round 2 (Deepening the Debate & Rebuttals), our five-speaker panel weighed foundational cognitive absorption, neuroplasticity, and lower dropout rates for first-generation learners against pragmatic market realities—including English as the currency of higher education and coding, Grade 9/11 STEM transition shock, inter-state mobility for relocating families, and the shortage of bilingual teachers and technical glossaries. In Round 3 (Synthesis & Group Conclusion), we reconciled these perspectives into a three-part Bilingual Scaffolding Model: (1) using the regional language in Grades 1–5 to secure core conceptual logic while introducing standard English mathematical and scientific keywords side by side; (2) building a structured dual-medium bridge in Grades 6–8 to prevent secondary-school transition shock; and (3) investing in standardized digital courseware and bilingual teacher training across urban and rural schools.',
      whatItShows:
        'Engaging constructively in multi-speaker academic discourse, weighing socio-economic and pedagogical trade-offs, and synthesizing competing viewpoints into an actionable policy consensus.',
      highlightsHeader: 'THREE-ROUND ACADEMIC DISCOURSE & BILINGUAL SCAFFOLDING MODEL',
      highlights: [
        'Round 1 (Opening & Framing): Cognitive absorption, neuroplasticity, and reduced dropout rates vs. global STEM/coding fluency in English.',
        'Round 2 (Debate & Rebuttals): Grade 9/11 STEM transition shock, inter-state student mobility, and bilingual teacher/glossary bottlenecks.',
        'Round 3 (Bilingual Scaffolding Consensus): Dual-terminology in Grades 1–5, structured dual-medium bridge in Grades 6–8, and standardized digital courseware.',
      ],
      docUrl: 'https://drive.google.com/file/d/1jWD-Tggwe8OYlwsOE8wVsWfr6_SSHRFn/view?usp=drivesdk',
      docLabel: 'Open NEP 2020 Group Discussion Dossier (Google Drive) ↗',
    },
  ],
  activities: [
    {
      period: '18–20 Sep 2026',
      title: 'graVITas’26, VIT’s techno-management fest',
      detail:
        'Took part in three events at graVITas’26 in association with HCLTech: Battle In Borderland 2.0, Clueminati 4.0 (Round 2 Indoor Qualifier), and VinHack (details in Section 05).',
    },
    {
      period: 'Aviation telemetry & quizzing',
      title: 'Technical clubs, Unstop & ADS-B network operations',
      detail:
        'Completed the 5-Day AI Agents Intensive with Google & Kaggle, managed ADS-B flight tracking receiver workflows with FlightAware, and led student quiz and hackathon teams on Unstop.',
    },
    {
      period: 'Cloud & digital operations',
      title: 'Deployment & security management',
      detail:
        'Managed GitHub secret-scanning audits, Vercel production deployments, and collaborative documentation for student engineering teams.',
    },
  ],
  certificates: [
    {
      id: 'cert-borderland',
      num: '01',
      title: 'Battle In Borderland 2.0',
      organizer: 'graVITas’26 · VIT Vellore',
      club: 'graVITas’26 Organizing Committee · VIT Vellore in association with HCLTech',
      date: '18–20 Sep 2026',
      fest: 'graVITas’26 · VIT Vellore',
      sponsor: 'In Association with HCLTech',
      credentialType: 'Official Certificate of Participation',
      recipient: 'Saket Subhadarshee',
      regNo: '{26BIT0190}',
      highlightBadge: '18–20 Sep 2026 · graVITas’26, VIT Vellore in association with HCLTech',
      description:
        'Official Certificate of Participation presented to Saket Subhadarshee ({26BIT0190}), signed by Dr. Sudhakar N (Convenor, graVITas’26) and Dr. Partha Sharathi Mallick (Pro-Vice Chancellor).',
      verificationCode: 'GV26-BIB2-26BIT0190',
      accentColor: '#D4AF37',
      imageUrl: '/certificates/battle-in-borderland-2-0.png',
      localPdfUrl: '/certificates/battle-in-borderland-2-0.pdf',
      signatoryLeft: { name: 'Dr. Sudhakar N', role: 'Convenor, graVITas’26' },
      signatoryRight: { name: 'Dr. Partha Sharathi Mallick', role: 'Pro-Vice Chancellor, VIT' },
      pdfUrl: 'https://drive.google.com/file/d/1ccRbpom8STkmDUXTjy177P6zGVa7owUv/view?usp=drivesdk',
    },
    {
      id: 'cert-clueminati',
      num: '02',
      title: 'Clueminati 4.0',
      organizer: 'CodeChef VIT',
      club: 'CodeChef VIT · graVITas’26 in association with HCLTech',
      date: '18–20 Sep 2026',
      fest: 'graVITas’26 · VIT Vellore',
      sponsor: 'In Association with HCLTech',
      credentialType: 'Official Certificate of Participation · Round 2 Indoor Qualifier',
      recipient: 'Saket Subhadarshee',
      regNo: '{26BIT0190}',
      highlightBadge: '18–20 Sep 2026 · graVITas’26, VIT Vellore in association with HCLTech · CodeChef VIT',
      description:
        'Official Certificate of Participation (Round 2 Indoor Qualifier) presented to Saket Subhadarshee ({26BIT0190}), signed by Dr. Sudhakar N (Convenor, graVITas’26) and Dr. Partha Sharathi Mallick (Pro-Vice Chancellor).',
      verificationCode: 'GV26-CCV-CLM4-26BIT0190',
      accentColor: '#38BDF8',
      imageUrl: '/certificates/clueminati-4-0.png',
      localPdfUrl: '/certificates/clueminati-4-0.pdf',
      signatoryLeft: { name: 'Dr. Sudhakar N', role: 'Convenor, graVITas’26' },
      signatoryRight: { name: 'Dr. Partha Sharathi Mallick', role: 'Pro-Vice Chancellor, VIT' },
      pdfUrl: 'https://drive.google.com/file/d/1ful6vf0vyZRS4Uow6hnJE0Jtxc0bvnHR/view?usp=drivesdk',
    },
    {
      id: 'cert-vinhack',
      num: '03',
      title: 'VINHACK',
      organizer: 'VinnovateIT · graVITas’26',
      club: 'VinnovateIT · VIT Vellore in association with HCLTech',
      date: '18–20 Sep 2026',
      fest: 'graVITas’26 · VIT Vellore',
      sponsor: 'In Association with HCLTech',
      credentialType: 'Official Certificate of Participation · Hackathon Sprint',
      recipient: 'Saket Subhadarshee',
      regNo: '{26BIT0190}',
      highlightBadge: '18–20 Sep 2026 · graVITas’26, VIT Vellore in association with HCLTech · VinnovateIT',
      description:
        'Official Certificate of Participation in VINHACK conducted during graVITas 2026 at Vellore Institute of Technology, Vellore, signed by Dr. Sudhakar N (Convenor, graVITas’26) and Dr. Partha Sharathi Mallick (Pro-Vice Chancellor).',
      verificationCode: 'GV26-VIN-HACK-26BIT0190',
      accentColor: '#10B981',
      imageUrl: '/certificates/vinhack.png',
      localPdfUrl: '/certificates/vinhack.pdf',
      signatoryLeft: { name: 'Dr. Sudhakar N', role: 'Convenor, graVITas’26' },
      signatoryRight: { name: 'Dr. Partha Sharathi Mallick', role: 'Pro-Vice Chancellor, VIT' },
      pdfUrl: '/certificates/vinhack.pdf',
    },
  ],
  reflection: [
    {
      label: 'What changed',
      body: 'Looking back at my first semester at VIT Vellore, the biggest change is confidence in building end-to-end systems. I arrived from Bhubaneswar thinking of programming mostly as classroom exercises, yet within a few months I had built and put online real projects—VIT Campus Marketplace on Vercel, AeroPulse ADS-B, and 100%-scored Google Cloud Skills Boost Arcade challenge labs across Compute Engine, Cloud Storage, and Cloud Monitoring—by breaking each problem into small steps and learning Firebase, GCP infrastructure, and Gemini APIs as I needed them.',
    },
    {
      label: 'What I learnt from this course',
      body: 'Technical English Communication Lab (BAENG101) showed me that explaining work matters as much as doing it. Evaluating AI research abstracts with Hyland’s Five-Move Model, delivering my solo spoken review of The Kite Runner, presenting The Psychology of Memes with my team, and debating NEP 2020’s Linguistic Policies in our three-round group discussion taught me to structure arguments for a listener, pace a solo talk to time, and build consensus across diverse viewpoints.',
    },
    {
      label: 'What I want to improve',
      body: 'The area I most want to improve is algorithmic depth. AI-assisted tools helped me move fast, but I want to understand every line and time-complexity trade-off well enough to explain it on my own, so I am strengthening my fundamentals in Data Structures and Algorithms alongside my projects. I also want to balance my hackathon builds and coursework more evenly.',
    },
    {
      label: 'Next',
      body: 'I will update this portfolio every semester so it stays an honest record of that growth.',
    },
  ],
  conclusion: {
    summary:
      'This portfolio captures where I stand after my first semester at VIT: an Information Technology student who learns by building, with a background in agentic AI, aviation telemetry, and technical communication that shapes how I work in teams. I will keep adding stronger projects, certifications, and evidence of learning as I progress through my degree.',
    vitEmail: 'saket.subhadarshee2026@vitstudent.ac.in',
    personalEmail: 'saket.subhadarshee@gmail.com',
    phone: '+91 63717 62150',
    linkedinDisplay: 'linkedin.com/in/saket-subhadarshee-57981b424/',
    linkedinUrl: 'https://www.linkedin.com/in/saket-subhadarshee-57981b424/',
    githubDisplay: 'github.com/saket-subhadarshee',
    githubUrl: 'https://github.com/saket-subhadarshee',
    qrLinks: [
      {
        id: 'qr-aquaculture-pdf',
        label: 'Aquaculture MDP PDF',
        sublabel: '22-Slide Project Review – I',
        url: 'https://drive.google.com/file/d/1rCYguV18uSwjeKbFRf5-ZPTMUkcXtkBi/view?usp=drivesdk',
        accent: 'gold',
      },
      {
        id: 'qr-marketplace',
        label: 'Campus Marketplace',
        sublabel: 'delete-ruby.vercel.app',
        url: 'https://delete-ruby.vercel.app',
        accent: 'cyan',
      },
      {
        id: 'qr-linkedin',
        label: 'LinkedIn',
        sublabel: '/in/saket-subhadarshee-57981b424/',
        url: 'https://www.linkedin.com/in/saket-subhadarshee-57981b424/',
        accent: 'gold',
      },
      {
        id: 'qr-github',
        label: 'GitHub',
        sublabel: 'github.com/saket-subhadarshee',
        url: 'https://github.com/saket-subhadarshee',
        accent: 'cyan',
      },
    ],
  },
  profile: {
    name: 'Saket Subhadarshee',
    monogram: 'SS',
    regNo: '26BIT0190',
    role: 'B.Tech. Information Technology · Year 1',
    tagline:
      'I am a first-year B.Tech. Information Technology student at VIT Vellore, and I learn best by building and shipping real systems.',
    institution: 'Vellore Institute of Technology (VIT), Vellore Campus',
    institutionUrl: 'https://vit.ac.in/',
    cohort: 'Class of 2030 (2026–2030)',
    priorSchool: 'DAV Public School, Chandrasekharpur, Bhubaneswar (CBSE XII, 2026)',
    priorSchoolUrl: 'https://davcsp.org/',
    location: 'Vellore, Tamil Nadu · Bhubaneswar, Odisha, India',
    email: 'saket.subhadarshee@gmail.com',
    sgpa: '9.34',
    dsaSolved: '180+',
    links: {
      github: 'https://github.com/saket-subhadarshee',
      campusMarketplaceRepo: 'https://github.com/saket-subhadarshee/Campus-Marketplace-for-VIT',
      vercel: 'https://delete-ruby.vercel.app',
      geeksforgeeks: 'https://www.geeksforgeeks.org/profile/',
      linkedin: 'https://www.linkedin.com/in/saket-subhadarshee-57981b424/',
      kaggle: 'https://www.kaggle.com/',
      unstop: 'https://unstop.com/',
    },
  },
  scenes: [
    {
      id: '01',
      code: '01 — Genesis',
      shortLabel: '01',
      hudTitle: '01 / GENESIS',
      type: 'content',
      alignment: 'left',
      eyebrow: 'BAENG101 PORTFOLIO · SAKET SUBHADARSHEE · 26BIT0190',
      heading: 'Building and shipping real systems from Year 1 at VIT Vellore.',
      body: 'Academic & Professional Portfolio for BAENG101 Technical English Communication Lab (Fall Semester 2026–27, Faculty: Dr. Atul Kumar Singh). Showcasing VIT Campus Marketplace, AeroPulse ADS-B, Google Cloud Skills Boost Arcade (100% Challenge Labs), and Aquaculture Multidisciplinary Research.',
      metrics: [
        { value: '26BIT0190', label: 'Registration Number', colorClass: 'text-[#D4AF37]' },
        { value: '4 Projects', label: 'Web, ADS-B & AI', colorClass: 'text-sky-400' },
        { value: '3 Certs', label: 'graVITas’26 Fest', colorClass: 'text-emerald-400' },
      ],
      primaryCta: {
        label: '01 About Me ↓',
        target: '#about-me',
      },
      secondaryCta: {
        label: '03 Best Academic Work ↓',
        target: '#academic-work',
      },
      frameRange: [0, 17],
      holdFrame: 17,
      scrollRange: [0.0, 0.22],
      scrollJump: 0.08,
      pacingNote:
        'Continuous motion (Frames 00–17) followed by a precision still-frame hold on Frame 17 for unhurried hero reading.',
    },
    {
      id: '01T',
      code: '01T — Gear & Signal Flight',
      shortLabel: '01T',
      hudTitle: '01T / TRANSITION',
      type: 'transition',
      alignment: 'center',
      eyebrow: '01T — LATERAL CAMERA SWEEP · GEAR TRAIN & PACKET FLIGHT',
      heading: 'Signal in Flight · Coaxial Engagement',
      body: 'Camera sweeps laterally across the stage as the tourbillon gear train meshes with the isometric architecture bus.',
      frameRange: [18, 31],
      holdFrame: null,
      scrollRange: [0.22, 0.34],
      scrollJump: 0.28,
      pacingNote:
        'Isolated kinetic transition beat (Frames 18–31). Opening grid recedes as data packets stream toward the full-stack architecture stage.',
    },
    {
      id: '02',
      code: '02 — Calibre & Architecture',
      shortLabel: '02',
      hudTitle: '02 / CALIBRE',
      type: 'content',
      alignment: 'right',
      eyebrow: '02 / FULL-STACK BUILD · GITHUB & VERCEL EDGE',
      heading: 'From hostel problem to deployed campus platform.',
      body: 'Built VIT Campus Marketplace—a peer-to-peer web platform connecting students to buy, sell, and trade campus essentials. Configured with Firebase, hardened through GitHub secret-scanning audits, and deployed via Vercel preview pipelines.',
      metrics: [
        { value: 'FIREBASE', label: 'Realtime Auth & DB', colorClass: 'text-white' },
        { value: 'VERCEL CI', label: 'Edge Preview Pipelines', colorClass: 'text-[#D4AF37]' },
        { value: 'SEC-AUDIT', label: 'GitHub Secret Scan', colorClass: 'text-sky-400' },
      ],
      primaryCta: {
        label: 'Inspect Marketplace Case Study',
        action: 'openProject:campus-marketplace',
      },
      secondaryCta: {
        label: 'GitHub Repository ↗',
        url: 'https://github.com/saket-subhadarshee/Campus-Marketplace-for-VIT',
      },
      frameRange: [32, 51],
      holdFrame: 51,
      scrollRange: [0.34, 0.56],
      scrollJump: 0.45,
      pacingNote:
        'Secondary meshing wheel and isometric node graph lock into formation (Frames 32–51) with live telemetry pulses.',
    },
    {
      id: '02T',
      code: '02T — Balance Spring & Neural Routing',
      shortLabel: '02T',
      hudTitle: '02T / ROUTING',
      type: 'transition',
      alignment: 'center',
      eyebrow: '02T — ARCHIMEDEAN BALANCE SPRING · NEURAL ROUTING',
      heading: 'Neural Filaments & Hairspring Oscillation',
      body: 'High-frequency balance spring harmonics synchronize with multi-turn Gemini AI agent routing pathways.',
      frameRange: [52, 65],
      holdFrame: null,
      scrollRange: [0.56, 0.67],
      scrollJump: 0.61,
      pacingNote:
        'Sustained continuous motion (Frames 52–65). Isometric nodes give way to oscillating neural filaments and satellite orbits.',
    },
    {
      id: '03',
      code: '03 — Agents & Research',
      shortLabel: '03',
      hudTitle: '03 / AGENTS',
      type: 'content',
      alignment: 'right',
      eyebrow: '03 / BAENG101 RHETORIC, AI AGENTS & TELEMETRY',
      heading: 'Where software engineering meets technical communication.',
      body: 'Completed 100.0%-scored Google Cloud Skills Boost Arcade Challenge Labs (Compute Engine, Cloud Storage & Pub/Sub, Cloud Monitoring), built AeroPulse ADS-B (1090 MHz flight telemetry), and collaborated on a 5-member Aquaculture Multidisciplinary Project under Dr. John Thomas.',
      metrics: [
        { value: '100.0%', label: '3 GCP Challenge Labs', colorClass: 'text-[#D4AF37]' },
        { value: 'CNBT VIT', label: 'Aquaculture MDP', colorClass: 'text-white' },
        { value: '1090 MHz', label: 'AeroPulse ADS-B', colorClass: 'text-emerald-400' },
      ],
      tags: [
        'Hyland’s Five-Move Model',
        'The Kite Runner Review (4.5/5)',
        'Gemini API & Claude Code',
        'FlightAware ADS-B',
      ],
      primaryCta: {
        label: 'Inspect BAENG101 Work ↓',
        target: '#academic-work',
      },
      secondaryCta: {
        label: 'View graVITas’26 Certificates ↓',
        target: '#certificates',
      },
      frameRange: [66, 79],
      holdFrame: 79,
      scrollRange: [0.67, 0.85],
      scrollJump: 0.76,
      pacingNote:
        'Tertiary AI-Agent satellite pinion and 5-node orbital constellation lock around the core (Frames 66–79).',
    },
    {
      id: '04',
      code: '04 — Sapphire Monolith',
      shortLabel: '04',
      hudTitle: '04 / MONOLITH',
      type: 'content',
      alignment: 'center',
      eyebrow: '04 / CAT-2 · CO1 · BT3 · MODULE 5 PORTFOLIO',
      heading: 'Ready to build, learn, and ship meaningful software.',
      body: 'Full-stack and AI systems engineer in training at VIT Vellore (26BIT0190). Explore all seven portfolio sections and Appendix A certificate plates below.',
      primaryCta: {
        label: '07 Conclusion & Contact ↓',
        target: '#conclusion-contact',
      },
      secondaryCta: {
        label: '04 Technical Projects ↓',
        target: '#projects',
      },
      frameRange: [80, 89],
      holdFrame: 89,
      scrollRange: [0.85, 1.0],
      scrollJump: 0.94,
      pacingNote:
        'Monocrystalline sapphire crystal bezel and <SS/> hexagonal signal brackets materialize around the central nucleus.',
    },
  ],
  projects: [
    {
      id: 'campus-marketplace',
      num: '01',
      title: 'VIT Campus Marketplace, a peer-to-peer student exchange web app',
      subtitle: 'Real-time student exchange platform with instant category filtering',
      category: 'Full-Stack & Cloud',
      status: 'Live Production App',
      isTemplate: false,
      period: 'Fall Semester 2026–27',
      stack: ['JavaScript', 'Firebase', 'HTML/CSS', 'Vercel'],
      summary:
        'A real-time web platform for VIT Vellore students to buy, sell, and trade textbooks, electronics, and hostel essentials with instant category filtering and automated Vercel deployments.',
      highlights: [
        'Architected Firebase backend configuration for real-time item listings, instant category filtering, and VIT student authentication.',
        'Managed multi-branch repository workflows across saket-subhadarshee/Campus-Marketplace-for-VIT and resolved GitHub secret-scanning security alerts.',
        'Configured automated cloud deployment pipelines on Vercel (delete-ruby.vercel.app).',
      ],
      metrics: [
        { label: 'Live URL', value: 'delete-ruby.vercel.app' },
        { label: 'Backend', value: 'Firebase Realtime' },
        { label: 'CI/CD', value: 'Vercel Edge Deploy' },
      ],
      architectureNodes: ['Student Client UI', 'Firebase Auth & Store', 'GitHub Secret Audit', 'Vercel Edge CDN'],
      liveDisplay: 'delete-ruby.vercel.app',
      codeDisplay: 'github.com/saket-subhadarshee/Campus-Marketplace-for-VIT',
      links: [
        { label: 'Live: delete-ruby.vercel.app', url: 'https://delete-ruby.vercel.app' },
        { label: 'Code: github.com/saket-subhadarshee/Campus-Marketplace-for-VIT', url: 'https://github.com/saket-subhadarshee/Campus-Marketplace-for-VIT' },
      ],
    },
    {
      id: 'aeropulse-adsb',
      num: '02',
      title: 'AeroPulse ADS-B, a flight telemetry & airspace website',
      subtitle: 'Live 1090 MHz ADS-B aircraft transponder dashboard across BBI & MAA/Vellore',
      category: 'Systems & Algorithms',
      status: '1090 MHz Live Telemetry',
      isTemplate: false,
      period: 'Fall Semester 2026–27',
      stack: ['Python', 'JavaScript', 'FlightAware ADS-B', 'Chart.js'],
      summary:
        'A dashboard built step by step in VS Code that tracks live 1090 MHz ADS-B aircraft transponder feeds across the Bhubaneswar and Chennai/Vellore corridor, connecting my FlightAware receiver applications with interactive web visualization.',
      highlights: [
        'Tracks 1090 MHz Mode-S / ADS-B aircraft transponder packets (altitude, ground speed, heading, squawk, and callsign) across the VOBB (Bhubaneswar) to VOMM (Chennai/Vellore) corridor.',
        'Connects FlightAware ADS-B receiver operations with real-time Chart.js altitude/velocity telemetry charts.',
        'Built incrementally in VS Code using Python packet ingestion and responsive JavaScript visualization.',
      ],
      metrics: [
        { label: 'Frequency', value: '1090 MHz ADS-B' },
        { label: 'Corridor', value: 'BBI ↔ MAA / Vellore' },
        { label: 'Feed', value: 'FlightAware Network' },
      ],
      architectureNodes: ['1090 MHz RF Antenna', 'FlightAware Receiver', 'Python JSON Parser', 'Chart.js Airspace UI'],
      links: [
        { label: 'Launch Interactive Airspace Lab ↓', url: '#interactive-lab' },
        { label: 'GitHub: saket-subhadarshee', url: 'https://github.com/saket-subhadarshee' },
      ],
    },
    {
      id: 'gcp-skills-boost-arcade',
      num: '03',
      title: 'Google Cloud Skills Boost Arcade: Cloud Compute, Data & Observability Suite',
      subtitle:
        '100.0% Completion Across 3 Timed Google Cloud Challenge Labs · Google Cloud Innovators & Arcade Cohort',
      category: 'Full-Stack & Cloud',
      status: '100.0% Challenge Labs',
      isTemplate: false,
      period: 'Fall Semester 2026–27',
      stack: [
        'Google Cloud Platform',
        'Compute Engine & GKE',
        'Cloud Storage & Pub/Sub',
        'Cloud Run & Functions',
        'Cloud Monitoring & Logging',
        'gcloud CLI & IAM',
        'Vertex AI & Gemini',
      ],
      summary:
        'Comprehensive hands-on cloud infrastructure, event-driven data engineering, and production observability workloads completed under unguided, timed conditions through the Google Cloud Skills Boost Arcade program and Google Cloud Innovators. Provisioned end-to-end GCP architectures via Cloud Shell (gcloud, gsutil) and Cloud Console—achieving verified 100.0% completion scores across three scenario-based Google Cloud Challenge Labs:',
      highlights: [
        '1. Store, Process, and Manage Data on Google Cloud: Challenge Lab (100.0% Score) — Architected an event-driven serverless media-processing pipeline: provisioned regional Cloud Storage buckets, configured Pub/Sub topics and message subscriptions, and deployed a Gen-2 Cloud Run Function triggered on object-finalize events to process assets automatically with least-privilege IAM bindings.',
        '2. The Basics of Google Cloud Compute: Challenge Lab (100.0% Score) — Provisioned multi-zone Compute Engine VM instances (e2-medium) across custom VPC subnets, attached and formatted persistent block storage disks (ext4 mount persistence), configured ingress firewall rules (HTTP/80 & SSH/22 tags), and deployed a live production web server.',
        '3. Monitoring in Google Cloud: Challenge Lab (100.0% Score) — Engineered full-stack cloud observability: installed the Google Cloud Ops Agent on Compute Engine VMs, authored custom Cloud Logging log-based metrics, configured global HTTP Uptime Checks, and built automated multi-condition Alerting Policies with custom telemetry dashboards.',
        '4. Cloud Shell & Vertex AI Integration — Practiced declarative gcloud CLI scripting, IAM service account security, and Vertex AI / Gemini API cloud endpoint integration through Google Cloud Innovators.',
      ],
      metrics: [
        { label: 'Data Challenge Lab', value: '100.0% Score' },
        { label: 'Compute Challenge Lab', value: '100.0% Score' },
        { label: 'Monitoring Challenge', value: '100.0% Score' },
      ],
      architectureNodes: [
        'Compute Engine & VPC',
        'Cloud Storage & Pub/Sub',
        'Cloud Run Functions',
        'Ops Agent & Alerting',
      ],
      liveDisplay: 'go.cloudskillsboost.google/arcade',
      codeDisplay: 'www.skills.google',
      links: [
        {
          label: 'Google Cloud Arcade: go.cloudskillsboost.google/arcade',
          url: 'https://go.cloudskillsboost.google/arcade',
        },
        {
          label: 'Google Cloud Skills Boost: www.skills.google',
          url: 'https://www.skills.google/',
        },
      ],
    },
    {
      id: 'nano-biotech-mdp',
      num: '04',
      title:
        'Bacterial Diseases in Aquaculture: Identification, Extraction of Polysaccharides, and Evaluation of Antibacterial and Antioxidant Activity',
      subtitle:
        'Basic Multidisciplinary Project — Project Review – I · Centre for Nanobiotechnology, VIT Vellore · Guide: Dr. John Thomas',
      category: 'Academic & Multidisciplinary',
      status: '22-Slide Project Review – I PDF',
      isTemplate: false,
      period: 'Fall Semester 2026–27',
      stack: [
        '16S rRNA & Pathogen Profiling',
        'Bioactive Polysaccharides (EPS)',
        'FTIR / NMR / GC-MS / SEM-EDX',
        'MIC/MBC & DPPH/ORAC/TEAC',
      ],
      summary:
        'A five-member multidisciplinary research team investigating sustainable alternatives to conventional antibiotics in aquaculture: (1) identifying major bacterial pathogens (Vibrio harveyi, V. parahaemolyticus, V. anguillarum, Aeromonas hydrophila, Streptococcus iniae, Edwardsiella tarda) via phenotypic, biochemical, and 16S rRNA profiling; (2) extracting bioactive polysaccharides from macroalgae, microalgae, fungi, and microbial EPS using methanolic, ethanolic, hexanic, aqueous, and Celluclast enzyme-assisted methods characterized by FTIR, NMR, GC-MS, and SEM/EDX; and (3) evaluating MIC/MBC antibacterial and DPPH/ORAC/TEAC antioxidant activity for prophylactic aquaculture feed and water formulations.',
      highlights: [
        'Pathogen Identification: Phenotypic, biochemical, and 16S rRNA profiling of Vibrio harveyi, V. parahaemolyticus, V. anguillarum, Aeromonas hydrophila, Streptococcus iniae, and Edwardsiella tarda.',
        'Polysaccharide Extraction & Structural Characterization: Methanolic, ethanolic, hexanic, aqueous, and Celluclast enzyme-assisted extraction from macroalgae, microalgae, fungi, and microbial EPS analyzed via FTIR, NMR, GC-MS, and SEM/EDX.',
        'Bioactivity Assays: MIC/MBC antibacterial susceptibility and DPPH/ORAC/TEAC free-radical scavenging evaluation for sustainable prophylactic aquaculture feed and water formulations.',
      ],
      metrics: [
        { label: 'Guide', value: 'Dr. John Thomas' },
        { label: 'Deliverable', value: '22-Slide Review – I PDF' },
        { label: 'Centre', value: 'CNBT · VIT Vellore' },
      ],
      architectureNodes: [
        '16S rRNA Pathogen ID',
        'EPS & Algal Extraction',
        'FTIR / NMR / GC-MS / SEM',
        'MIC/MBC & DPPH/ORAC Assays',
      ],
      pdfUrl: 'https://drive.google.com/file/d/1rCYguV18uSwjeKbFRf5-ZPTMUkcXtkBi/view?usp=drivesdk',
      pdfLabel: 'Open 22-Slide Project Review – I PDF',
      links: [
        {
          label: '22-Slide Project Review – I PDF',
          url: 'https://drive.google.com/file/d/1rCYguV18uSwjeKbFRf5-ZPTMUkcXtkBi/view?usp=drivesdk',
        },
        {
          label: 'VIT Campus Marketplace',
          url: 'https://delete-ruby.vercel.app',
        },
        {
          label: 'GitHub: saket-subhadarshee',
          url: 'https://github.com/saket-subhadarshee',
        },
      ],
    },
  ],
  milestones: [
    {
      id: 'ms-gravitas',
      date: '18–20 Sep 2026',
      title: 'graVITas’26, VIT’s techno-management fest (Clueminati 4.0, VinHack, Cashflow 5.0)',
      org: 'VIT Vellore in association with HCLTech',
      badge: '3 Certificates',
      category: 'Competition',
      isTemplate: false,
      detail:
        'Took part in three events across technology and management: Clueminati 4.0 (Round 2 Indoor Qualifier, CodeChef VIT), VinHack (VinnovateIT), and Cashflow 5.0 (Bulls and Bears).',
      metrics: '3 Official Certificates · Section 05',
    },
    {
      id: 'ms-baeng101p',
      date: 'Fall 2026–27',
      title: 'BAENG101 Technical English Communication Lab Dossier & The Kite Runner Review',
      org: 'VIT Vellore · Faculty: Dr. Atul Kumar Singh',
      badge: 'CAT-2 | CO1 | BT3',
      category: 'Academic',
      isTemplate: false,
      detail:
        "Completed Hyland's Five-Move Abstract Analysis across 5 foundational AI papers with my lab cohort and a 5½-minute solo spoken review of The Kite Runner by Khaled Hosseini.",
      metrics: 'Module 5 Portfolio',
    },
    {
      id: 'ms-ai-adsb',
      date: 'Jun – Sep 2026',
      title: '5-Day AI Agents Intensive & FlightAware ADS-B Receiver Operations',
      org: 'Google & Kaggle · FlightAware · Unstop',
      badge: 'AI & Telemetry',
      category: 'AI & Cloud',
      isTemplate: false,
      detail:
        'Completed the 5-Day AI Agents Intensive with Google & Kaggle, managed 1090 MHz ADS-B flight tracking receiver workflows with FlightAware, and led student quiz and hackathon teams on Unstop.',
      metrics: 'Gemini API · 1090 MHz ADS-B',
    },
  ],
};

export const MASTER_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Saket Subhadarshee SS Signal Core Logo Master">
  <defs>
    <linearGradient id="ss-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="ss-amber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="108" height="108" rx="54" fill="#07080B" stroke="#D4AF37" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="44" fill="none" stroke="#38BDF8" stroke-width="1.2" stroke-dasharray="4 4"/>
  <path d="M38 26 L22 60 L38 94" fill="none" stroke="url(#ss-cyan)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M82 26 L98 60 L82 94" fill="none" stroke="url(#ss-cyan)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M68 36 H48 L40 48 L68 60 L56 72 H38" fill="none" stroke="#F8FAFC" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M82 48 H64 L52 60 L80 72 L72 84 H52" fill="none" stroke="url(#ss-amber)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="60" cy="60" r="4.5" fill="#38BDF8"/>
  <circle cx="38" cy="26" r="3" fill="#38BDF8"/>
  <circle cx="82" cy="94" r="3" fill="#D4AF37"/>
</svg>`;
