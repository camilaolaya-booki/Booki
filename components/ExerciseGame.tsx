
import React, { useState, useEffect } from 'react';
import { ExerciseType, City, ReadingText, Question } from '../types';
import { generateReadingExercise } from '../services/geminiService';
import { EXERCISE_LABELS } from '../constants';
import { sounds } from '../services/soundService';

interface ExerciseGameProps {
  city: City;
  type: ExerciseType;
  onFinish: (score: number, coins: number) => void;
  onBack: () => void;
}

const ExerciseGame: React.FC<ExerciseGameProps> = ({ city, type, onFinish, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ReadingText | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const data = await generateReadingExercise(type, city.name);
        setContent(data);
      } catch (err) {
        setError("¡Oh no! Librito está buscando los libros. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [city, type]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOption(option);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || !content) return;
    
    const isCorrect = selectedOption === content.questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(score + 1);
    } else {
      sounds.playError();
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    sounds.playClick();
    if (!content) return;
    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onFinish(score, score * 10);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-orange-50">
        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-orange-600">Librito está preparando tu reto...</h2>
        <p className="text-gray-500 mt-2">Estamos viajando a {city.name} para traerte historias increíbles.</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <span className="text-6xl mb-4">🏜️</span>
        <h2 className="text-2xl font-bold text-red-600">{error || "Algo salió mal"}</h2>
        <button onClick={onBack} className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full font-bold">Volver al mapa</button>
      </div>
    );
  }

  const currentQuestion = content.questions[currentQuestionIndex];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-100">
        <div 
          className="h-full bg-green-500 transition-all duration-500" 
          style={{ width: `${((currentQuestionIndex + 1) / content.questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-8 flex-1 overflow-auto">
        {/* Left: Content */}
        <div className="md:w-1/2 flex flex-col">
          <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 flex-1 relative">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
              {EXERCISE_LABELS[type]} en {city.name}
            </h3>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.title}</h2>
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content.content}
            </div>
            <div className="mt-8 opacity-20 pointer-events-none select-none absolute bottom-4 right-4">
               <span className="text-8xl">📖</span>
            </div>
          </div>
        </div>

        {/* Right: Question */}
        <div className="md:w-1/2 flex flex-col">
          <div className="bg-white rounded-3xl p-2 h-full flex flex-col">
            <h4 className="text-xl font-bold text-gray-800 mb-6 px-4">
              Pregunta {currentQuestionIndex + 1}:
              <span className="block text-gray-600 font-medium mt-1">{currentQuestion.text}</span>
            </h4>

            <div className="grid gap-3 flex-1 overflow-auto px-4">
              {currentQuestion.options.map((option) => {
                let statusClass = "border-gray-200 hover:border-orange-300 hover:bg-orange-50";
                if (isAnswered) {
                  if (option === currentQuestion.correctAnswer) statusClass = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
                  else if (option === selectedOption) statusClass = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100";
                  else statusClass = "border-gray-100 opacity-50";
                } else if (option === selectedOption) {
                  statusClass = "border-orange-500 bg-orange-100 text-orange-700 ring-4 ring-orange-50";
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(option)}
                    className={`p-4 rounded-2xl border-4 text-left transition-all font-semibold ${statusClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="p-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              {isAnswered && (
                <p className={`text-sm font-medium ${selectedOption === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                  {currentQuestion.feedback || (selectedOption === currentQuestion.correctAnswer ? "¡Excelente trabajo!" : "¡Casi! Sigue intentando.")}
                </p>
              )}
              
              {!isAnswered ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleConfirmAnswer}
                  className="ml-auto bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transform active:scale-95 transition-all"
                >
                  Confirmar
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="ml-auto bg-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-green-600 transform active:scale-95 transition-all"
                >
                  {currentQuestionIndex < content.questions.length - 1 ? 'Siguiente' : 'Ver resultado'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseGame;
