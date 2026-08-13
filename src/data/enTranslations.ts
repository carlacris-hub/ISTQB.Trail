import { Chapter, Question } from '../types';

export const EN_CHAPTER_OVERLAY: Record<number, {
  title: string;
  subtitle: string;
  description: string;
  syllabusReference: string;
  badgeName: string;
  badgeDesc: string;
}> = {
  1: {
    title: 'Chapter 1: Fundamentals of Testing',
    subtitle: 'Basic Concepts, Principles and Test Process',
    description: 'Understand what testing is, why it is necessary, the 7 fundamental principles, and test process activities.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 1 (180 min)',
    badgeName: 'Quality Guardian',
    badgeDesc: 'Mastered fundamental concepts and the 7 testing principles.',
  },
  2: {
    title: 'Chapter 2: Testing Throughout the SDLC',
    subtitle: 'Development Models, Test Levels and Test Types',
    description: 'Discover how testing integrates into Agile and Sequential SDLCs, component/integration/system/acceptance test levels, and maintenance testing.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 2 (130 min)',
    badgeName: 'SDLC Architect',
    badgeDesc: 'Mastered test levels, test types, and maintenance testing.',
  },
  3: {
    title: 'Chapter 3: Static Testing',
    subtitle: 'Reviews and the Static Analysis Process',
    description: 'Learn how to detect bugs before code execution through formal reviews, walkthroughs, inspections, and static analysis.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 3 (80 min)',
    badgeName: 'Inspection Inspector',
    badgeDesc: 'Mastered review types, roles, and static defect detection.',
  },
  4: {
    title: 'Chapter 4: Test Analysis and Design',
    subtitle: 'Black-Box, White-Box and Experience-Based Techniques',
    description: 'Master test design techniques: Equivalence Partitioning, Boundary Value Analysis, Decision Tables, State Transition, Statement/Decision Coverage, and Exploratory Testing.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 4 (390 min)',
    badgeName: 'Technique Master',
    badgeDesc: 'Mastered test design techniques and test coverage.',
  },
  5: {
    title: 'Chapter 5: Test Management',
    subtitle: 'Planning, Risk Analysis, Monitoring, and Defect Reports',
    description: 'Understand test planning, estimation techniques, risk-based testing, defect reporting, and configuration management.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 5 (335 min)',
    badgeName: 'Quality Leader',
    badgeDesc: 'Mastered test planning, risk management, and defect reporting.',
  },
  6: {
    title: 'Chapter 6: Test Tools',
    subtitle: 'Tool Support, Classification, and Pilot Projects',
    description: 'Learn how tools support testing, test automation benefits and risks, and best practices for tool implementation.',
    syllabusReference: 'ISTQB CTFL v4.0 - Section 6 (20 min)',
    badgeName: 'Automation Strategist',
    badgeDesc: 'Mastered test tools and automation best practices.',
  },
};

// Map of English replacements for questions (quiz & mock)
export const EN_QUESTIONS_MAP: Record<string, { stem: string; options: string[]; explanation: string; chapterTitle?: string }> = {
  // Chapter 1 Quiz
  'q1_1': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which of the following correctly describes the relationship between error, defect, and failure according to the ISTQB Glossary?',
    options: [
      'A human error produces a defect in the code, which when executed can cause a failure.',
      'A failure made by a developer produces an error in the code, causing a defect in the system.',
      'A defect is committed by a human, generating a failure in code and an error in production.',
      'Error, defect, and failure are exact synonyms in software engineering.'
    ],
    explanation: 'Errors (human mistakes) result in defects (bugs in artifacts). Executing a defect can cause a failure.'
  },
  'q1_2': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which testing principle states that repeating the same battery of tests continuously will reduce its ability to find new defects?',
    options: [
      'Defect clustering',
      'Pesticide paradox',
      'Absence-of-errors fallacy',
      'Exhaustive testing is impossible'
    ],
    explanation: 'The Pesticide Paradox establishes that repeated tests lose effectiveness and must be updated regularly.'
  },
  'q1_3': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which activity in the test process involves comparing actual observed results with expected specified results?',
    options: [
      'Test Analysis',
      'Test Design',
      'Test Execution',
      'Test Planning'
    ],
    explanation: 'During Test Execution, test cases are run and actual results are compared with expected results.'
  },
  'q1_4': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'What is the primary difference between QA (Quality Assurance) and Testing (Quality Control)?',
    options: [
      'QA focuses on process defect prevention; Testing focuses on product defect detection.',
      'QA is performed by developers; Testing is performed exclusively by end users.',
      'Testing focuses on process improvement; QA focuses on executing code.',
      'There is no difference between QA and Testing in ISTQB CTFL v4.0.'
    ],
    explanation: 'QA focuses on process improvement (preventative), while Testing focuses on finding defects in the product (corrective).'
  },
  'q1_5': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'What does the Shift-Left principle advocate in software testing?',
    options: [
      'Start testing activities as early as possible in the SDLC.',
      'Execute all tests on left-aligned user interfaces.',
      'Postpone testing until the final release stage.',
      'Shift all manual testing to automated UI scripts.'
    ],
    explanation: 'Shift-Left means starting test activities (reviews, static testing) early in the development lifecycle.'
  },

  // Chapter 2 Quiz
  'q2_1': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'In an Agile context using Scrum, when should test acceptance criteria be defined for a User Story?',
    options: [
      'During User Story creation and refined in Sprint Planning before development starts.',
      'Only after developers finish coding the story.',
      'During the Sprint Retrospective at the end of the sprint.',
      'Only if the product fails in production.'
    ],
    explanation: 'Acceptance criteria (Definition of Ready) should be established before development begins.'
  },
  'q2_2': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'Which test level focuses on verifying the interactions and interfaces between integrated components or systems?',
    options: [
      'Component Testing',
      'Integration Testing',
      'System Testing',
      'Acceptance Testing'
    ],
    explanation: 'Integration Testing evaluates interactions between integrated components or subsystems.'
  },
  'q2_3': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'What is the main objective of Maintenance Testing?',
    options: [
      'Testing changes, patches, or migrations to an existing operational system.',
      'Testing brand-new software before initial deployment.',
      'Replacing developers with automated scripts.',
      'Testing hardware power supplies.'
    ],
    explanation: 'Maintenance testing verifies modifications, fixes, or environmental changes to deployed systems.'
  },

  // Chapter 3 Quiz
  'q3_1': {
    chapterTitle: 'Static Testing',
    stem: 'Which of the following is a key advantage of Static Testing over Dynamic Testing?',
    options: [
      'Detects defects early in requirements or design before code execution, reducing correction costs.',
      'Requires full code compilation and execution servers.',
      'Replaces the need for user acceptance testing.',
      'Guarantees 100% test automation.'
    ],
    explanation: 'Static testing finds defects early in documentation/code without executing the program.'
  },
  'q3_2': {
    chapterTitle: 'Static Testing',
    stem: 'In a formal review process, who is responsible for documenting all identified defects and action items?',
    options: [
      'Review Leader',
      'Scribe (Recorder)',
      'Author',
      'Moderator'
    ],
    explanation: 'The Scribe (or Recorder) documents defects, decisions, and recommendations during the review meeting.'
  },

  // Chapter 4 Quiz
  'q4_1': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'In Equivalence Partitioning (EP), if an input field accepts integers from 1 to 10 inclusive, which set represents valid and invalid partitions?',
    options: [
      'Invalid: x < 1; Valid: 1 <= x <= 10; Invalid: x > 10.',
      'Valid: x < 1; Valid: 1 <= x <= 10; Invalid: x > 10.',
      'Valid: only x = 5.',
      'Invalid: all numbers divisible by 2.'
    ],
    explanation: 'Partitioning splits input ranges into one valid partition [1..10] and two invalid partitions [<1] and [>10].'
  },
  'q4_2': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'In 2-value Boundary Value Analysis (BVA) for the range [1..10], which test values should be selected?',
    options: [
      '0, 1, 10, 11',
      '1, 2, 9, 10',
      '-1, 0, 1, 2',
      '5, 10, 15, 20'
    ],
    explanation: '2-value BVA tests boundary values and their immediate outside neighbors: 0 (min-1), 1 (min), 10 (max), 11 (max+1).'
  },

  // Chapter 5 Quiz
  'q5_1': {
    chapterTitle: 'Test Management',
    stem: 'What is Risk-Based Testing (RBT)?',
    options: [
      'An approach where test prioritization and effort allocation are guided by product and project risk level.',
      'Testing only high-risk hardware devices.',
      'Ignoring risks until defects occur in production.',
      'Executing tests without documentation.'
    ],
    explanation: 'Risk-Based Testing prioritizes test design and execution based on likelihood and impact of failures.'
  },

  // Chapter 6 Quiz
  'q6_1': {
    chapterTitle: 'Test Tools',
    stem: 'What is a major risk when implementing a test automation tool?',
    options: [
      'Underestimating the effort required to maintain automated scripts as the application evolves.',
      'Executing tests too fast.',
      'Generating clear execution reports.',
      'Increasing test coverage.'
    ],
    explanation: 'Script maintenance overhead is frequently underestimated when adopting test automation tools.'
  },

  // Mock Exam Questions Map (mock_1 to mock_40)
  'mock_1': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which of the following describes a key testing objective?',
    options: [
      'Finding defects and evaluating quality to reduce operational risk.',
      'Proving that the software contains zero defects.',
      'Replacing software developers with automated systems.',
      'Ensuring that code is written without any comments.'
    ],
    explanation: 'Testing aims to find defects, verify requirements, and build confidence in quality.'
  },
  'mock_2': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'What is the main difference between testing and debugging?',
    options: [
      'Testing identifies failures; debugging locates, analyzes, and fixes the underlying root cause in code.',
      'Testing fixes code; debugging runs test cases.',
      'Testing is done only by users; debugging is done only by project managers.',
      'There is no distinction between testing and debugging.'
    ],
    explanation: 'Testing shows failures caused by defects; debugging finds and fixes those defects in code.'
  },
  'mock_3': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which testing principle highlights that fixing all bugs will not guarantee success if the app fails to meet user needs?',
    options: [
      'Absence-of-errors fallacy',
      'Pesticide paradox',
      'Defect clustering',
      'Exhaustive testing'
    ],
    explanation: 'The absence-of-errors fallacy states that a bug-free system is unusable if it does not satisfy user expectations.'
  },
  'mock_4': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which activity in the test process focuses on defining test conditions and identifying WHAT to test?',
    options: [
      'Test Analysis',
      'Test Execution',
      'Test Completion',
      'Test Planning'
    ],
    explanation: 'Test Analysis analyzes the test basis to derive test conditions and determine WHAT to test.'
  },
  'mock_5': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'How does testing adapt in Agile development frameworks like Scrum?',
    options: [
      'Testing is integrated continuously into every iteration with whole-team quality ownership.',
      'Testing is performed only after all sprints are finished.',
      'Automated testing replaces all human input.',
      'No test documentation is ever created in Agile.'
    ],
    explanation: 'Agile testing is continuous, collaborative, and iteratively integrated.'
  },
  'mock_6': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'Which test level evaluates whether the complete integrated system complies with specified functional and non-functional requirements?',
    options: [
      'System Testing',
      'Component Testing',
      'Unit Testing',
      'Alpha Testing'
    ],
    explanation: 'System Testing evaluates end-to-end behavior against specified system requirements.'
  },
  'mock_7': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'What is Regression Testing?',
    options: [
      'Re-testing unchanged parts of software to confirm that changes did not introduce new defects.',
      'Testing software on outdated operating systems.',
      'Testing code performance under extreme load.',
      'Running unit tests for the first time.'
    ],
    explanation: 'Regression testing verifies that code modifications have not damaged existing working features.'
  },
  'mock_8': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'Which statement correctly describes Confirmation Testing (Re-testing)?',
    options: [
      'Executing a test specifically to confirm that a previously reported defect has been fixed.',
      'Testing the entire system for security vulnerabilities.',
      'Re-running all tests at the end of the year.',
      'Validating user requirements with stakeholders.'
    ],
    explanation: 'Confirmation testing verifies that a specific fixed defect now passes.'
  },
  'mock_9': {
    chapterTitle: 'Static Testing',
    stem: 'What is a primary benefit of static testing techniques such as reviews and static analysis?',
    options: [
      'Finding defects early before dynamic execution, lowering fixing costs significantly.',
      'Testing software runtime memory leaks.',
      'Automating UI regression suites.',
      'Replacing load and performance testing.'
    ],
    explanation: 'Static testing identifies requirement, design, and code defects before execution.'
  },
  'mock_10': {
    chapterTitle: 'Static Testing',
    stem: 'Which formal review role is responsible for leading the review meeting and ensuring process adherence?',
    options: [
      'Review Leader / Moderator',
      'Author',
      'Scribe',
      'Sponsor'
    ],
    explanation: 'The Review Leader / Moderator manages review planning, meeting execution, and follow-up.'
  },
  'mock_11': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'Which category of test techniques derives test cases directly from requirements and specifications without looking at internal code structure?',
    options: [
      'Black-Box Test Techniques',
      'White-Box Test Techniques',
      'Experience-Based Techniques',
      'Static Code Analysis'
    ],
    explanation: 'Black-box techniques derive tests from specifications without internal structure knowledge.'
  },
  'mock_12': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'If an age input field accepts values between 18 and 65 inclusive, what are the 2-value BVA test boundary pairs?',
    options: [
      '17, 18 and 65, 66',
      '18, 19 and 64, 65',
      '0, 18 and 65, 100',
      '10, 20 and 50, 70'
    ],
    explanation: '2-value BVA tests the exact boundary values and immediate outside values: 17, 18 and 65, 66.'
  },
  'mock_13': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'Which test design technique maps inputs and outputs using Boolean logic rules in a tabular format?',
    options: [
      'Decision Table Testing',
      'Equivalence Partitioning',
      'State Transition Testing',
      'Use Case Testing'
    ],
    explanation: 'Decision tables model complex business logic conditions and their corresponding system actions.'
  },
  'mock_14': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'In White-Box testing, what does 100% Statement Coverage guarantee?',
    options: [
      'Every executable statement in the code has been executed at least once.',
      'Every decision branch (true and false) has been executed.',
      'All defects in the program have been detected.',
      'The software meets all user requirements.'
    ],
    explanation: 'Statement coverage measures the percentage of executable code lines tested.'
  },
  'mock_15': {
    chapterTitle: 'Test Management',
    stem: 'What is the purpose of a Defect Report (Bug Report)?',
    options: [
      'To provide developers with clear, reproducible information to locate and resolve an anomaly.',
      'To penalize developers for writing bad code.',
      'To list all employee working hours.',
      'To calculate product sales prices.'
    ],
    explanation: 'Defect reports document observed failures with reproducible steps, expected vs actual behavior.'
  },
  'mock_16': {
    chapterTitle: 'Test Management',
    stem: 'In Risk Management, what two metrics determine the Risk Level of an identified risk?',
    options: [
      'Likelihood (Probability) and Impact (Harm)',
      'Cost and Number of Lines of Code',
      'Developer Salary and Project Duration',
      'Number of Test Cases and Test Execution Time'
    ],
    explanation: 'Risk Level = Probability of occurrence x Impact of failure.'
  },
  'mock_17': {
    chapterTitle: 'Test Tools',
    stem: 'Which tool category supports test case management, requirements traceability, and execution reporting?',
    options: [
      'Test Management Tools',
      'Performance Testing Tools',
      'Static Analysis Tools',
      'Compilers'
    ],
    explanation: 'Test management tools store requirements, test suites, execution logs, and defect links.'
  },
  'mock_18': {
    chapterTitle: 'Test Tools',
    stem: 'What is a recommended practice when introducing a new test tool into an organization?',
    options: [
      'Conduct a pilot project to assess suitability, establish usage standards, and train the team.',
      'Deploy the tool immediately across all project teams without training.',
      'Fire all manual testers before tool installation.',
      'Change all existing processes to match tool defaults without evaluation.'
    ],
    explanation: 'Pilot projects evaluate tool integration, costs, standards, and training requirements.'
  },
  'mock_19': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which term describes an improper human action that produces a defect in software code?',
    options: [
      'Error (Mistake)',
      'Failure',
      'Root Cause',
      'Anomaly'
    ],
    explanation: 'An Error is a human mistake that creates a defect in code or documentation.'
  },
  'mock_20': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'Which Acceptance Test type is conducted by potential customers at developer site before commercial release?',
    options: [
      'Alpha Testing',
      'Beta Testing',
      'User Acceptance Testing (UAT)',
      'Operational Acceptance Testing (OAT)'
    ],
    explanation: 'Alpha testing occurs at the developer site by external users or internal cross-teams.'
  },
  'mock_21': {
    chapterTitle: 'Static Testing',
    stem: 'Which type of review is informal, led by the author, and aims to explain work products to peers?',
    options: [
      'Walkthrough',
      'Inspection',
      'Management Review',
      'Audit'
    ],
    explanation: 'Walkthroughs are author-led informal sessions to explain designs or code to peers.'
  },
  'mock_22': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'Exploratory Testing is best described as:',
    options: [
      'Simultaneous learning, test design, and test execution without scripted test cases.',
      'Unplanned random clicking without purpose.',
      'Automated regression testing.',
      'Static code analysis.'
    ],
    explanation: 'Exploratory testing relies on tester experience to design and execute tests dynamically.'
  },
  'mock_23': {
    chapterTitle: 'Test Management',
    stem: 'What is the main goal of Configuration Management in testing?',
    options: [
      'Maintaining unique identification and version control of test items and testware artifacts.',
      'Installing operating system updates on servers.',
      'Calculating team salaries.',
      'Writing marketing press releases.'
    ],
    explanation: 'Configuration management tracks versions of code, test scripts, and test environments.'
  },
  'mock_24': {
    chapterTitle: 'Test Tools',
    stem: 'Which type of tool evaluates code without running it to detect syntax violations and complexity metrics?',
    options: [
      'Static Analysis Tool',
      'Dynamic Analysis Tool',
      'Load Testing Tool',
      'Monitoring Tool'
    ],
    explanation: 'Static analysis tools analyze source code without execution.'
  },
  'mock_25': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'Which statement aligns with the principle "Exhaustive testing is impossible"?',
    options: [
      'Risk analysis and test techniques must be used to focus testing on high-risk areas.',
      'Testing should stop after running 10 test cases.',
      'Developers should perform all testing.',
      'Software should never be released.'
    ],
    explanation: 'Since testing everything is impossible, risk and coverage criteria guide test depth.'
  },
  'mock_26': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'In Component Testing (Unit Testing), what are stubs and drivers used for?',
    options: [
      'To simulate missing dependent components or calling functions during isolated testing.',
      'To measure server network latency.',
      'To automate web browser user interactions.',
      'To write database SQL schemas.'
    ],
    explanation: 'Stubs (replace called modules) and Drivers (replace calling modules) isolate units under test.'
  },
  'mock_27': {
    chapterTitle: 'Static Testing',
    stem: 'What is the most formal, structured review type with defined roles, entry/exit criteria, and metrics tracking?',
    options: [
      'Inspection',
      'Walkthrough',
      'Informal Review',
      'Pair Review'
    ],
    explanation: 'Inspection is the most formal review type led by a trained moderator.'
  },
  'mock_28': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'Which technique uses state diagrams to model system states and allowed state transitions?',
    options: [
      'State Transition Testing',
      'Boundary Value Analysis',
      'Decision Table Testing',
      'Statement Testing'
    ],
    explanation: 'State transition testing evaluates how systems transition between states upon triggers.'
  },
  'mock_29': {
    chapterTitle: 'Test Management',
    stem: 'What does a Test Summary Report contain?',
    options: [
      'A summary of test activities, evaluation of exit criteria, metrics, and quality assessment of tested release.',
      'Only developer salary information.',
      'Raw source code files.',
      'Customer credit card lists.'
    ],
    explanation: 'Test summary reports summarize testing outcomes, metrics, residual risks, and release readiness.'
  },
  'mock_30': {
    chapterTitle: 'Test Tools',
    stem: 'What is a major advantage of automated regression testing in CI/CD pipelines?',
    options: [
      'Fast, consistent, and repeatable execution of regression suites upon code commits.',
      'Eliminating the need for software design specifications.',
      'Guaranteeing that no requirements will ever change.',
      'Replacing product managers entirely.'
    ],
    explanation: 'Automated regression testing provides immediate feedback on code build stability.'
  },
  'mock_31': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'According to ISTQB, what is Testware?',
    options: [
      'All work products created during the test process (test plans, test cases, scripts, reports).',
      'Hardware servers used for testing.',
      'Commercial software licenses purchased by QA.',
      'Computer monitors used by testers.'
    ],
    explanation: 'Testware includes all artifacts produced during testing activities.'
  },
  'mock_32': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'In the V-Model, which test level corresponds directly to User Requirements analysis?',
    options: [
      'User Acceptance Testing (UAT)',
      'Component Testing',
      'Integration Testing',
      'System Architecture Testing'
    ],
    explanation: 'In the V-model, Acceptance Testing validates business requirements defined early.'
  },
  'mock_33': {
    chapterTitle: 'Static Testing',
    stem: 'Which defect type is MOST efficiently found through static code analysis tools?',
    options: [
      'Unreachable code, unused variables, and security vulnerability patterns.',
      'User interface layout alignment preference.',
      'Slow third-party payment gateway responses.',
      'User dissatisfaction with font colors.'
    ],
    explanation: 'Static analysis detects code smells, unused variables, unreachable code, and security defects.'
  },
  'mock_34': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'Error Guessing is an example of which technique category?',
    options: [
      'Experience-Based Test Technique',
      'Black-Box Test Technique',
      'White-Box Test Technique',
      'Formal Inspection'
    ],
    explanation: 'Error guessing relies on tester skill, intuition, and experience with past defects.'
  },
  'mock_35': {
    chapterTitle: 'Test Management',
    stem: 'What is the difference between Product Risk and Project Risk?',
    options: [
      'Product risk relates to software quality failures; Project risk relates to schedule, budget, and resources.',
      'Project risk is tested by users; Product risk is managed by HR.',
      'There is no distinction in ISTQB.',
      'Product risk is always hardware-related.'
    ],
    explanation: 'Product risk affects software quality/functionality; Project risk affects project management/delivery.'
  },
  'mock_36': {
    chapterTitle: 'Test Tools',
    stem: 'Which metric is commonly measured by code coverage tools?',
    options: [
      'Percentage of executable statements or decision branches exercised by test suites.',
      'Download speed of user browser.',
      'Number of hours worked per week.',
      'Memory storage cost per gigabyte.'
    ],
    explanation: 'Code coverage tools measure statement, branch, or decision coverage.'
  },
  'mock_37': {
    chapterTitle: 'Fundamentals of Testing',
    stem: 'What is the Pesticide Paradox in testing?',
    options: [
      'If the same tests are repeated, eventually they will no longer find new defects.',
      'Testing causes software code to decay.',
      'Bugs mutate when exposed to automated tools.',
      'Testers should use chemical pesticides near servers.'
    ],
    explanation: 'Tests must be updated and refreshed regularly to uncover new defects.'
  },
  'mock_38': {
    chapterTitle: 'Testing Throughout the SDLC',
    stem: 'Which test level focuses on verifying functional requirements of individual software modules in isolation?',
    options: [
      'Component Testing (Unit Testing)',
      'System Integration Testing',
      'User Acceptance Testing',
      'Performance Testing'
    ],
    explanation: 'Component testing evaluates individual software units or classes in isolation.'
  },
  'mock_39': {
    chapterTitle: 'Test Analysis and Design',
    stem: 'In a Decision Table with 4 independent boolean conditions, how many rules exist before simplification?',
    options: [
      '16 rules (2^4)',
      '8 rules',
      '4 rules',
      '32 rules'
    ],
    explanation: '4 binary conditions yield 2^4 = 16 distinct condition combinations.'
  },
  'mock_40': {
    chapterTitle: 'Test Management',
    stem: 'What is a Key Performance Indicator (KPI) commonly used in Test Monitoring?',
    options: [
      'Defect detection density and percentage of executed/passed test cases.',
      'Number of cups of coffee consumed by QA.',
      'Server physical weight in kilograms.',
      'Color spectrum of monitor displays.'
    ],
    explanation: 'Test progress monitoring tracks execution status, pass rates, and defect densities.'
  }
};
