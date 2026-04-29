'use client';
import { useState } from 'react';
import API from '@/lib/api';

interface Answer {
  id: number;
  user_name: string;
  answer: string;
  created_at: string;
}

interface Question {
  id: number;
  user_name: string;
  question: string;
  created_at: string;
  answers: Answer[];
}

export default function QandA({ collegeId, questions: initialQuestions }: {
  collegeId: number;
  questions: Question[];
}) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [userName, setUserName] = useState('');
  const [question, setQuestion] = useState('');
  const [answerTexts, setAnswerTexts] = useState<{ [key: number]: string }>({});
  const [answerNames, setAnswerNames] = useState<{ [key: number]: string }>({});
  const [openAnswer, setOpenAnswer] = useState<number | null>(null);

  const submitQuestion = async () => {
    if (!userName || !question) {
      alert('Please enter your name and question!');
      return;
    }
    try {
      const res = await API.post(`/colleges/${collegeId}/questions`, {
        user_name: userName,
        question
      });
      setQuestions([{ ...res.data, answers: [] }, ...questions]);
      setUserName('');
      setQuestion('');
    } catch (err) {
      console.error(err);
    }
  };

  const submitAnswer = async (questionId: number) => {
    const answerText = answerTexts[questionId];
    const answerName = answerNames[questionId];
    if (!answerName || !answerText) {
      alert('Please enter your name and answer!');
      return;
    }
    try {
      const res = await API.post(`/colleges/questions/${questionId}/answers`, {
        user_name: answerName,
        answer: answerText
      });
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { ...q, answers: [...(q.answers || []), res.data] };
        }
        return q;
      }));
      setAnswerTexts({ ...answerTexts, [questionId]: '' });
      setAnswerNames({ ...answerNames, [questionId]: '' });
      setOpenAnswer(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Ask Question Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Ask a Question</h3>
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm outline-none focus:border-blue-400 text-gray-800 bg-white"
        />
        <textarea
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm outline-none focus:border-blue-400 resize-none text-gray-800 bg-white"
        />
        <button
          onClick={submitQuestion}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Post Question
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="border border-gray-100 rounded-xl p-5">
              {/* Question */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold text-blue-600">{q.user_name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(q.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 font-medium mb-3">❓ {q.question}</p>

              {/* Answers */}
              {q.answers && q.answers.length > 0 && (
                <div className="ml-4 space-y-2 mb-3">
                  {q.answers.map((a) => (
                    <div key={a.id} className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <span className="text-sm font-bold text-green-700">{a.user_name}</span>
                      <p className="text-sm text-gray-700 mt-1">💬 {a.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Input */}
              {openAnswer === q.id ? (
                <div className="ml-4 mt-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={answerNames[q.id] || ''}
                    onChange={(e) => setAnswerNames({ ...answerNames, [q.id]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm outline-none focus:border-blue-400 text-gray-800 bg-white"
                  />
                  <textarea
                    placeholder="Write your answer..."
                    value={answerTexts[q.id] || ''}
                    onChange={(e) => setAnswerTexts({ ...answerTexts, [q.id]: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm outline-none focus:border-blue-400 resize-none text-gray-800 bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitAnswer(q.id)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition">
                      Submit Answer
                    </button>
                    <button
                      onClick={() => setOpenAnswer(null)}
                      className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setOpenAnswer(q.id)}
                  className="text-sm text-blue-600 hover:underline mt-1">
                  + Answer this question
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}