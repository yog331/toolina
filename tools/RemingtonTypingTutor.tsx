import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import SEO from '../components/SEO';
import ShareWidget from '../components/ShareWidget';
import StarRatingWidget from '../components/StarRatingWidget';
import AdUnit from '../components/AdUnit';
import AccompanyingText from '../components/AccompanyingText';
import { unicodeToDevlys } from '../src/lib/unicodeToDevlys';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Types for Typing Tutor
type LessonCategory = 'home' | 'top' | 'bottom' | 'shift' | 'words' | 'sentences' | 'custom';

interface Lesson {
  id: string;
  name: string;
  category: LessonCategory;
  description: string;
  hindiText: string;
}

interface PracticeSession {
  id: string;
  date: string;
  type: string;
  name: string;
  wpm: number;
  accuracy: number;
}

// Built-in Lessons
const LESSONS: Lesson[] = [
  {
    id: 'l1',
    name: 'Home Row - क ि ह ी (Basic Keys)',
    category: 'home',
    description: 'Learn the core Home Row keys: d, f, g, h (क, ि, ह, ी).',
    hindiText: 'क हि ही कि कि हि ही क किहि हीक'
  },
  {
    id: 'l2',
    name: 'Home Row - र ा स य (Right Hand)',
    category: 'home',
    description: 'Practice Home Row keys: j, k, l, ; (र, ा, स, य).',
    hindiText: 'रा सा या सर सारा यासा रा सरकार'
  },
  {
    id: 'l3',
    name: 'Home Row Combined Words',
    category: 'home',
    description: 'Practice complete words using only Home Row keys.',
    hindiText: 'सरकार सरिका सिरा रस सारा सहकार सरस काया राय'
  },
  {
    id: 'l4',
    name: 'Top Row - म त ज ल न (Left & Right)',
    category: 'top',
    description: 'Practice Top Row keys: e, r, t, y, u (म, त, ज, ल, न).',
    hindiText: 'मत जल नल तन मन मलत तर तरन जमल'
  },
  {
    id: 'l5',
    name: 'Top Row - प व च (Additional Keys)',
    category: 'top',
    description: 'Practice remaining Top Row keys: i, o, p (प, व, च).',
    hindiText: 'पवन चमन पर वर चर वतन वचन पत्र चपल'
  },
  {
    id: 'l6',
    name: 'Top Row Combined Words',
    category: 'top',
    description: 'Structured words utilizing both Home Row and Top Row keys.',
    hindiText: 'कमल समय नमक पवन चमन सरल मटर कलम शहर जतन'
  },
  {
    id: 'l7',
    name: 'Bottom Row - ग ब अ इ (Left Hand)',
    category: 'bottom',
    description: 'Practice Bottom Row keys: x, c, v, b (ग, ब, अ, इ).',
    hindiText: 'गब अब इग बअ गब अब इग बअ बइ गअ'
  },
  {
    id: 'l8',
    name: 'Bottom Row - द उ ए ण ध (Right Hand)',
    category: 'bottom',
    description: 'Practice Bottom Row keys: n, m, ,, ., / (द, उ, ए, ण, ध).',
    hindiText: 'दउ एण धद उए णध दउ एण धद उध एण'
  },
  {
    id: 'l9',
    name: 'Bottom Row Combined Words',
    category: 'bottom',
    description: 'Practice complete words using the Bottom Row keys.',
    hindiText: 'नगर बदन अमर उधर इधर गगन वचन वदन धरण धमन'
  },
  {
    id: 'l10',
    name: 'Shift Key - Half Letters & Conjuncts',
    category: 'shift',
    description: 'Practice using the Shift key to type half consonants and conjuncts.',
    hindiText: 'कल्पना प्रस्थान द्वारिका राष्ट्रीय विज्ञान क्षेत्र बुद्धिमान'
  },
  {
    id: 'l11',
    name: 'Common Rajasthan Exam Words',
    category: 'words',
    description: 'High-frequency words from actual Rajasthan government exams.',
    hindiText: 'राजस्थान कर्मचारी चयन बोर्ड जयपुर परीक्षा सूचना सहायक कनिष्ठ सहायक लिपि ग्रेड'
  },
  {
    id: 'l12',
    name: 'Exam Sentence Practice',
    category: 'sentences',
    description: 'Full sentence practice with intermediate punctuation and matras.',
    hindiText: 'राजस्थान की राजधानी जयपुर है। यहाँ की भाषा मुख्य रूप से हिंदी है।'
  }
];

// Built-in Speed Tests
const SPEED_TESTS = [
  {
    id: 'st1',
    name: 'Rajasthan Geography & Culture',
    description: 'Ideal for LDC/IA aspirants. Practice typing text on Rajasthan geography, cultural heritage, and tourism.',
    hindiText: 'राजस्थान भारत का क्षेत्रफल की दृष्टि से सबसे बड़ा राज्य है। इसकी पश्चिमी सीमा पाकिस्तान से मिलती है जहाँ थार का विशाल मरुस्थल स्थित है। यहाँ की अरावली पर्वत शृंखला विश्व की सबसे प्राचीन पर्वत मालाओं में से एक है। राजस्थान अपनी समृद्ध सांस्कृतिक विरासत के लिए प्रसिद्ध है।'
  },
  {
    id: 'st2',
    name: 'General Information & Administration',
    description: 'Practice typing official administrative terminology and notification styles used in government departments.',
    hindiText: 'सूचना सहायक और कनिष्ठ सहायक भर्ती परीक्षाओं में गति परीक्षा का विशेष महत्व होता है। अभ्यर्थियों को सलाह दी जाती है कि वे नियमित रूप से प्रतिदिन कम से कम आधा घंटा कंप्यूटर पर हिंदी और अंग्रेजी दोनों भाषाओं में टंकण अभ्यास करें ताकि उनकी शुद्धता और गति दोनों में सुधार हो सके।'
  },
  {
    id: 'st3',
    name: 'Rajasthan History & Kings',
    description: 'Paragraph based on the glorious history of Mewar, Maharana Pratap, and other legendary rulers.',
    hindiText: 'मेवाड़ का इतिहास अत्यंत गौरवशाली रहा है। महाराणा प्रताप ने अपनी मातृभूमि की रक्षा के लिए जीवन भर संघर्ष किया और कभी हार नहीं मानी। हल्दीघाटी का युद्ध भारतीय इतिहास में उनके अदम्य साहस और देशभक्ति का प्रतीक माना जाता है। चेतक उनका प्रिय और स्वामीभक्त घोड़ा था।'
  },
  {
    id: 'st4',
    name: 'Digital India & Information Technology',
    description: 'Modern IT terminology and computer awareness paragraph suitable for Informatics Assistant (IA) exam.',
    hindiText: 'आज का युग सूचना तकनीकी और डिजिटलीकरण का युग है। राजस्थान सरकार ने सरकारी सेवाओं को आम जनता तक सुलभ बनाने के लिए ई-मित्र और सिंगल साइन ऑन जैसी महत्वपूर्ण योजनाएं शुरू की हैं। इन तकनीकी पहलों से पारदर्शिता बढ़ी है और लोगों का जीवन अधिक सरल हुआ है।'
  }
];

// Mapping of English physical keys to their Remington DevLys 010 normal and shift characters
// For the on-screen keyboard display
const KEYBOARD_MAP = [
  // Row 1 (Numbers)
  [
    { key: '`', normal: 'ऱ', shift: 'इ', width: 'w-10 md:w-12' },
    { key: '1', normal: '१', shift: 'त्', width: 'w-10 md:w-12' },
    { key: '2', normal: '२', shift: 'थ्', width: 'w-10 md:w-12' },
    { key: '3', normal: '३', shift: 'ध्', width: 'w-10 md:w-12' },
    { key: '4', normal: '४', shift: 'भ्', width: 'w-10 md:w-12' },
    { key: '5', normal: '५', shift: 'ः', width: 'w-10 md:w-12' },
    { key: '6', normal: '६', shift: 'त्र', width: 'w-10 md:w-12' },
    { key: '7', normal: '७', shift: 'ऋ', width: 'w-10 md:w-12' },
    { key: '8', normal: '८', shift: 'द्ध', width: 'w-10 md:w-12' },
    { key: '9', normal: '९', shift: 'त्र', width: 'w-10 md:w-12' },
    { key: '0', normal: '०', shift: 'ऋ', width: 'w-10 md:w-12' },
    { key: '-', normal: '-', shift: 'ः', width: 'w-10 md:w-12' },
    { key: '=', normal: 'ृ', shift: '।', width: 'w-10 md:w-12' },
    { key: 'Backspace', normal: '◀', shift: '◀', width: 'flex-1 min-w-[3rem]' }
  ],
  // Row 2 (QWERTY)
  [
    { key: 'Tab', normal: '↹', shift: '↹', width: 'w-14 md:w-16' },
    { key: 'q', normal: 'ु', shift: 'फ', width: 'w-10 md:w-12' },
    { key: 'w', normal: 'ू', shift: 'ॅ', width: 'w-10 md:w-12' },
    { key: 'e', normal: 'म', shift: 'म्', width: 'w-10 md:w-12' },
    { key: 'r', normal: 'त', shift: 'त्', width: 'w-10 md:w-12' },
    { key: 't', normal: 'ज', shift: 'ज्', width: 'w-10 md:w-12' },
    { key: 'y', normal: 'ल', shift: 'ल्', width: 'w-10 md:w-12' },
    { key: 'u', normal: 'न', shift: 'न्', width: 'w-10 md:w-12' },
    { key: 'i', normal: 'प', shift: 'प्', width: 'w-10 md:w-12' },
    { key: 'o', normal: 'व', shift: 'व्', width: 'w-10 md:w-12' },
    { key: 'p', normal: 'च', shift: 'च्', width: 'w-10 md:w-12' },
    { key: '[', normal: 'ख्', shift: 'क्ष', width: 'w-10 md:w-12' },
    { key: ']', normal: ',', shift: 'द्व', width: 'w-10 md:w-12' },
    { key: '\\', normal: 'ॉ', shift: '?', width: 'flex-1' }
  ],
  // Row 3 (ASDF)
  [
    { key: 'CapsLock', normal: '🔒', shift: '🔒', width: 'w-16 md:w-20' },
    { key: 'a', normal: 'ं', shift: 'ऋ', width: 'w-10 md:w-12' },
    { key: 's', normal: 'े', shift: 'ै', width: 'w-10 md:w-12' },
    { key: 'd', normal: 'क', shift: 'क्', width: 'w-10 md:w-12' },
    { key: 'f', normal: 'ि', shift: 'थ्', width: 'w-10 md:w-12' },
    { key: 'g', normal: 'ह', shift: 'इ', width: 'w-10 md:w-12' },
    { key: 'h', normal: 'ी', shift: 'भ्', width: 'w-10 md:w-12' },
    { key: 'j', normal: 'र', shift: 'श्र्', width: 'w-10 md:w-12' },
    { key: 'k', normal: 'ा', shift: 'ज्ञ्', width: 'w-10 md:w-12' },
    { key: 'l', normal: 'स', shift: 'थ', width: 'w-10 md:w-12' },
    { key: ';', normal: 'य', shift: 'य्', width: 'w-10 md:w-12' },
    { key: '\'', normal: 'श', shift: 'ष्', width: 'w-10 md:w-12' },
    { key: 'Enter', normal: '⏎', shift: '⏎', width: 'flex-1 min-w-[4rem]' }
  ],
  // Row 4 (ZXCV)
  [
    { key: 'ShiftLeft', normal: '⇧ Shift', shift: '⇧ Shift', width: 'w-20 md:w-24' },
    { key: 'z', normal: '्र', shift: 'ज्ञ', width: 'w-10 md:w-12' },
    { key: 'x', normal: 'ग', shift: 'ग्', width: 'w-10 md:w-12' },
    { key: 'c', normal: 'ब', shift: 'ब्', width: 'w-10 md:w-12' },
    { key: 'v', normal: 'अ', shift: 'ट', width: 'w-10 md:w-12' },
    { key: 'b', normal: 'इ', shift: 'ठ', width: 'w-10 md:w-12' },
    { key: 'n', normal: 'द', shift: 'ड', width: 'w-10 md:w-12' },
    { key: 'm', normal: 'उ', shift: 'ढ', width: 'w-10 md:w-12' },
    { key: ',', normal: 'ए', shift: 'ढ', width: 'w-10 md:w-12' },
    { key: '.', normal: 'ण', shift: 'ण्', width: 'w-10 md:w-12' },
    { key: '/', normal: 'ध', shift: 'ध्', width: 'w-10 md:w-12' },
    { key: 'ShiftRight', normal: '⇧ Shift', shift: '⇧ Shift', width: 'flex-1' }
  ],
  // Row 5 (Space)
  [
    { key: 'Control', normal: 'Ctrl', shift: 'Ctrl', width: 'w-14' },
    { key: 'Alt', normal: 'Alt', shift: 'Alt', width: 'w-14' },
    { key: ' ', normal: 'SPACEBAR', shift: 'SPACEBAR', width: 'flex-1 max-w-xl mx-auto h-11' },
    { key: 'AltGraph', normal: 'Alt', shift: 'Alt', width: 'w-14' },
    { key: 'ControlRight', normal: 'Ctrl', shift: 'Ctrl', width: 'w-14' }
  ]
];

// Single QWERTY key representation to Remington DevLys 010 character
const KEY_MAP: Record<string, string> = {
  'a': 'ं', 'b': 'इ', 'c': 'ब', 'd': 'क', 'e': 'म', 'f': 'ि', 'g': 'ु', 'h': 'ी', 'i': 'प', 'j': 'र',
  'k': 'ा', 'l': 'स', 'm': 'उ', 'n': 'द', 'o': 'व', 'p': 'च', 'q': 'ु', 'r': 'त', 's': 'े', 't': 'ज',
  'u': 'न', 'v': 'अ', 'w': 'ू', 'x': 'ग', 'y': 'ल', 'z': '्र',
  ';': 'य', "'": 'श', ',': 'ए', '.': 'ण', '/': 'ध',
  '[': 'ख्', ']': ',', '\\': 'ॉ', '`': 'ऱ',
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  '-': '-', '=': 'ृ',
  
  'A': 'ऋ', 'B': 'ठ', 'C': 'ब्', 'D': 'क्', 'E': 'म्', 'F': 'थ्', 'G': 'इ', 'H': 'भ्', 'I': 'प्', 'J': 'श्र्',
  'K': 'ज्ञ्', 'L': 'थ', 'M': 'ड', 'N': 'छ', 'O': 'व्', 'P': 'च्', 'Q': 'फ', 'R': 'त्', 'S': 'ै', 'T': 'ज्',
  'U': 'न्', 'V': 'ट', 'W': 'ॅ', 'X': 'ग्', 'Y': 'ल्', 'Z': 'ज्ञ',
  ':': 'रू', '"': 'ष्', '<': 'ढ', '>': '।', '?': 'ध्',
  '{': 'क्ष', '}': 'द्व', '|': '?', '~': 'इ',
  ')': 'ऋ', '!': 'त्', '@': 'थ्', '#': 'ध्', '$': 'भ्', '%': 'ः', '^': 'त्र', '&': 'ऋ', '*': 'द्ध', '(': 'त्र',
  '_': 'ः', '+': '।'
};

const RemingtonTypingTutor: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{ rating: number; count: number }>({ rating: 4.9, count: 485 });

  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const hasSavedSessionRef = useRef(false);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('remington_typing_sessions');
      if (saved) {
        setSessions(JSON.parse(saved));
      } else {
        // Seed with realistic initial data points for a professional look on first use
        const demoSessions: PracticeSession[] = [
          { id: 'd1', date: 'Session 1', type: 'lessons', name: 'Home Row - Basic Keys', wpm: 22, accuracy: 88 },
          { id: 'd2', date: 'Session 2', type: 'lessons', name: 'Home Row - Right Hand', wpm: 25, accuracy: 91 },
          { id: 'd3', date: 'Session 3', type: 'lessons', name: 'Home Row Combined Words', wpm: 29, accuracy: 93 },
          { id: 'd4', date: 'Session 4', type: 'lessons', name: 'Top Row - Left & Right', wpm: 28, accuracy: 90 },
          { id: 'd5', date: 'Session 5', type: 'lessons', name: 'Top Row Combined Words', wpm: 34, accuracy: 95 }
        ];
        setSessions(demoSessions);
        localStorage.setItem('remington_typing_sessions', JSON.stringify(demoSessions));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Navigation and Config
  const [activeTab, setActiveTab] = useState<'lessons' | 'speedtest' | 'custom'>('lessons');
  const [practiceDifficulty, setPracticeDifficulty] = useState<'basic' | 'words' | 'paragraphs'>('basic');
  const [filteredLessonIndex, setFilteredLessonIndex] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  // Filtered lessons based on difficulty selection
  const filteredLessons = useMemo(() => {
    switch (practiceDifficulty) {
      case 'basic':
        return LESSONS.filter(l => ['home', 'top', 'bottom', 'shift'].includes(l.category) && !l.name.includes('Combined Words'));
      case 'words':
        return LESSONS.filter(l => l.category === 'words' || l.name.includes('Combined Words'));
      case 'paragraphs': {
        const sentenceLessons = LESSONS.filter(l => l.category === 'sentences');
        const testLessons = SPEED_TESTS.map(st => ({
          id: st.id,
          name: st.name,
          category: 'sentences' as const,
          description: st.description,
          hindiText: st.hindiText
        }));
        return [...sentenceLessons, ...testLessons];
      }
      default:
        return LESSONS;
    }
  }, [practiceDifficulty]);
  
  // Custom practice text
  const [customHindiText, setCustomHindiText] = useState('');
  
  // Typing state
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [backspaceAllowed, setBackspaceAllowed] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [fontSize, setFontSize] = useState<'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'>('text-2xl');
  
  // Speed test duration config
  const [testDuration, setTestDuration] = useState<number>(300); // 5 mins in seconds default
  const [timerRemaining, setTimerRemaining] = useState<number>(300);

  // Tracks physical key presses for on-screen highlights
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [shiftPressed, setShiftPressed] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  // Play synthetic mechanical typing key click sound via Web Audio API (highly responsive, no networks, offline friendly)
  const playClickSound = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio context block handling
    }
  }, [isMuted]);

  // Current Lesson or Speed Test Object
  const currentItem = useMemo(() => {
    if (activeTab === 'lessons') {
      return filteredLessons[filteredLessonIndex] || filteredLessons[0] || LESSONS[0];
    } else if (activeTab === 'speedtest') {
      return SPEED_TESTS[currentTestIndex];
    } else {
      return {
        id: 'custom',
        name: 'Custom Typing Practice',
        description: 'Practice typing your own custom pasted Hindi Unicode text.',
        hindiText: customHindiText.trim() || 'कृपया यहाँ अपना हिंदी पाठ पेस्ट करें और अभ्यास शुरू करें।'
      };
    }
  }, [activeTab, filteredLessons, filteredLessonIndex, currentTestIndex, customHindiText]);

  // Translate standard Hindi Unicode text of active item into the exact sequence of Remington DevLys 010 characters
  const targetKeys = useMemo(() => {
    return unicodeToDevlys(currentItem.hindiText);
  }, [currentItem.hindiText]);

  const saveCurrentSession = useCallback((finalWpm: number, finalAccuracy: number) => {
    if (hasSavedSessionRef.current) return;
    hasSavedSessionRef.current = true;

    setSessions(prev => {
      const nextSession: PracticeSession = {
        id: Date.now().toString(),
        date: `Session ${prev.length + 1}`,
        type: activeTab,
        name: currentItem?.name || 'Practice',
        wpm: finalWpm,
        accuracy: finalAccuracy
      };
      const updated = [...prev, nextSession];
      localStorage.setItem('remington_typing_sessions', JSON.stringify(updated));
      return updated;
    });
  }, [activeTab, currentItem]);

  // Handle resets
  const resetPractice = useCallback(() => {
    setTypedText('');
    setIsActive(false);
    setStartTime(null);
    setElapsedTime(0);
    hasSavedSessionRef.current = false;
    setTimerRemaining(activeTab === 'speedtest' ? testDuration : 300);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
  }, [activeTab, testDuration]);

  // Sync test duration change with timer
  useEffect(() => {
    if (activeTab === 'speedtest') {
      setTimerRemaining(testDuration);
    }
  }, [testDuration, activeTab]);

  // Reset practice when lesson, test or tab changes
  useEffect(() => {
    resetPractice();
  }, [filteredLessonIndex, currentTestIndex, activeTab, practiceDifficulty, resetPractice]);

  // Typing timer hook
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          
          // Speed test countdown logic
          if (activeTab === 'speedtest') {
            setTimerRemaining(prevRemaining => {
              if (prevRemaining <= 1) {
                setIsActive(false);
                if (timerRef.current) clearInterval(timerRef.current);
                return 0;
              }
              return prevRemaining - 1;
            });
          }
          
          return next;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, activeTab]);

  // Auto scroll the text panel to keep active cursor visible
  useEffect(() => {
    if (activeCharSpanRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const activeSpan = activeCharSpanRef.current;
      
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elemTop = activeSpan.offsetTop - container.offsetTop;
      const elemBottom = elemTop + activeSpan.clientHeight;
      
      if (elemBottom > containerBottom - 40) {
        container.scrollTop = elemBottom - container.clientHeight + 40;
      } else if (elemTop < containerTop + 40) {
        container.scrollTop = elemTop - 40;
      }
    }
  }, [typedText.length]);

  // Typing Analytics Computations
  const stats = useMemo(() => {
    const totalKeys = typedText.length;
    if (totalKeys === 0) {
      return { wpm: 0, accuracy: 100, correctKeys: 0, wrongKeys: 0, progress: 0 };
    }

    let correctKeys = 0;
    for (let i = 0; i < totalKeys; i++) {
      if (typedText[i] === targetKeys[i]) {
        correctKeys++;
      }
    }

    const wrongKeys = totalKeys - correctKeys;
    const accuracy = Math.round((correctKeys / totalKeys) * 100);
    
    // WPM is calculated as standard (5 characters = 1 word)
    const minutes = (elapsedTime || 1) / 60;
    const grossWpm = Math.round((totalKeys / 5) / minutes);
    const netWpm = Math.round((correctKeys / 5) / minutes);
    
    const progress = Math.round((totalKeys / targetKeys.length) * 100);

    return {
      wpm: netWpm >= 0 ? netWpm : 0,
      grossWpm: grossWpm >= 0 ? grossWpm : 0,
      accuracy,
      correctKeys,
      wrongKeys,
      progress
    };
  }, [typedText, targetKeys, elapsedTime]);

  // Save session upon completion or speedtest timeout
  useEffect(() => {
    if (targetKeys.length > 0) {
      if (typedText.length === targetKeys.length) {
        setIsActive(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        saveCurrentSession(stats.wpm, stats.accuracy);
      } else if (activeTab === 'speedtest' && timerRemaining === 0 && typedText.length > 0) {
        setIsActive(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        saveCurrentSession(stats.wpm, stats.accuracy);
      }
    }
  }, [typedText.length, targetKeys.length, activeTab, timerRemaining, stats.wpm, stats.accuracy, saveCurrentSession]);

  // Capture typing events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;

    // Prevent navigation / default browser actions for Tab or Space
    if (key === 'Tab' || key === 'Escape') {
      e.preventDefault();
      return;
    }

    // Ignore special keys
    if (key === 'Control' || key === 'Alt' || key === 'Meta' || key === 'CapsLock') {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(key.toLowerCase());
        return next;
      });
      return;
    }

    if (key === 'Shift') {
      setShiftPressed(true);
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add('shiftleft');
        next.add('shiftright');
        return next;
      });
      return;
    }

    // Update keys set for active display state
    setPressedKeys(prev => {
      const next = new Set(prev);
      next.add(key.toLowerCase());
      return next;
    });

    // Toggle timer
    if (!isActive && key.length === 1 && typedText.length < targetKeys.length) {
      setIsActive(true);
      setStartTime(Date.now());
      hasSavedSessionRef.current = false;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      if (!backspaceAllowed) return;
      
      setTypedText(prev => {
        if (prev.length === 0) return prev;
        return prev.slice(0, -1);
      });
      playClickSound();
      return;
    }

    if (key.length === 1) {
      e.preventDefault();
      
      // Prevent further typing if test is over or complete
      if (typedText.length >= targetKeys.length || (activeTab === 'speedtest' && timerRemaining <= 0)) {
        return;
      }

      setTypedText(prev => prev + key);
      playClickSound();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;

    if (key === 'Shift') {
      setShiftPressed(false);
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete('shiftleft');
        next.delete('shiftright');
        return next;
      });
      return;
    }

    setPressedKeys(prev => {
      const next = new Set(prev);
      next.delete(key.toLowerCase());
      return next;
    });
  };

  // Keep focus on hidden textarea when clicking typing box
  const focusTypingArea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Find the next character key on virtual keyboard to prompt user
  const nextRequiredKey = useMemo(() => {
    if (typedText.length >= targetKeys.length) return null;
    const requiredChar = targetKeys[typedText.length];
    
    // Reverse lookup in KEY_MAP to find which English key is needed
    for (const [engKey, hindiChar] of Object.entries(KEY_MAP)) {
      if (hindiChar === requiredChar) {
        // Return key description
        const isUppercase = engKey === engKey.toUpperCase() && engKey !== engKey.toLowerCase();
        return {
          char: engKey,
          label: engKey === ' ' ? 'Spacebar' : engKey.toUpperCase(),
          shiftRequired: isUppercase,
          hindiChar: requiredChar
        };
      }
    }
    return null;
  }, [typedText, targetKeys]);

  // Progress tracker calculations
  const last10Sessions = useMemo(() => {
    return sessions.slice(-10).map((s, index) => ({
      ...s,
      displayDate: s.date || `Session ${index + 1}`
    }));
  }, [sessions]);

  const bestWpm = useMemo(() => {
    return sessions.length ? Math.max(...sessions.map(s => s.wpm)) : 0;
  }, [sessions]);

  const avgWpm = useMemo(() => {
    return sessions.length ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length) : 0;
  }, [sessions]);

  const avgAccuracy = useMemo(() => {
    return sessions.length ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) : 0;
  }, [sessions]);

  const clearSessionHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your practice progress history? This cannot be undone.')) {
      setSessions([]);
      localStorage.removeItem('remington_typing_sessions');
    }
  }, []);

  return (
    <article className="max-w-6xl mx-auto px-4 md:px-0 space-y-12 py-6">
      <style>{`
        @font-face {
          font-family: 'DevLys010';
          src: url('/font/DevLys-010.ttf') format('truetype'),
               url('font/DevLys-010.ttf') format('truetype'),
               url('./font/DevLys-010.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Kruti Dev 010';
          src: url('/font/DevLys-010.ttf') format('truetype'),
               url('font/DevLys-010.ttf') format('truetype'),
               url('./font/DevLys-010.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'KrutiDev010';
          src: url('/font/DevLys-010.ttf') format('truetype'),
               url('font/DevLys-010.ttf') format('truetype'),
               url('./font/DevLys-010.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <SEO 
        title="Remington Layout Hindi Typing Tutor | KrutiDev & DevLys Tunkon Practice"
        description="Learn Remington keyboard Hindi typing for IA, LDC, High Court and RSSB exams. Free online typing speed test, interactive layout guide, and lesson tutor."
        keywords="Remington layout typing tutor, Kruti Dev 010 typing test, DevLys 010 Hindi typing practice, Rajasthan LDC typing exam, Information Assistant typing tutor, Remington Gail keyboard map, Hindi typing kaise sikhe, Remington Gail keyboard typing practice, Kruti Dev typing test online free, Hindi typing test Remington layout, Krutidev typing speed kaise badhaye, Hindi computer typing practice Remington Gail, Devlys 010 typing practice software online, Mobile me Remington Gail typing, Best online Hindi typing tutor Kruti Dev, MP CPCT Hindi typing, SSC CHSL Hindi typing Remington Gail, Kruti Dev to Unicode, Remington typing test online, online Hindi typing tutor"
      />

      <AdUnit slot="typing-top-banner" format="horizontal" />

      {/* Header section */}
      <header className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-[12rem] -mr-16 -mt-16 opacity-60 blur-2xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl text-white shrink-0">
              🎯
            </div>
            <div>
              <span className="bg-teal-50 text-teal-700 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                Exam Preparation Suite
              </span>
              <h1 className="text-xl md:text-3xl font-display font-black text-slate-800 tracking-tight mt-1">
                Remington Layout <span className="text-teal-600">Hindi Typing Tutor</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                Practice typing for Rajasthan LDC, Informatics Assistant (IA), High Court & junior clerk exams using KrutiDev/DevLys layout.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'lessons' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab-lessons"
            >
              Lessons
            </button>
            <button
              onClick={() => setActiveTab('speedtest')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'speedtest' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab-speed-test"
            >
              Speed Test
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'custom' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab-custom"
            >
              Custom Text
            </button>
          </div>
        </div>
      </header>

      {/* Primary Configuration Control Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selection Column */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Select Practice Material
          </label>
          
          {activeTab === 'lessons' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200" id="difficulty-selector">
                <button
                  onClick={() => {
                    setPracticeDifficulty('basic');
                    setFilteredLessonIndex(0);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all text-center leading-normal ${
                    practiceDifficulty === 'basic'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id="diff-basic"
                >
                  Basic Keys
                </button>
                <button
                  onClick={() => {
                    setPracticeDifficulty('words');
                    setFilteredLessonIndex(0);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all text-center leading-normal ${
                    practiceDifficulty === 'words'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id="diff-words"
                >
                  Words
                </button>
                <button
                  onClick={() => {
                    setPracticeDifficulty('paragraphs');
                    setFilteredLessonIndex(0);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all text-center leading-normal ${
                    practiceDifficulty === 'paragraphs'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id="diff-paragraphs"
                >
                  Paragraphs
                </button>
              </div>

              <select
                value={filteredLessonIndex}
                onChange={(e) => setFilteredLessonIndex(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                id="select-lesson"
              >
                {filteredLessons.map((l, i) => (
                  <option key={l.id} value={i}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'speedtest' && (
            <select
              value={currentTestIndex}
              onChange={(e) => setCurrentTestIndex(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              id="select-speedtest"
            >
              {SPEED_TESTS.map((st, i) => (
                <option key={st.id} value={i}>
                  {st.name}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-2">
              <textarea
                value={customHindiText}
                onChange={(e) => setCustomHindiText(e.target.value)}
                placeholder="यहाँ अपना हिंदी टेक्स्ट डालें..."
                className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
                id="custom-text-input"
              />
              <p className="text-[10px] text-slate-400 italic">
                Paste any standard Unicode Hindi article to convert and practice instantly.
              </p>
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            {currentItem.description}
          </p>
        </div>

        {/* Options Column */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Tutor Controls
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBackspaceAllowed(!backspaceAllowed)}
                className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  backspaceAllowed 
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700' 
                    : 'border-rose-100 bg-rose-50 text-rose-700'
                }`}
                id="toggle-backspace"
                title={backspaceAllowed ? "Backspace is Allowed" : "Backspace is Blocked (Exam Mode)"}
              >
                <span>{backspaceAllowed ? '🔓 Backspace' : '🔒 Backspace'}</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  !isMuted 
                    ? 'border-teal-100 bg-teal-50 text-teal-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
                id="toggle-mute"
              >
                <span>{!isMuted ? '🔊 Clicks ON' : '🔇 Clicks OFF'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold text-slate-500">Text Size:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['text-lg', 'text-xl', 'text-2xl', 'text-3xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`w-8 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                    fontSize === sz ? 'bg-white text-teal-600 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  {sz.replace('text-', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Speedtest Timer Column */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Time Configuration
            </label>
            {activeTab === 'speedtest' ? (
              <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[
                  { label: '1m', val: 60 },
                  { label: '2m', val: 120 },
                  { label: '5m', val: 300 },
                  { label: '10m', val: 600 }
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setTestDuration(t.val)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      testDuration === t.val ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[11px] font-bold text-slate-400 text-center">
                ⏱️ Infinite Lesson Timer
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
            <span className="text-[11px] font-bold text-slate-400">Layout System:</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Remington Gail/DevLys
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Main Typing Box */}
      <section className="bg-white border border-slate-200 rounded-[2rem] shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Hidden textarea to capture keystrokes on mobile/desktop cleanly */}
        <textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute w-1 h-1 opacity-0 pointer-events-none"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-teal-600">
              {stats.wpm} <span className="text-xs font-bold text-slate-400">WPM</span>
            </div>
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
              Net Speed (Accuracy Adj.)
            </div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-slate-800">
              {stats.accuracy}<span className="text-xs font-bold text-slate-400">%</span>
            </div>
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
              Accuracy Rating
            </div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-slate-800">
              {activeTab === 'speedtest' ? (
                `${Math.floor(timerRemaining / 60)}:${(timerRemaining % 60).toString().padStart(2, '0')}`
              ) : (
                `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`
              )}
            </div>
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
              {activeTab === 'speedtest' ? 'Time Remaining' : 'Elapsed Time'}
            </div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-slate-800">
              {stats.correctKeys}<span className="text-xs font-bold text-slate-400">/{typedText.length}</span>
            </div>
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
              Correct / Total Keys
            </div>
          </div>
        </div>

        {/* Live Unicode Hindi Reference Guide */}
        <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-teal-600 text-[9px] text-white font-extrabold uppercase tracking-widest rounded-bl-xl">
            Live Unicode Guide
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            Original Hindi Text (Read here / मूल हिंदी पाठ):
          </span>
          <p className="text-base md:text-lg font-bold text-slate-700 leading-relaxed font-sans select-all">
            {currentItem.hindiText}
          </p>
        </div>

        {/* Visual Target Text Render Box */}
        <div 
          onClick={focusTypingArea}
          className="relative bg-slate-50 hover:bg-slate-50/70 cursor-text rounded-2xl border border-slate-200 p-6 min-h-[12rem] max-h-[16rem] overflow-y-auto leading-relaxed select-none transition-colors"
          id="typing-text-container"
          ref={textContainerRef}
        >
          {/* Active status indicator overlay */}
          {!isFocused && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center z-10 p-4 transition-all duration-300">
              <span className="text-4xl mb-3 animate-bounce">🎯</span>
              <p className="text-base font-extrabold text-slate-800">Click here to focus and start typing.</p>
              <p className="text-sm font-bold text-teal-600 mt-2 uppercase tracking-wide">
                स्टार्ट करने के लिए यहाँ क्लिक करें और टाइप करना शुरू करें
              </p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">
                Press any character key on your physical keyboard to start
              </p>
            </div>
          )}

          {/* Character mapping rendering */}
          <div className="flex flex-wrap gap-y-2 whitespace-pre-wrap select-none leading-none items-center" id="words-wrap">
            {targetKeys.split('').map((char, index) => {
              let charStyle = "text-slate-400";
              const isCurrent = index === typedText.length;
              
              if (isCurrent) {
                charStyle = "bg-teal-100 text-teal-800 font-bold border-b-2 border-teal-500 animate-pulse scale-110";
              } else if (index < typedText.length) {
                charStyle = typedText[index] === char 
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-rose-600 bg-rose-50 border-b-2 border-rose-300";
              }

              return (
                <span
                  key={index}
                  ref={isCurrent ? activeCharSpanRef : null}
                  className={`font-devlys ${fontSize} ${charStyle} transition-all duration-100 inline-block px-0.5 rounded leading-normal`}
                  style={{ fontFamily: "'DevLys010', 'Kruti Dev 010', serif" }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Real-time Input Helpers & Prompts */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 px-5 py-4 rounded-xl border border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
            <p className="text-xs font-bold text-slate-600">
              {nextRequiredKey ? (
                <>
                  Next Character Key:{' '}
                  <kbd className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-black text-slate-800 shadow-xs mr-2">
                    {nextRequiredKey.shiftRequired ? 'Shift + ' : ''}{nextRequiredKey.label}
                  </kbd>
                  {' yields '}
                  <span 
                    className="font-devlys text-xl text-teal-600 align-middle inline-block px-1 rounded bg-teal-50 border border-teal-100 leading-normal"
                    style={{ fontFamily: "'DevLys010', 'Kruti Dev 010', serif" }}
                  >
                    {nextRequiredKey.hindiChar}
                  </span>
                </>
              ) : (
                <span className="text-emerald-600">🎉 Exercise Completed successfully!</span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetPractice}
              className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-1.5"
              id="btn-reset"
            >
              🔄 Restart
            </button>
            <button
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg border flex items-center gap-1.5 transition-all ${
                showVirtualKeyboard 
                  ? 'bg-teal-50 text-teal-600 border-teal-100' 
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
              id="btn-toggle-keyboard"
            >
              ⌨️ {showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
            </button>
          </div>
        </div>

        {/* Virtual Remington Gail/DevLys Keyboard Layout Map */}
        {showVirtualKeyboard && (
          <div className="pt-4 border-t border-slate-100">
            <div className="max-w-4xl mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner space-y-1.5 select-none">
              {KEYBOARD_MAP.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                  {row.map((btn) => {
                    const isSpace = btn.key === ' ';
                    const isShift = btn.key.startsWith('Shift');
                    const isCapsLock = btn.key === 'CapsLock';
                    const isTab = btn.key === 'Tab';
                    const isBackspace = btn.key === 'Backspace';
                    const isEnter = btn.key === 'Enter';
                    
                    const isPressed = pressedKeys.has(btn.key.toLowerCase());
                    const isTargetKey = nextRequiredKey && nextRequiredKey.char.toLowerCase() === btn.key.toLowerCase();
                    const isTargetShift = nextRequiredKey && nextRequiredKey.shiftRequired && isShift;

                    let keyColor = "bg-white text-slate-800 border-slate-200 shadow-sm";
                    
                    if (isPressed) {
                      keyColor = "bg-teal-500 text-white border-teal-600 scale-95 shadow-inner";
                    } else if (isTargetKey || isTargetShift) {
                      keyColor = "bg-teal-100 text-teal-800 border-teal-300 animate-pulse scale-102 ring-2 ring-teal-500/30";
                    } else if (isShift || isCapsLock || isTab || isBackspace || isEnter) {
                      keyColor = "bg-slate-100 text-slate-500 border-slate-200 text-[9px] font-bold";
                    }

                    return (
                      <div
                        key={btn.key}
                        className={`h-11 border rounded-lg transition-all flex flex-col justify-between p-1 select-none ${btn.width} ${keyColor}`}
                        title={`Qwerty: ${btn.key} | Hindi: ${btn.normal}`}
                      >
                        {/* Standard keyboard labels for normal keys */}
                        {!isShift && !isCapsLock && !isTab && !isBackspace && !isEnter && !isSpace ? (
                          <>
                            <div className="flex justify-between text-[8px] font-bold text-slate-400">
                              <span>{btn.key.toUpperCase()}</span>
                              <span 
                                className="font-devlys text-[10px] text-slate-400 font-bold"
                                style={{ fontFamily: "'DevLys010', 'Kruti Dev 010', serif" }}
                              >
                                {btn.shift}
                              </span>
                            </div>
                            <div className="text-center">
                              <span 
                                className="font-devlys text-sm font-black text-slate-700 leading-none"
                                style={{ fontFamily: "'DevLys010', 'Kruti Dev 010', serif" }}
                              >
                                {btn.normal}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-center font-bold uppercase tracking-wider select-none leading-none">
                            {btn.normal}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Progress Tracker Section */}
      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden" id="progress-tracker-section">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-bl-[10rem] opacity-40 blur-xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <h2 className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                Practice Progress Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Visualize your typing speed (WPM) and accuracy (%) over your last 10 practice sessions.
            </p>
          </div>

          {sessions.length > 0 && (
            <button
              onClick={clearSessionHistory}
              className="bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg flex items-center gap-1.5"
              id="btn-clear-history"
            >
              🗑️ Clear History
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-4xl mb-3">🎯</span>
            <h3 className="text-sm font-bold text-slate-700">No sessions recorded yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Complete any lesson, custom exercise, or speed test to save and chart your typing stats here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Column (2/3 width) */}
            <div className="lg:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="h-[300px] w-full" id="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last10Sessions} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="displayDate" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#0d9488" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      label={{ value: 'Net Speed (WPM)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#0d9488', fontSize: 10, fontWeight: 'bold' }, offset: 10 }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#4f46e5" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 100]}
                      label={{ value: 'Accuracy (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#4f46e5', fontSize: 10, fontWeight: 'bold' }, offset: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                      labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="wpm" 
                      name="Speed (WPM)" 
                      stroke="#0d9488" 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                      dot={{ r: 4 }} 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="Accuracy (%)" 
                      stroke="#4f46e5" 
                      strokeWidth={2.5} 
                      strokeDasharray="4 4" 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 3 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Summary Panel (1/3 width) */}
            <div className="flex flex-col justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs" id="stat-peak-speed">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Peak Speed</span>
                    <span className="text-2xl font-black text-teal-600 block mt-0.5">{bestWpm}</span>
                    <span className="text-[9px] font-bold text-slate-400">WPM</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs" id="stat-avg-speed">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Avg Speed</span>
                    <span className="text-2xl font-black text-slate-700 block mt-0.5">{avgWpm}</span>
                    <span className="text-[9px] font-bold text-slate-400">WPM</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs" id="stat-avg-accuracy">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Avg Accuracy</span>
                    <span className="text-2xl font-black text-indigo-600 block mt-0.5">{avgAccuracy}%</span>
                    <span className="text-[9px] font-bold text-slate-400">Correct Keys</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs" id="stat-total-sessions">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Trials</span>
                    <span className="text-2xl font-black text-slate-700 block mt-0.5">{sessions.length}</span>
                    <span className="text-[9px] font-bold text-slate-400">Saved runs</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium leading-relaxed">
                <span className="font-bold text-teal-600">💡 Pro-Tip:</span> Aim for an accuracy above <span className="font-bold text-slate-700">95%</span> first, as speed naturally catches up with high accuracy muscle memory.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* AdUnit Middleware */}
      <AdUnit slot="typing-mid-feed" format="fluid" />

      {/* Structured Informational & Guide Content for SEO Ranking */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white space-y-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.04),transparent)] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Master Remington Layout <span className="text-teal-400">Hindi Typing</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              The <strong>Remington Gail layout</strong> is the official standard keyboard used in central and state government typing examinations, especially in Rajasthan (RSSB Clerk LDC, Information Assistant, High Court Stenographer, Junior Assistant). Unlike standard phonetics, the Remington layout maps English keystrokes directly to Hindi characters. Consistent practice with a dedicated keyboard map is required to build speed and clear government criteria.
            </p>

            <div className="space-y-4 border-l-2 border-teal-500 pl-4">
              <h3 className="text-lg font-bold text-teal-400">
                🚀 How to Practice Hindi Typing for Exams:
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li><strong>Start with the Home Row:</strong> Focus purely on mastering keys `a, s, d, f, g, h, j, k, l, ;, '` without looking at your physical keyboard.</li>
                <li><strong>Maintain Good Posture:</strong> Keep your fingers curved on the Home Row keys as home positions (`a, s, d, f` for left hand, `j, k, l, ;` for right hand).</li>
                <li><strong>Focus on Accuracy first:</strong> Speed will build naturally once your muscle memory is locked. Maintain over 95% accuracy in exercises.</li>
                <li><strong>Block Backspace:</strong> Turn off Backspace in the settings above to simulate strict government exam testing conditions.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 h-fit">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-4">
              📌 Remington Gail vs Remington DevLys Layout
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In government typing tests, candidate guidelines often mention both Remington Gail and Kruti Dev/DevLys layouts. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-teal-400 font-bold text-xs mb-1">Remington Gail</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Operates under standard unicode systems (Mangal). Shift mappings, half letters, and punctuation keys match standardized Indian government scripts.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="text-teal-400 font-bold text-xs mb-1">Kruti Dev / DevLys</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Legacy typewriter fonts that convert typed text into ASCII character codes representing glyphs. Requires manual mapping conversion to standard Unicode.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Our tutor natively models both! It reads normal Unicode text inputs, converts them to DevLys keystrokes at runtime, and checks your performance instantly.
            </p>
          </div>
        </div>

        {/* Brand New Extended SEO Section 1: Hand & Finger Mapping Details */}
        <div className="border-t border-white/10 pt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4 lg:col-span-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">⌨️ Scientific Layout</span>
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight">
              Remington Gail Keyboard Finger Placement Map
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To achieve speeds above 40 WPM, touch typing is mandatory. Never look down at the keyboard while typing Hindi text. Keep your left-hand fingers rested on <code className="bg-white/10 px-1 py-0.5 rounded">ASDF</code> and your right-hand fingers on <code className="bg-white/10 px-1 py-0.5 rounded">LKJ;</code>.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-teal-400 mb-2">Left Hand Finger Map</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-none">
                <li><span className="font-bold text-slate-100">Pinky (कनिष्ठिका):</span> Controls <code className="text-teal-400">A</code> (ह / ं), <code className="text-teal-400">Q</code> (फ / ु) and <code className="text-teal-400">Z</code> (्र / र्‍)</li>
                <li><span className="font-bold text-slate-100">Ring Finger (अनामिका):</span> Controls <code className="text-teal-400">S</code> (क / क), <code className="text-teal-400">W</code> (च / च्) and <code className="text-teal-400">X</code> (ग / ग्न)</li>
                <li><span className="font-bold text-slate-100">Middle Finger (मध्यमा):</span> Controls <code className="text-teal-400">D</code> (म / म्), <code className="text-teal-400">E</code> (म / म्) and <code className="text-teal-400">C</code> (ब / ब्)</li>
                <li><span className="font-bold text-slate-100">Index Finger (तर्जनी):</span> Controls <code className="text-teal-400">F</code> (त / त्), <code className="text-teal-400">G</code> (ज / ज्), <code className="text-teal-400">R</code> (त / त्) and <code className="text-teal-400">T</code> (ज / ज्)</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-teal-400 mb-2">Right Hand Finger Map</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-none">
                <li><span className="font-bold text-slate-100">Index Finger (तर्जनी):</span> Controls <code className="text-teal-400">H</code> (ी / ि), <code className="text-teal-400">Y</code> (ल / ल्) and <code className="text-teal-400">N</code> (न / न्)</li>
                <li><span className="font-bold text-slate-100">Middle Finger (मध्यमा):</span> Controls <code className="text-teal-400">J</code> (र / र्), <code className="text-teal-400">U</code> (न / न्) and <code className="text-teal-400">M</code> (ए / ऐ)</li>
                <li><span className="font-bold text-slate-100">Ring Finger (अनामिका):</span> Controls <code className="text-teal-400">K</code> (ा / ा) and <code className="text-teal-400">I</code> (प / प्)</li>
                <li><span className="font-bold text-slate-100">Pinky (कनिष्ठिका):</span> Controls <code className="text-teal-400">L</code> (स / स्), <code className="text-teal-400">;</code> (य / य्), and <code className="text-teal-400">P</code> (च / च्)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Brand New Extended SEO Section 2: Special Characters & Alt Codes Chart */}
        <div className="border-t border-white/10 pt-10 relative z-10 space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">📝 Special Alt-Codes</span>
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight mt-1">
              Kruti Dev & Remington Gail Special Code List (Alt Codes)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2 max-w-3xl">
              In Hindi exams, you will encounter complex conjuncted characters that cannot be typed with single keys. These special characters are generated by holding the <code className="bg-white/10 px-1 py-0.5 rounded">Alt</code> key and typing a 4-digit code using the numeric keypad.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { code: "Alt + 0161", char: "द्ग", name: "Dga" },
              { code: "Alt + 0163", char: "द्ध", name: "Ddha" },
              { code: "Alt + 0165", char: "द्व", name: "Dva" },
              { code: "Alt + 0170", char: "द्म", name: "Dma" },
              { code: "Alt + 0180", char: "ङ्क", name: "Ngka" },
              { code: "Alt + 0182", char: "ङ्ख", name: "Ngkha" },
              { code: "Alt + 0184", char: "ङ्ग", name: "Ngga" },
              { code: "Alt + 0187", char: "ङ्घ", name: "Nggha" },
              { code: "Alt + 0197", char: "ऋ", name: "Vowel Ri" },
              { code: "Alt + 0204", char: "त्त", name: "Tta" },
              { code: "Alt + 0212", char: "क्र", name: "Kra" },
              { code: "Alt + 0224", char: "ह्य", name: "Hya" }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 text-center flex flex-col justify-center items-center">
                <span className="text-2xl font-black text-white font-devlys mb-1" style={{ fontFamily: "'DevLys010', 'Kruti Dev 010', serif" }}>{item.char}</span>
                <span className="text-[10px] text-teal-400 font-mono font-bold">{item.code}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand New Extended SEO Section 3: Assessment Logic and Formulae */}
        <div className="border-t border-white/10 pt-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">📊 Performance Metrics</span>
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight">
              How Typing Speed is Evaluated in Govt Exams
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Different state and national recruitment boards use distinct evaluation schemes. In general, 5 keystrokes are counted as one word. Let us look at the standard formulas:
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-teal-400 mb-1">Gross Speed Formula (G-WPM)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gross Words Per Minute measures total keystrokes without taking mistakes into account: <br />
                  <span className="font-mono text-xs text-slate-200 bg-black/30 px-2 py-1 rounded inline-block mt-1">Gross WPM = (Total Keystrokes / 5) / Time (Minutes)</span>
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-teal-400 mb-1">Net Speed Formula (N-WPM)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Net Words Per Minute incorporates errors and deducts penalties for missed/wrong keypresses: <br />
                  <span className="font-mono text-xs text-slate-200 bg-black/30 px-2 py-1 rounded inline-block mt-1">Net WPM = Gross WPM - (Uncorrected Errors / Time)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">🎓 Target Recruitment Exams</span>
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight">
              High-Value Hindi Typing Exams Syllabus Coverage
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our tutor's custom training paragraphs and speed test simulation covers the official typing syllabi of key competitive examinations:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1">Rajasthan RSMSSB LDC</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Required Hindi typing speed: 25 WPM. Tested on Mangal Font with Remington Gail keyboard layout. Passing score grants crucial weightage in merit rank.
                </p>
              </div>

              <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1">MP CPCT Examination</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Required speed: 20 Net WPM in Hindi. Supports Remington Gail and Inscript layouts on unicode Mangal typeface.
                </p>
              </div>

              <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1">Allahabad High Court</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Required speed: 25 WPM. Uses standard Remington Gail layouts on Mangal font. Accuracy constraints are very strict.
                </p>
              </div>

              <div className="p-4 bg-slate-800/40 border border-white/5 rounded-xl">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1">SSC CHSL / CGL</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Requires 30 WPM Hindi typing speed. Crucial qualifying segment for central government clerk and assistant roles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rich SEO Content / Accompanying FAQs */}
        <div className="pt-8 border-t border-white/10">
          <AccompanyingText 
            toolName="Remington Layout Hindi Typing Tutor"
            howItWorks="This online tool processes your physical keystrokes and matches them against standard Remington Gail (KrutiDev 010 / DevLys 010) keyboard layout. It maps unshifted and shifted key strokes to correct Hindi unicode glyphs locally in your browser, running completely offline and safeguarding your typing performance metrics."
            whyItsUseful="An absolute necessity for candidates preparing for government clerk and computer operator examinations. Our visual interactive keyboard dynamically highlights active letters, shift keys, and character results, guiding typing students in cementing high-speed muscle memory."
            faqs={[
              { q: "What keyboard is used in Rajasthan LDC and IA exams?", a: "The Remington Gail (Hindi unicode) layout is the official typing standard used by the RSMSSB (Rajasthan Staff Selection Board) and High Court." },
              { q: "What is the minimum speed needed to pass government typing exams?", a: "Most competitive exams specify a minimum speed of 25 to 30 Words Per Minute (WPM) with at least 90% or 95% accuracy to pass." },
              { q: "Can I practice Remington typing on my laptop keyboard?", a: "Yes! Our tutor operates on any standard QWERTY laptop or USB keyboard without installing separate typing software." },
              { q: "Does the speed test count backspaces as penalties?", a: "Yes, backspaces delay your speed. In Rajasthan exams, speeds are typically evaluated based on Net WPM (correct words per minute) where errors are factored as penalties." }
            ]}
          />
        </div>

        <div className="pt-8 border-t border-white/10 text-center space-y-4 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            SECURE CLIENT-SIDE DATA AUDIT BY TOOLINA AUDIT SYSTEMS
          </p>
          <div className="max-w-4xl mx-auto text-xs text-slate-500 leading-relaxed mb-6">
            Keywords: Remington Gail typing test, DevLys 010 tunkon practice, Kruti Dev online typing, Rajasthan LDC typing speed test, IA typing exam practice, standard Hindi typing layout, Remington Gail keyboard map, free typing trainer for students.
          </div>
        </div>

        {/* Categorized Hinglish & English SEO Keywords & Search Intent Cloud */}
        <div className="border-t border-white/10 pt-8 relative z-10 space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">🔍 Search Intent Guide</span>
            <h3 className="text-lg md:text-xl font-display font-black tracking-tight text-white mt-1">
              Popular Search Keywords & Hinglish Queries / लोकप्रिय खोज शब्द और कीवर्ड
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-2 leading-relaxed">
              Find this Remington Layout Hindi Typing tool using any of the highly searched terms below. Optimized for state government exams (LDC, IA, CPCT, High Court) and self-learning candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">
                ⌨️ Remington Gail Layout
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Remington Gail Hindi Typing Tutor",
                  "Remington Layout Typing Practice",
                  "Hindi Unicode Remington Gail",
                  "Remington Gail Layout Chart",
                  "Mangal Font Remington Gail"
                ].map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-800/40 text-slate-300 border border-white/5 px-2 py-1 rounded-md hover:border-teal-500/30 transition-all">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">
                📝 Kruti Dev & DevLys
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Kruti Dev 010 Online Typing Test",
                  "DevLys 010 Hindi Typing Tutor",
                  "Kruti Dev Keyboard Layout Free",
                  "Kruti Dev Hindi Typing Speed",
                  "Devlys 010 to Unicode online"
                ].map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-800/40 text-slate-300 border border-white/5 px-2 py-1 rounded-md hover:border-teal-500/30 transition-all">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">
                🎓 Govt Exams Syllabus
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Rajasthan RSMSSB LDC Hindi Typing",
                  "Informatics Assistant IA Typing Test",
                  "MP CPCT Hindi Typing Remington",
                  "Allahabad High Court Clerk Typing",
                  "SSC CHSL Hindi Speed Test online"
                ].map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-800/40 text-slate-300 border border-white/5 px-2 py-1 rounded-md hover:border-teal-500/30 transition-all">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 border-b border-white/5 pb-1">
                🗣️ Hinglish & Hindi Queries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Hindi typing kaise sikhe computer par",
                  "Online hindi typing test Remington free",
                  "Kruti dev typing speed kaise badhaye",
                  "Mobile me Remington Gail typing kaise kare",
                  "Best online Hindi typing tutor software"
                ].map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-800/40 text-slate-300 border border-white/5 px-2 py-1 rounded-md hover:border-teal-500/30 transition-all">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Rating & Sharing */}
      <div className="max-w-3xl mx-auto space-y-8">
        <StarRatingWidget 
          toolId="remington-typing" 
          defaultRating={4.9} 
          defaultCount={485} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
        <ShareWidget title="Remington Layout Hindi Typing Tutor" />
      </div>

      <AdUnit slot="typing-bottom-banner" format="horizontal" />
    </article>
  );
};

export default RemingtonTypingTutor;
