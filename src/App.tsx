/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCcw, Trophy } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  answer: number;
}

interface Statement {
  id: number;
  text: string;
  isCorrect: boolean;
}

const PART1_QUESTIONS: Question[] = [
  { id: 1, text: '46 : 23 =', answer: 2 },
  { id: 2, text: '84 : 28 =', answer: 3 },
  { id: 3, text: '84 : 6 =', answer: 14 },
  { id: 4, text: '95 : 5 =', answer: 19 },
  { id: 5, text: '84 : 21 =', answer: 4 },
  { id: 6, text: '76 : 19 =', answer: 4 },
  { id: 7, text: '68 : 4 =', answer: 17 },
  { id: 8, text: '98 : 2 =', answer: 49 },
];

const PART2_STATEMENTS: Statement[] = [
  { id: 1, text: 'Если число двузначное, то это число не меньше 15.', isCorrect: false },
  { id: 2, text: 'Если число однозначное, то это число не больше 4.', isCorrect: true },
  { id: 3, text: 'Если число не меньше 17, то это число нечётное.', isCorrect: true },
  { id: 4, text: 'Если число чётное, то это число не больше 14.', isCorrect: true },
];

export default function App() {
  const [part1Answers, setPart1Answers] = useState<Record<number, string>>({});
  const [part2Selected, setPart2Selected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const part1Results = useMemo(() => {
    return PART1_QUESTIONS.map(q => ({
      ...q,
      userAnswer: parseInt(part1Answers[q.id] || ''),
      isCorrect: parseInt(part1Answers[q.id] || '') === q.answer
    }));
  }, [part1Answers]);

  const part2Results = useMemo(() => {
    return PART2_STATEMENTS.map(s => {
      const isSelected = part2Selected.includes(s.id);
      return {
        ...s,
        isSelected,
        // A statement result is correct if:
        // 1. It is correct and user selected it
        // 2. It is incorrect and user did NOT select it
        isCorrectResult: isSelected === s.isCorrect
      };
    });
  }, [part2Selected]);

  const totalCorrect = useMemo(() => {
    const p1Count = part1Results.filter(r => r.isCorrect).length;
    const p2Count = part2Results.filter(r => r.isCorrectResult).length;
    return p1Count + p2Count;
  }, [part1Results, part2Results]);

  const totalQuestions = PART1_QUESTIONS.length + PART2_STATEMENTS.length;

  const handleCheck = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsChecked(true);

    if (totalCorrect === totalQuestions || newAttempts >= 2) {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setPart1Answers({});
    setPart2Selected([]);
    setAttempts(0);
    setIsChecked(false);
    setIsFinished(false);
  };

  const togglePart2 = (id: number) => {
    if (isFinished) return;
    setPart2Selected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
          >
            Тренажер по устному счёту
          </motion.h1>
          <p className="text-muted-foreground">Выполни задания и проверь свои знания</p>
        </header>

        <div className="space-y-8">
          {/* Part 1 */}
          <section className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-black/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Часть. Вычисли
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {PART1_QUESTIONS.map((q) => (
                <div key={q.id} className="flex items-center justify-between group">
                  <label htmlFor={`q-${q.id}`} className="text-lg font-medium">
                    {q.text}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id={`q-${q.id}`}
                      type="number"
                      disabled={isFinished}
                      value={part1Answers[q.id] || ''}
                      onChange={(e) => setPart1Answers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className={`w-20 px-3 py-2 rounded-xl border-2 transition-all outline-none text-center font-mono text-lg
                        ${isChecked && !part1Results.find(r => r.id === q.id)?.isCorrect 
                          ? 'border-red-200 bg-red-50 focus:border-red-400' 
                          : isChecked && part1Results.find(r => r.id === q.id)?.isCorrect
                          ? 'border-emerald-200 bg-emerald-50 focus:border-emerald-400'
                          : 'border-gray-100 bg-gray-50 focus:border-black'
                        }
                      `}
                    />
                    {isChecked && (
                      <div className="absolute -right-8">
                        {part1Results.find(r => r.id === q.id)?.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Part 2 */}
          <section className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-black/5">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Часть
            </h2>
            <p className="text-sm text-muted-foreground mb-6 italic">
              Внимательно посмотри на числа, получившиеся в ответах, и выбери верные утверждения:
            </p>
            <div className="space-y-3">
              {part2Results.map((s) => (
                <button
                  key={s.id}
                  onClick={() => togglePart2(s.id)}
                  disabled={isFinished}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4
                    ${s.isSelected 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }
                    ${isChecked && isFinished ? (
                      s.isCorrectResult 
                        ? 'ring-2 ring-emerald-400 ring-offset-2' 
                        : 'ring-2 ring-red-400 ring-offset-2'
                    ) : ''}
                  `}
                >
                  <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                    ${s.isSelected ? 'border-white bg-white' : 'border-gray-300'}
                  `}>
                    {s.isSelected && <div className="w-2 h-2 bg-black rounded-sm" />}
                  </div>
                  <span className="text-sm md:text-base leading-tight">{s.text}</span>
                </button>
              ))}
            </div>
            {isChecked && !isFinished && (
              <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 text-amber-800 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>Есть ошибки во второй части или не все верные утверждения выбраны. У вас осталась одна попытка.</span>
              </div>
            )}
          </section>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 pb-12">
            {!isFinished ? (
              <button
                onClick={handleCheck}
                className="px-12 py-4 bg-black text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-black/10 active:scale-95"
              >
                {attempts === 0 ? 'Проверить ответы' : 'Проверить еще раз'}
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center space-y-6"
              >
                <div className="bg-emerald-500 text-white p-8 rounded-3xl shadow-xl shadow-emerald-500/20">
                  <Trophy className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Результат: {totalCorrect} из {totalQuestions}</h3>
                  <p className="opacity-90">
                    {totalCorrect === totalQuestions 
                      ? 'Великолепно! Все ответы верны.' 
                      : 'Хорошая работа! Попробуй еще раз, чтобы набрать максимум.'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-3 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Начать заново
                </button>
              </motion.div>
            )}
            
            {!isFinished && attempts > 0 && (
              <p className="text-sm text-muted-foreground">
                Попытка {attempts} из 2
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
