/**
 * Centralized mock data for Phase 1 dashboard placeholders.
 *
 * In later phases, replace these imports with real API calls.
 * Each section is clearly labelled with its target phase.
 */

// Phase 3: will come from knowledge-profile API
export const mockSkills = [
  { name: 'Arrays',         score: 85, color: '#6366f1' },
  { name: 'Binary Search',  score: 72, color: '#8b5cf6' },
  { name: 'Recursion',      score: 43, color: '#f59e0b' },
  { name: 'Trees',          score: 29, color: '#ef4444' },
  { name: 'Dynamic Prog.',  score: 18, color: '#ec4899' },
  { name: 'Graph Theory',   score: 55, color: '#10b981' },
];

// Phase 3: progress tracking
export const mockProgress = {
  overall: 64,         // percentage
  streak: 7,           // days
  topicsStudied: 12,
  hoursThisWeek: 4.5,
};

// Phase 3: recent activity
export const mockRecentActivity = [
  {
    id: '1',
    type: 'quiz',
    title: 'Binary Search Basics',
    score: 82,
    date: '2026-08-10',
    topic: 'Binary Search',
  },
  {
    id: '2',
    type: 'lesson',
    title: 'Introduction to Trees',
    completed: true,
    date: '2026-08-09',
    topic: 'Trees',
  },
  {
    id: '3',
    type: 'quiz',
    title: 'Array Manipulation',
    score: 91,
    date: '2026-08-08',
    topic: 'Arrays',
  },
];

// Phase 2+: continue learning card
export const mockContinueLearning = {
  title: 'Recursion Fundamentals',
  topic: 'Recursion',
  progress: 35,
  estimatedTime: '25 min',
  difficulty: 'Intermediate',
  nextLesson: 'Base Cases and Call Stack',
};

// Phase 4: recommended topics
export const mockRecommendations = [
  { id: '1', title: 'Binary Trees',       reason: 'Builds on Arrays knowledge',    difficulty: 'Intermediate' },
  { id: '2', title: 'Memoization',         reason: 'Improve your Recursion score',  difficulty: 'Intermediate' },
  { id: '3', title: 'Sorting Algorithms',  reason: 'Popular in interviews',         difficulty: 'Beginner' },
];

// Phase 3: weekly activity for chart
export const mockWeeklyActivity = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 75 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 15 },
];
