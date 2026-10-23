const StudyPlan = require('../models/StudyPlan');

// Topic pool for generating plans
const TOPIC_POOL = {
  dsa: [
    'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack & Queue',
    'Binary Search', 'Linked List', 'Trees - Basics', 'Trees - BFS/DFS',
    'Binary Search Tree', 'Heap / Priority Queue', 'Backtracking',
    'Graphs - BFS/DFS', 'Graphs - Shortest Path', 'Dynamic Programming - 1D',
    'Dynamic Programming - 2D', 'Greedy', 'Bit Manipulation', 'Trie',
    'Advanced Graphs', 'Intervals',
  ],
  theory: [
    'OOP Concepts', 'DBMS - Basics', 'DBMS - Normalization', 'DBMS - Transactions',
    'OS - Basics', 'OS - Process Management', 'OS - Memory Management',
    'CN - Basics', 'CN - TCP/IP', 'SQL - Basics', 'SQL - Joins & Subqueries',
    'System Design - Basics',
  ],
  aptitude: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
};

function generateTasks(startDate, deadline, hoursPerDay) {
  const start = new Date(startDate);
  const end = new Date(deadline);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const minutesPerDay = hoursPerDay * 60;

  // Build topic list: 60% DSA, 30% theory, 10% aptitude
  const topics = [
    ...TOPIC_POOL.dsa,
    ...TOPIC_POOL.dsa.slice(0, 8), // repeat some DSA for depth
    ...TOPIC_POOL.theory,
    ...TOPIC_POOL.aptitude,
  ];

  const tasks = [];
  let topicIndex = 0;

  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    let remaining = minutesPerDay;
    while (remaining >= 30 && topicIndex < topics.length) {
      const duration = Math.min(remaining, 90);
      tasks.push({
        date: dateStr,
        topic: topics[topicIndex % topics.length],
        subtopic: `Session ${Math.floor(topicIndex / topics.length) + 1}`,
        duration,
        completed: false,
        skipped: false,
        rescheduled: false,
      });
      remaining -= duration;
      topicIndex++;
    }
  }
  return tasks;
}

exports.createPlan = async (req, res) => {
  try {
    const { targetCompany, targetRole, hoursPerDay, deadline } = req.body;
    if (!targetCompany || !targetRole || !hoursPerDay || !deadline)
      return res.status(400).json({ success: false, message: 'All fields required' });

    // Deactivate old plans
    await StudyPlan.updateMany({ user: req.user._id }, { active: false });

    const startDate = new Date().toISOString().split('T')[0];
    const tasks = generateTasks(startDate, deadline, Number(hoursPerDay));

    const plan = await StudyPlan.create({
      user: req.user._id,
      targetCompany, targetRole,
      hoursPerDay: Number(hoursPerDay),
      deadline, startDate, tasks,
    });

    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActivePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id, active: true });
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id, active: true });
    if (!plan) return res.status(404).json({ success: false, message: 'No active plan' });

    const task = plan.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.completed = true;
    await plan.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reschedule = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user._id, active: true });
    if (!plan) return res.status(404).json({ success: false, message: 'No active plan' });

    const today = new Date().toISOString().split('T')[0];
    // Move all incomplete past tasks to today
    plan.tasks.forEach(task => {
      if (task.date < today && !task.completed) {
        task.date = today;
        task.rescheduled = true;
      }
    });
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
