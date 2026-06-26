import {
  Ruler, BarChart2, FileText, Lightbulb, Target, Hash,
  Trophy, ClipboardList, Zap,
} from 'lucide-react'

export const services = [
  { Icon: Ruler,      tag: 'IB SL/HL',      title: 'IB Mathematics (AA & AI)',       desc: 'Comprehensive IB Math tutoring for both Analysis & Approaches and Applications & Interpretation at SL and HL level.' },
  { Icon: FileText,   tag: 'GCSE / IGCSE',  title: 'GCSE & IGCSE Mathematics',       desc: 'Expert support for Edexcel, AQA, and Cambridge IGCSE syllabuses — past papers, mark schemes, and targeted revision.' },
  { Icon: BarChart2,  tag: 'A-Level',        title: 'A-Level & O-Level Maths',        desc: 'Rigorous preparation for O/A-Level examinations, covering pure math, statistics, and mechanics modules.' },
  { Icon: Target,     tag: 'AP / SAT',       title: 'AP Calculus & SAT Math',         desc: 'Proven strategies and intensive practice for AP Calculus AB/BC and SAT Math, maximising your score.' },
  { Icon: Hash,       tag: 'Calculus',       title: 'Calculus & Advanced Topics',     desc: 'Derivatives, integration, limits, differential equations and more — broken down step-by-step with real exam questions.' },
  { Icon: Lightbulb,  tag: 'Entrance Prep',  title: 'Grammar School & Nursing Maths', desc: 'Specialised programmes for Grammar School Entrance, Functional Skills, Teaching Assistant, and Nursing Mathematics.' },
]

export const curriculum = [
  { level: 'IB AA SL/HL', title: 'IB Analysis & Approaches',       desc: 'Full SL and HL coverage: algebra, functions, calculus, proof, and statistics.',                              topics: ['Algebra', 'Calculus', 'Trigonometry', 'Vectors', 'Statistics'] },
  { level: 'IB AI SL/HL', title: 'IB Applications & Interpretation', desc: 'Statistical analysis, modelling, financial maths, and graph theory.',                                      topics: ['Statistics', 'Modelling', 'Finance', 'Matrices'] },
  { level: 'GCSE / IGCSE', title: 'GCSE & IGCSE Maths',            desc: 'Edexcel, AQA and Cambridge syllabuses covered in full with past paper walkthroughs.',                        topics: ['Number', 'Algebra', 'Geometry', 'Data', 'Probability'] },
  { level: 'O / A-Level',  title: 'O-Level & A-Level Maths',        desc: 'Pure mathematics, mechanics, and statistics for Pakistani and UK A-level boards.',                          topics: ['Pure Math', 'Mechanics', 'Statistics', 'Further Math'] },
  { level: 'AP / SAT',     title: 'AP Calculus & SAT Math',         desc: 'Score-focused preparation for AP Calculus AB/BC and the SAT Math sections.',                               topics: ['AP Calc AB', 'AP Calc BC', 'SAT Math', 'Pre-Calculus'] },
  { level: 'Foundation',   title: 'Elementary & Keystage Maths',    desc: 'Solid foundations for Grade 8+ students — arithmetic, algebra, and geometry.',                              topics: ['Arithmetic', 'Algebra', 'Geometry', 'Keystage 3/4'] },
]

export const testimonials = [
  { initials: 'MM', name: 'Mariam',   meta: 'A-Level Mathematics',          stars: 5, text: 'If you\'re looking for the best maths tutor, don\'t hesitate when settling for Sir Ather! He is one of the best tutors I\'ve ever come across. He is patient and doesn\'t mind repeating concepts as many times as you want. I would 1000% say he is the best tutor you should book!' },
  { initials: 'OL', name: 'Oliver',   meta: 'IB Math AA HL',                stars: 5, text: 'Mr. Ather makes IB Math HL AA so much easier to understand. His way of explaining tough topics is simple and clear. I\'ve started to enjoy math again because of his teaching.' },
  { initials: 'MN', name: 'Minal',    meta: 'GCSE Mathematics — Grade 9',   stars: 5, text: 'I had only a few lessons with Ather leading up to my GCSEs and the difference was amazing. He increased my confidence and I achieved a grade 9 (A**). I will definitely be taking more lessons for A-level maths!' },
  { initials: 'EG', name: 'Eugene',   meta: 'SAT & IB AI HL',               stars: 5, text: 'Sir Ather explains concepts clearly and fosters a supportive learning environment. He even devotes extra time beyond class hours to ensure doubts are resolved. A truly dedicated and motivating teacher!' },
  { initials: 'AK', name: 'Aadam',    meta: 'IB Math AA HL — Grade 7',      stars: 5, text: 'Ather sir is a great teacher of Mathematics. For anyone who wants to study IB HL mathematics, I definitely recommend him! I received a 7 in Math AA HL for 2025 Examinations, thanks to his great support.' },
  { initials: 'JY', name: 'Ji-Young', meta: 'School Mathematics',            stars: 5, text: 'Ather is an excellent math teacher. He is patient, encouraging, and truly dedicated. My daughter really enjoys learning from him, and his support has made a big difference preparing for her school math tests.' },
  { initials: 'WL', name: 'Wesley',   meta: 'Advanced Math',                 stars: 5, text: 'I cannot express how fortunate I feel to have found Teacher Ather. His teaching style is unparalleled — he doesn\'t just provide answers, he nurtures critical thinking. If you\'re contemplating Math lessons, your search ends here.' },
  { initials: 'CY', name: 'Cynthia',  meta: 'Adult Learner',                 stars: 5, text: 'I was anxious as an adult learner to revisit maths, but Ather paces the lessons very well. He provides detailed explanations and is very patient. He will try different methods until I do understand — a sign of an excellent teacher.' },
  { initials: 'AN', name: 'Anonymous', meta: 'AP Calculus',                  stars: 5, text: 'Before I got to Ather, I tried other math tutors. With Ather, I started to actually learn math. He is helping me prepare for a challenging exam from Calculus 3. He is very patient and every minute of the class is worth it. Excellent tutor, strongly recommended 10/10.' },
]

export const plans = [
  {
    plan: 'Trial',
    price: '12',
    desc: 'A single 50-minute trial lesson to experience the teaching style.',
    features: ['50-min lesson', 'One-on-one session', 'Topic of your choice', 'No commitment required', 'Instant booking'],
    featured: false,
  },
  {
    plan: 'Regular',
    price: '12',
    desc: 'Most popular — consistent sessions for steady grade improvement.',
    features: ['50-min lessons', 'Flexible scheduling', 'Past paper practice', 'WhatsApp support', 'Progress tracking', 'Covers all syllabuses'],
    featured: true,
  },
  {
    plan: 'Intensive',
    price: '12',
    desc: 'Exam sprint — daily sessions in the weeks before your exams.',
    features: ['Daily sessions available', 'Full syllabus revision', 'Timed past paper mocks', 'Mark scheme walkthroughs', 'Personalised study plan'],
    featured: false,
  },
]

export const whyFeatures = [
  { Icon: Trophy,        title: '16 Years of Mathematics Teaching', desc: 'Head of Mathematics at two prominent schools in Pakistan with international teaching experience.' },
  { Icon: ClipboardList, title: 'Covers Every Major Syllabus',       desc: 'IB SL/HL, GCSE, IGCSE, A-Level, AP Calculus, SAT, O-Level, Keystage — all expertly covered.' },
  { Icon: Zap,           title: 'Patient, Clear & Results-Driven',   desc: '4.9 ★ from 140 reviews. 4,150+ lessons delivered. 70% of students achieve Grade 6 or 7.' },
]

export const whyStats = [
  { num: '16',     lbl: 'Years Experience' },
  { num: '4,150+', lbl: 'Lessons Taught' },
  { num: '4.9 ★',  lbl: 'Student Rating' },
  { num: '70%',    lbl: 'Achieve Grade 6-7' },
]
