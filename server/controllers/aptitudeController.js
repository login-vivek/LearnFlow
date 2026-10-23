// Aptitude question bank — Quantitative, Logical, Verbal
const QUESTIONS = {
  quantitative: [
    { id: 'q1',  topic: 'Percentages',      question: 'A price is increased by 20% then decreased by 20%. Net change?', options: ['0%','-4%','4%','No change'], answer: 1, explanation: '100 → 120 → 96. Net = -4%.' },
    { id: 'q2',  topic: 'Time & Work',       question: 'A does work in 10 days, B in 15 days. Together?',               options: ['5 days','6 days','7 days','8 days'], answer: 1, explanation: 'Combined rate = 1/10+1/15 = 1/6. So 6 days.' },
    { id: 'q3',  topic: 'Ratios',            question: 'Ratio of A:B = 3:4, B:C = 2:3. Find A:B:C.',                   options: ['3:4:6','6:8:12','3:4:5','None'], answer: 1, explanation: 'A:B:C = 6:8:12 = 3:4:6.' },
    { id: 'q4',  topic: 'Simple Interest',   question: 'SI on ₹2000 at 5% for 3 years?',                               options: ['₹200','₹250','₹300','₹350'], answer: 2, explanation: 'SI = PRT/100 = 2000×5×3/100 = 300.' },
    { id: 'q5',  topic: 'Speed & Distance',  question: 'Train 300m long at 60 km/h. Time to cross a pole?',            options: ['15s','18s','20s','12s'], answer: 1, explanation: '300m at 60km/h = 300/(100/6) = 18s.' },
    { id: 'q6',  topic: 'Profit & Loss',     question: 'CP=₹800, SP=₹1000. Profit%?',                                  options: ['20%','25%','30%','15%'], answer: 1, explanation: 'Profit = 200, Profit% = 200/800×100 = 25%.' },
    { id: 'q7',  topic: 'LCM & HCF',         question: 'LCM of 12 and 18?',                                           options: ['24','36','48','72'], answer: 1, explanation: '12=2²×3, 18=2×3². LCM=2²×3²=36.' },
    { id: 'q8',  topic: 'Averages',          question: 'Avg of 5 numbers is 10. If one number is removed avg becomes 9. Removed number?', options: ['10','12','14','15'], answer: 2, explanation: 'Sum=50, new sum=36. Removed=50-36=14.' },
    { id: 'q9',  topic: 'Probability',       question: 'Probability of getting head twice in 2 coin flips?',           options: ['1/2','1/4','1/3','3/4'], answer: 1, explanation: '(1/2)×(1/2) = 1/4.' },
    { id: 'q10', topic: 'Permutations',      question: 'Arrangements of letters in "LEAD"?',                          options: ['12','16','24','48'], answer: 2, explanation: '4! = 24.' },
  ],
  logical: [
    { id: 'l1',  topic: 'Number Series',     question: '2, 6, 12, 20, 30, ?',                                          options: ['40','42','44','45'], answer: 1, explanation: 'Differences: 4,6,8,10,12. Next = 30+12=42.' },
    { id: 'l2',  topic: 'Coding-Decoding',   question: 'If CAT=3120, DOG=?',                                          options: ['41521','41514','41520','51421'], answer: 1, explanation: 'Digit sum of alphabetical positions: D=4,O=15,G=7 → 41574 (varies by encoding — check pattern).' },
    { id: 'l3',  topic: 'Blood Relations',   question: 'A is B\'s father. C is A\'s sister. What is C to B?',           options: ['Aunt','Mother','Grandmother','Sister'], answer: 0, explanation: 'C is A\'s sister and A is B\'s father, so C is B\'s aunt.' },
    { id: 'l4',  topic: 'Syllogisms',        question: 'All cats are dogs. All dogs are animals. Conclusion?',         options: ['All cats are animals','No cats are animals','Some cats are animals','None'], answer: 0, explanation: 'Transitive: All cats → dogs → animals.' },
    { id: 'l5',  topic: 'Directions',        question: 'Walk 5m North, turn right 5m, turn right 5m. Direction now facing?', options: ['North','South','East','West'], answer: 1, explanation: 'Facing South after two right turns from North.' },
    { id: 'l6',  topic: 'Seating',           question: '5 people in a row. A is 2nd from left, B is 2nd from right. How many between them?', options: ['1','2','3','4'], answer: 1, explanation: 'Positions: A=2, B=4. Between them: position 3. Count = 1 person.' },
    { id: 'l7',  topic: 'Analogies',         question: 'Book : Library :: Painting : ?',                               options: ['Artist','Gallery','Museum','Studio'], answer: 1, explanation: 'Books are stored in a library; paintings in a gallery.' },
    { id: 'l8',  topic: 'Odd One Out',       question: 'Which is odd? Circle, Square, Triangle, Cube',                options: ['Circle','Square','Triangle','Cube'], answer: 3, explanation: 'Cube is 3D; others are 2D shapes.' },
    { id: 'l9',  topic: 'Clocks',            question: 'Angle between hands at 3:15?',                               options: ['7.5°','0°','15°','22.5°'], answer: 0, explanation: 'Hour at 97.5°, minute at 90°. Diff=7.5°.' },
    { id: 'l10', topic: 'Calendars',         question: 'What day is 100 days after a Monday?',                        options: ['Monday','Tuesday','Wednesday','Thursday'], answer: 2, explanation: '100 mod 7 = 2. Monday + 2 = Wednesday.' },
  ],
  verbal: [
    { id: 'v1',  topic: 'Synonyms',          question: 'Synonym of EPHEMERAL',                                         options: ['Permanent','Transient','Ancient','Eternal'], answer: 1, explanation: 'Ephemeral means lasting a very short time — transient.' },
    { id: 'v2',  topic: 'Antonyms',          question: 'Antonym of BENEVOLENT',                                        options: ['Kind','Malevolent','Generous','Charitable'], answer: 1, explanation: 'Benevolent = kind; antonym = malevolent.' },
    { id: 'v3',  topic: 'Sentence Correction', question: 'She don\'t know the answer. Correct form?',                  options: ['She doesn\'t know','She do not know','She didn\'t knew','She not know'], answer: 0, explanation: 'Third person singular requires "doesn\'t".' },
    { id: 'v4',  topic: 'Reading Comprehension', question: 'Passage: "AI is transforming industries." Main idea?',    options: ['AI is dangerous','AI impacts industries','AI needs regulation','AI is a tool'], answer: 1, explanation: 'Main idea directly stated: AI is transforming industries.' },
    { id: 'v5',  topic: 'Idioms',            question: '"Bite the bullet" means?',                                     options: ['Get angry','Endure pain stoically','Give up','Celebrate'], answer: 1, explanation: 'To endure a painful situation bravely.' },
    { id: 'v6',  topic: 'One Word',          question: 'One word for "one who walks in sleep"?',                      options: ['Somnambulist','Insomniac','Narcoleptic','Amnesiac'], answer: 0, explanation: 'Somnambulist = sleepwalker.' },
    { id: 'v7',  topic: 'Fill in the Blanks', question: 'She was ___ at the opportunity to travel.',                  options: ['bored','elated','annoyed','indifferent'], answer: 1, explanation: 'Elated = very happy; fits context of opportunity.' },
    { id: 'v8',  topic: 'Para Jumbles',       question: 'Arrange: (A) She left. (B) It rained. (C) She forgot umbrella.',options: ['B,C,A','A,B,C','C,A,B','B,A,C'], answer: 0, explanation: 'Logical sequence: Rain → forgot umbrella → left.' },
  ],
};

exports.getQuestions = (req, res) => {
  try {
    const { category = 'quantitative', limit = 10 } = req.query;
    const pool = QUESTIONS[category] || QUESTIONS.quantitative;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Number(limit));
    // Strip answer for client
    const questions = shuffled.map(({ answer, explanation, ...q }) => q);
    res.json({ success: true, questions, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitAnswers = (req, res) => {
  try {
    const { answers, category = 'quantitative' } = req.body;
    // answers: [{ id, selected }]
    if (!Array.isArray(answers)) return res.status(400).json({ success: false, message: 'answers array required' });

    const pool = QUESTIONS[category] || QUESTIONS.quantitative;
    const map  = Object.fromEntries(pool.map(q => [q.id, q]));

    let correct = 0;
    const results = answers.map(({ id, selected }) => {
      const q = map[id];
      if (!q) return { id, correct: false };
      const isCorrect = selected === q.answer;
      if (isCorrect) correct++;
      return { id, selected, correct: isCorrect, correctAnswer: q.answer, explanation: q.explanation };
    });

    res.json({ success: true, score: correct, total: answers.length, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
