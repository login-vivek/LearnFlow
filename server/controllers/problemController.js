const User = require('../models/User');

// Full A2Z DSA Sheet data
const A2Z_SHEET = [
  // Step 1 - Learn the Basics
  { id: 'a2z-1', step: 1, stepTitle: 'Learn the Basics', topic: 'Time & Space Complexity', difficulty: 'Easy', company: ['All'], solved: false },
  { id: 'a2z-2', step: 1, stepTitle: 'Learn the Basics', topic: 'Recursion Basics', difficulty: 'Easy', company: ['All'], solved: false },
  { id: 'a2z-3', step: 1, stepTitle: 'Learn the Basics', topic: 'Pattern Problems', difficulty: 'Easy', company: ['TCS', 'Infosys'], solved: false },
  // Step 2 - Sorting
  { id: 'a2z-4', step: 2, stepTitle: 'Sorting Techniques', topic: 'Bubble Sort', difficulty: 'Easy', company: ['TCS'], solved: false },
  { id: 'a2z-5', step: 2, stepTitle: 'Sorting Techniques', topic: 'Selection Sort', difficulty: 'Easy', company: ['TCS'], solved: false },
  { id: 'a2z-6', step: 2, stepTitle: 'Sorting Techniques', topic: 'Merge Sort', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-7', step: 2, stepTitle: 'Sorting Techniques', topic: 'Quick Sort', difficulty: 'Medium', company: ['Amazon', 'Google'], solved: false },
  // Step 3 - Arrays
  { id: 'a2z-8', step: 3, stepTitle: 'Arrays', topic: 'Two Sum', difficulty: 'Easy', company: ['Amazon', 'Google', 'Microsoft'], solved: false },
  { id: 'a2z-9', step: 3, stepTitle: 'Arrays', topic: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', company: ['Amazon', 'Microsoft', 'TCS'], solved: false },
  { id: 'a2z-10', step: 3, stepTitle: 'Arrays', topic: 'Trapping Rain Water', difficulty: 'Hard', company: ['Amazon', 'Google', 'Adobe'], solved: false },
  { id: 'a2z-11', step: 3, stepTitle: 'Arrays', topic: 'Next Permutation', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-12', step: 3, stepTitle: 'Arrays', topic: 'Majority Element', difficulty: 'Easy', company: ['Adobe', 'Amazon'], solved: false },
  { id: 'a2z-13', step: 3, stepTitle: 'Arrays', topic: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-14', step: 3, stepTitle: 'Arrays', topic: 'Stock Buy & Sell', difficulty: 'Easy', company: ['Amazon', 'Microsoft', 'Goldman Sachs'], solved: false },
  { id: 'a2z-15', step: 3, stepTitle: 'Arrays', topic: 'Rotate Matrix 90°', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  // Step 4 - Binary Search
  { id: 'a2z-16', step: 4, stepTitle: 'Binary Search', topic: 'Binary Search Basics', difficulty: 'Easy', company: ['All'], solved: false },
  { id: 'a2z-17', step: 4, stepTitle: 'Binary Search', topic: 'Search in Rotated Array', difficulty: 'Medium', company: ['Amazon', 'Google', 'Microsoft'], solved: false },
  { id: 'a2z-18', step: 4, stepTitle: 'Binary Search', topic: 'Find Peak Element', difficulty: 'Medium', company: ['Google', 'Facebook'], solved: false },
  { id: 'a2z-19', step: 4, stepTitle: 'Binary Search', topic: 'Median of Two Sorted Arrays', difficulty: 'Hard', company: ['Amazon', 'Google'], solved: false },
  // Step 5 - Strings
  { id: 'a2z-20', step: 5, stepTitle: 'Strings', topic: 'Reverse Words in String', difficulty: 'Easy', company: ['Microsoft', 'Amazon'], solved: false },
  { id: 'a2z-21', step: 5, stepTitle: 'Strings', topic: 'Longest Palindromic Substring', difficulty: 'Medium', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-22', step: 5, stepTitle: 'Strings', topic: 'Anagram Check', difficulty: 'Easy', company: ['TCS', 'Infosys'], solved: false },
  { id: 'a2z-23', step: 5, stepTitle: 'Strings', topic: 'KMP Algorithm', difficulty: 'Hard', company: ['Google', 'Amazon'], solved: false },
  // Step 6 - Linked List
  { id: 'a2z-24', step: 6, stepTitle: 'Linked List', topic: 'Reverse Linked List', difficulty: 'Easy', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-25', step: 6, stepTitle: 'Linked List', topic: 'Detect Cycle in LL', difficulty: 'Medium', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-26', step: 6, stepTitle: 'Linked List', topic: 'Merge Two Sorted Lists', difficulty: 'Easy', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-27', step: 6, stepTitle: 'Linked List', topic: 'LRU Cache', difficulty: 'Medium', company: ['Amazon', 'Google', 'Microsoft'], solved: false },
  // Step 7 - Stack & Queue
  { id: 'a2z-28', step: 7, stepTitle: 'Stack & Queue', topic: 'Valid Parentheses', difficulty: 'Easy', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-29', step: 7, stepTitle: 'Stack & Queue', topic: 'Largest Rectangle in Histogram', difficulty: 'Hard', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-30', step: 7, stepTitle: 'Stack & Queue', topic: 'Min Stack', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  // Step 8 - Trees
  { id: 'a2z-31', step: 8, stepTitle: 'Trees', topic: 'Inorder/Preorder/Postorder', difficulty: 'Easy', company: ['All'], solved: false },
  { id: 'a2z-32', step: 8, stepTitle: 'Trees', topic: 'Level Order Traversal', difficulty: 'Easy', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-33', step: 8, stepTitle: 'Trees', topic: 'Height of Binary Tree', difficulty: 'Easy', company: ['TCS', 'Infosys'], solved: false },
  { id: 'a2z-34', step: 8, stepTitle: 'Trees', topic: 'Lowest Common Ancestor', difficulty: 'Medium', company: ['Amazon', 'Google', 'Microsoft'], solved: false },
  { id: 'a2z-35', step: 8, stepTitle: 'Trees', topic: 'Serialize and Deserialize BT', difficulty: 'Hard', company: ['Amazon', 'Google'], solved: false },
  // Step 9 - Graphs
  { id: 'a2z-36', step: 9, stepTitle: 'Graphs', topic: 'BFS & DFS', difficulty: 'Easy', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-37', step: 9, stepTitle: 'Graphs', topic: 'Cycle Detection', difficulty: 'Medium', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-38', step: 9, stepTitle: 'Graphs', topic: 'Topological Sort', difficulty: 'Medium', company: ['Amazon', 'Google', 'Microsoft'], solved: false },
  { id: 'a2z-39', step: 9, stepTitle: 'Graphs', topic: "Dijkstra's Algorithm", difficulty: 'Medium', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-40', step: 9, stepTitle: 'Graphs', topic: "Bellman-Ford Algorithm", difficulty: 'Hard', company: ['Amazon'], solved: false },
  // Step 10 - Dynamic Programming
  { id: 'a2z-41', step: 10, stepTitle: 'Dynamic Programming', topic: 'Fibonacci (Memoization)', difficulty: 'Easy', company: ['All'], solved: false },
  { id: 'a2z-42', step: 10, stepTitle: 'Dynamic Programming', topic: 'Climbing Stairs', difficulty: 'Easy', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-43', step: 10, stepTitle: 'Dynamic Programming', topic: '0/1 Knapsack', difficulty: 'Medium', company: ['Amazon', 'Microsoft'], solved: false },
  { id: 'a2z-44', step: 10, stepTitle: 'Dynamic Programming', topic: 'Longest Common Subsequence', difficulty: 'Medium', company: ['Amazon', 'Google', 'Adobe'], solved: false },
  { id: 'a2z-45', step: 10, stepTitle: 'Dynamic Programming', topic: 'Edit Distance', difficulty: 'Hard', company: ['Amazon', 'Google'], solved: false },
  { id: 'a2z-46', step: 10, stepTitle: 'Dynamic Programming', topic: 'Matrix Chain Multiplication', difficulty: 'Hard', company: ['Amazon', 'Microsoft'], solved: false },
];

const COMPANY_QUESTIONS = {
  amazon: [
    { id: 'amz-1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', frequency: 'Very High' },
    { id: 'amz-2', title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', frequency: 'High' },
    { id: 'amz-3', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', frequency: 'High' },
    { id: 'amz-4', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heap', frequency: 'Medium' },
    { id: 'amz-5', title: 'Word Ladder', difficulty: 'Hard', topic: 'BFS', frequency: 'Medium' },
  ],
  google: [
    { id: 'goo-1', title: 'Search in Rotated Array', difficulty: 'Medium', topic: 'Binary Search', frequency: 'Very High' },
    { id: 'goo-2', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', frequency: 'High' },
    { id: 'goo-3', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays', frequency: 'High' },
    { id: 'goo-4', title: 'Text Justification', difficulty: 'Hard', topic: 'Strings', frequency: 'Medium' },
  ],
  microsoft: [
    { id: 'ms-1', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', frequency: 'Very High' },
    { id: 'ms-2', title: 'Lowest Common Ancestor', difficulty: 'Medium', topic: 'Trees', frequency: 'High' },
    { id: 'ms-3', title: 'Clone Graph', difficulty: 'Medium', topic: 'Graphs', frequency: 'High' },
  ],
  tcs: [
    { id: 'tcs-1', title: 'Fibonacci Series', difficulty: 'Easy', topic: 'Recursion', frequency: 'Very High' },
    { id: 'tcs-2', title: 'Armstrong Number', difficulty: 'Easy', topic: 'Math', frequency: 'High' },
    { id: 'tcs-3', title: 'String Palindrome', difficulty: 'Easy', topic: 'Strings', frequency: 'Very High' },
    { id: 'tcs-4', title: 'Array Rotation', difficulty: 'Easy', topic: 'Arrays', frequency: 'High' },
  ],
};

// POTD - one per day based on day of year
const POTD_POOL = A2Z_SHEET.filter(p => p.difficulty === 'Medium');

exports.getProblems = async (req, res) => {
  try {
    const { company, difficulty, topic, search } = req.query;
    let problems = [...A2Z_SHEET];

    if (company) problems = problems.filter(p => p.company.includes(company) || p.company.includes('All'));
    if (difficulty) problems = problems.filter(p => p.difficulty === difficulty);
    if (topic) problems = problems.filter(p => p.topic.toLowerCase().includes(topic.toLowerCase()));
    if (search) problems = problems.filter(p => p.topic.toLowerCase().includes(search.toLowerCase()));

    res.json({ success: true, problems, total: problems.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPOTD = async (req, res) => {
  try {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const potd = POTD_POOL[dayOfYear % POTD_POOL.length];
    res.json({ success: true, problem: potd, date: new Date().toISOString().split('T')[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSheet = async (req, res) => {
  try {
    const { sheetName } = req.params;

    if (sheetName === 'a2z') {
      const grouped = {};
      A2Z_SHEET.forEach(p => {
        if (!grouped[p.step]) grouped[p.step] = { step: p.step, title: p.stepTitle, problems: [] };
        grouped[p.step].problems.push(p);
      });
      return res.json({ success: true, sheet: Object.values(grouped) });
    }

    if (COMPANY_QUESTIONS[sheetName.toLowerCase()]) {
      return res.json({ success: true, problems: COMPANY_QUESTIONS[sheetName.toLowerCase()] });
    }

    res.status(404).json({ success: false, message: 'Sheet not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markSolved = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.solvedProblems.includes(req.params.id)) {
      user.solvedProblems.push(req.params.id);
      await user.save();
    }
    res.json({ success: true, solvedCount: user.solvedProblems.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
