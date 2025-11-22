import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson, TabState, Quiz, ContentType } from '../types';
import { ChatInterface } from '../components/ChatInterface';
import { generateLessonQuiz, generateAssignment } from '../services/geminiService';
import { CheckCircle, PlayCircle, Code, BrainCircuit, ChevronLeft, Loader2, ExternalLink, AlertTriangle, MonitorPlay, HelpCircle, RefreshCw } from 'lucide-react';

interface LessonRoomProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const LessonRoom: React.FC<LessonRoomProps> = ({ lesson, onComplete, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabState>(TabState.OVERVIEW);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [assignment, setAssignment] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  
  // Video State
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Used to force reload the iframe
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // Reset state on lesson change
    setActiveTab(TabState.OVERVIEW);
    setQuiz(null);
    setAssignment('');
    setQuizSubmitted(false);
    setPassed(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowVideo(false);
    setVideoError(false);
    setIframeKey(0);
  }, [lesson.id]);

  const loadTabContent = async (tab: TabState) => {
    setActiveTab(tab);
    
    if (tab === TabState.QUIZ && !quiz) {
      setLoadingContent(true);
      try {
        const q = await generateLessonQuiz(lesson.title);
        setQuiz(q);
      } finally {
        setLoadingContent(false);
      }
    }

    if (tab === TabState.ASSIGNMENT && !assignment) {
      setLoadingContent(true);
      try {
        const a = await generateAssignment(lesson.title);
        setAssignment(a);
      } finally {
        setLoadingContent(false);
      }
    }
  };

  const handleOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (quiz && selectedOption !== null) {
      const isCorrect = selectedOption === quiz.questions[currentQuestionIndex].correctOptionIndex;
      if (isCorrect) setScore(s => s + 1);

      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Finish Quiz
        const finalScore = isCorrect ? score + 1 : score;
        setQuizSubmitted(true);
        const passThreshold = Math.ceil(quiz.questions.length * 0.6); // 60% to pass
        if (finalScore >= passThreshold) {
          setPassed(true);
          onComplete(finalScore); // Unlock next lesson
        }
      }
    }
  };

  const retryVideo = () => {
      setVideoError(false);
      setShowVideo(false);
      setIframeKey(k => k + 1);
      // Small delay to allow UI to reset before trying again
      setTimeout(() => setShowVideo(true), 100);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
        {/* Top Bar */}
        <div className="h-14 border-b border-[#2d2d2d] flex items-center px-4 justify-between bg-[#161616]">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={18} /> Back to Dashboard
            </button>
            <h2 className="font-bold text-gray-200 hidden md:block truncate px-4">{lesson.title}</h2>
            <div className="w-24"></div> {/* Spacer */}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Content + Tabs */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
                {/* Video/Blog Area */}
                <div className="w-full bg-black aspect-video flex items-center justify-center relative group bg-[#111]">
                    {lesson.type === ContentType.VIDEO ? (
                        !videoError ? (
                            showVideo ? (
                                <iframe
                                    key={iframeKey}
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${lesson.url}?autoplay=1&modestbranding=1&rel=0`}
                                    title={lesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    onError={() => setVideoError(true)}
                                ></iframe>
                            ) : (
                                <button 
                                    onClick={() => setShowVideo(true)}
                                    className="absolute inset-0 w-full h-full group cursor-pointer overflow-hidden"
                                >
                                    <img 
                                        src={lesson.thumbnail} 
                                        alt={lesson.title} 
                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-all duration-500 group-hover:scale-105 blur-sm group-hover:blur-0" 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-rose-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.5)] group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                                            <PlayCircle fill="white" size={40} className="text-white ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
                                        <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20 mb-2 backdrop-blur-sm">
                                            VIDEO LESSON
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{lesson.title}</h3>
                                        <p className="text-gray-300 text-sm">Click to start watching</p>
                                    </div>
                                </button>
                            )
                        ) : (
                            /* Fallback UI if iframe fails */
                            <div className="text-center p-8 max-w-lg bg-[#111] rounded-2xl border border-[#2d2d2d] shadow-2xl animate-fade-in z-20">
                                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Video Playback Issue</h3>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                    The embedded player encountered a configuration error (Code 153). This usually happens due to browser privacy settings.
                                </p>
                                <div className="space-y-3">
                                    <a 
                                        href={`https://www.youtube.com/watch?v=${lesson.url}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg w-full justify-center"
                                    >
                                        <MonitorPlay size={18} /> Watch on YouTube
                                    </a>
                                    <button 
                                        onClick={retryVideo}
                                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white justify-center w-full py-2"
                                    >
                                        <RefreshCw size={14} /> Try to load again
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-8 text-center relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">{lesson.title}</h2>
                            <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">Required Reading Assignment</p>
                            <a href={lesson.url} target="_blank" rel="noreferrer" className="bg-rose-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-rose-900/20">
                                Open Article <ExternalLink size={20} />
                            </a>
                        </div>
                    )}

                    {/* Manual Fallback Button (Absolute positioned, always available when video is showing) */}
                    {lesson.type === ContentType.VIDEO && !videoError && showVideo && (
                        <button 
                            onClick={() => setVideoError(true)}
                            className="absolute top-4 right-4 bg-black/60 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/80 backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30 border border-white/10"
                        >
                            <HelpCircle size={12} /> Player Error?
                        </button>
                    )}

                    {lesson.type === ContentType.BLOG && (
                        <img src={lesson.thumbnail} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md" />
                    )}
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-[#2d2d2d] bg-[#161616]">
                    <button 
                        onClick={() => loadTabContent(TabState.OVERVIEW)}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === TabState.OVERVIEW ? 'border-rose-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => loadTabContent(TabState.ASSIGNMENT)}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === TabState.ASSIGNMENT ? 'border-rose-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        <Code size={16} /> Assignment
                    </button>
                    <button 
                        onClick={() => loadTabContent(TabState.QUIZ)}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === TabState.QUIZ ? 'border-rose-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        <BrainCircuit size={16} /> Quiz
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="p-6 flex-1 bg-[#0f0f0f]">
                    {activeTab === TabState.OVERVIEW && (
                        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                                <p className="text-gray-400 leading-relaxed text-lg">{lesson.description}</p>
                            </div>
                            
                            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2d2d2d]">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {lesson.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-[#252525] text-rose-400 rounded-lg text-sm font-medium border border-[#333]">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === TabState.ASSIGNMENT && (
                        <div className="prose prose-invert max-w-3xl mx-auto animate-fade-in">
                            {loadingContent ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                                    <Loader2 className="animate-spin w-10 h-10 text-rose-500" /> 
                                    <p>Designing a coding challenge for you...</p>
                                </div>
                            ) : (
                                <ReactMarkdown>{assignment}</ReactMarkdown>
                            )}
                        </div>
                    )}

                    {activeTab === TabState.QUIZ && (
                         <div className="max-w-2xl mx-auto animate-fade-in">
                             {loadingContent ? (
                                 <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                                     <Loader2 className="animate-spin w-10 h-10 text-rose-500" /> 
                                     <p>Generating questions based on the lecture...</p>
                                 </div>
                             ) : quizSubmitted ? (
                                 <div className="text-center py-12 bg-[#161616] rounded-3xl border border-[#2d2d2d] shadow-2xl">
                                     {passed ? (
                                         <>
                                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                 <CheckCircle className="w-12 h-12 text-green-500" />
                                             </div>
                                             <h3 className="text-3xl font-bold text-white mb-2">Lesson Completed!</h3>
                                             <p className="text-gray-400 mb-8 text-lg">You scored {score}/{quiz?.questions.length}. Excellent work.</p>
                                             <button onClick={onBack} className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-900/20">
                                                 Return to Dashboard
                                             </button>
                                         </>
                                     ) : (
                                         <>
                                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <AlertTriangle className="w-12 h-12 text-red-500" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-2">Keep Trying</h3>
                                            <p className="text-gray-400 mb-8 text-lg">You scored {score}/{quiz?.questions.length}. 60% needed to pass.</p>
                                            <button 
                                                onClick={() => {
                                                    setQuizSubmitted(false);
                                                    setCurrentQuestionIndex(0);
                                                    setScore(0);
                                                }} 
                                                className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white px-10 py-4 rounded-xl font-bold transition-colors"
                                            >
                                                Retry Quiz
                                            </button>
                                         </>
                                     )}
                                 </div>
                             ) : quiz && (
                                 <div className="space-y-8 py-6">
                                     {/* Progress Bar in Quiz */}
                                     <div className="w-full h-2 bg-[#2d2d2d] rounded-full overflow-hidden">
                                         <div 
                                            className="h-full bg-gradient-to-r from-rose-600 to-purple-600 transition-all duration-500 ease-out" 
                                            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                                         />
                                     </div>

                                     <div className="flex justify-between items-center text-sm text-gray-400 uppercase tracking-wider font-semibold">
                                         <span>Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                                     </div>
                                     
                                     <h3 className="text-2xl font-bold text-white leading-relaxed">
                                         {quiz.questions[currentQuestionIndex].question}
                                     </h3>

                                     <div className="space-y-4">
                                         {quiz.questions[currentQuestionIndex].options.map((option, idx) => (
                                             <button
                                                 key={idx}
                                                 onClick={() => handleOptionSelect(idx)}
                                                 className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 flex items-center gap-4 group ${
                                                     selectedOption === idx 
                                                         ? 'bg-rose-600/10 border-rose-500 text-white shadow-lg shadow-rose-900/10' 
                                                         : 'bg-[#161616] border-[#2d2d2d] text-gray-300 hover:bg-[#222] hover:border-gray-600'
                                                 }`}
                                             >
                                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                     selectedOption === idx ? 'border-rose-500 bg-rose-500' : 'border-gray-600 group-hover:border-gray-400'
                                                 }`}>
                                                     {selectedOption === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                                 </div>
                                                 <span className="text-lg">{option}</span>
                                             </button>
                                         ))}
                                     </div>

                                     <div className="flex justify-end pt-6">
                                         <button
                                             disabled={selectedOption === null}
                                             onClick={handleNextQuestion}
                                             className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                                         >
                                             {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 
                                                <>Next Question <ChevronLeft size={16} className="rotate-180" /></>
                                             }
                                         </button>
                                     </div>
                                 </div>
                             )}
                         </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Chat (Always visible on desktop, sticky) */}
            <div className="w-[400px] hidden lg:block h-full border-l border-[#2d2d2d]">
                <ChatInterface lessonTitle={lesson.title} />
            </div>
        </div>
    </div>
  );
};