import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson, TabState, Quiz, ContentType } from '../types';
import { ChatInterface } from '../components/ChatInterface';
import { generateLessonQuiz, generateAssignment } from '../services/geminiService';
import { CheckCircle, PlayCircle, Code, BrainCircuit, ChevronLeft, Loader2, ExternalLink, AlertTriangle, MonitorPlay, HelpCircle, RefreshCw, Terminal, Clock, Award, FileCode, CheckSquare, Save, BookOpen } from 'lucide-react';

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
      setTimeout(() => setShowVideo(true), 100);
  };

  const isMediumLink = lesson.url.includes('medium.com');

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
                <div className={`w-full bg-black relative group bg-[#111] ${lesson.type === ContentType.VIDEO ? 'aspect-video' : 'h-[85vh] flex-shrink-0'}`}>
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
                            <div className="text-center p-8 max-w-lg bg-[#111] rounded-2xl border border-[#2d2d2d] shadow-2xl animate-fade-in z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Video Playback Issue</h3>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                    The embedded player encountered a configuration error. This usually happens due to browser privacy settings.
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
                        // BLOG / ARTICLE VIEW
                        <div className="w-full h-full relative bg-[#1a1a1a] flex flex-col">
                            {isMediumLink ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#161616] border-b border-[#2d2d2d]">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                         <BookOpen size={32} className="text-black" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Hosted on Medium</h3>
                                    <p className="text-gray-400 max-w-md mb-8 text-lg">
                                        This article is hosted on Medium, which prevents embedding in other applications.
                                    </p>
                                    <a 
                                        href={lesson.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg hover:scale-105 transform duration-200"
                                    >
                                        <ExternalLink size={18} /> Read Article on Medium
                                    </a>
                                </div>
                            ) : (
                                <iframe 
                                    src={lesson.url}
                                    className="w-full h-full block bg-white"
                                    title={lesson.title}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                />
                            )}
                            
                            {!isMediumLink && (
                                <div className="absolute top-4 right-6 z-20">
                                    <a 
                                        href={lesson.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="bg-black/80 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-black flex items-center gap-2 border border-white/10 backdrop-blur-md opacity-70 hover:opacity-100 transition-all"
                                    >
                                        <ExternalLink size={14} /> Open in New Tab
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manual Fallback Button for Video */}
                    {lesson.type === ContentType.VIDEO && !videoError && showVideo && (
                        <button 
                            onClick={() => setVideoError(true)}
                            className="absolute top-4 right-4 bg-black/60 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/80 backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30 border border-white/10"
                        >
                            <HelpCircle size={12} /> Player Error?
                        </button>
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
                        <Code size={16} /> Lab Assignment
                    </button>
                    <button 
                        onClick={() => loadTabContent(TabState.QUIZ)}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === TabState.QUIZ ? 'border-rose-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        <BrainCircuit size={16} /> Quiz
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 bg-[#0f0f0f]">
                    {activeTab === TabState.OVERVIEW && (
                        <div className="p-6 space-y-6 animate-fade-in max-w-3xl mx-auto">
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
                        <div className="flex flex-col h-full bg-[#0f0f0f] animate-fade-in">
                            {/* Lab Toolbar */}
                            <div className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-[#2d2d2d] sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-rose-400">
                                        <Terminal size={18} />
                                        <span className="font-bold tracking-wide text-sm">JUPYTER LAB</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-[#333]"></div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Save size={12} />
                                        <span>Autosaved</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="hidden md:block text-xs font-mono text-gray-500 mr-2 px-2 py-1 bg-black rounded border border-[#333]">Kernel: Python 3.10</div>
                                    <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5 flex items-center gap-2">
                                        <PlayCircle size={14} /> Run All
                                    </button>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                                        <CheckSquare size={14} /> Submit
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                                <div className="max-w-4xl mx-auto bg-[#161616] border border-[#2d2d2d] rounded-xl shadow-2xl overflow-hidden min-h-[500px]">
                                    {/* Assignment Header */}
                                    <div className="bg-[#1f1f1f] border-b border-[#2d2d2d] p-6 md:p-8 pb-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">Lab: {lesson.title}</h1>
                                            <div className="bg-green-900/20 text-green-400 border border-green-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                                Graded Assignment
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-gray-400 pt-2">
                                            <div className="flex items-center gap-2"><Clock size={16} className="text-rose-500"/> Est. Time: 45 min</div>
                                            <div className="flex items-center gap-2"><Award size={16} className="text-yellow-500"/> 100 Points</div>
                                            <div className="flex items-center gap-2"><FileCode size={16} className="text-blue-500"/> Python 3</div>
                                        </div>
                                    </div>
                                    
                                    {/* Content Body */}
                                    <div className="p-6 md:p-8 prose prose-invert prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-white prose-a:text-rose-400 prose-code:text-rose-300 prose-pre:bg-[#0f0f0f] prose-pre:border prose-pre:border-[#333] max-w-none">
                                        {loadingContent ? (
                                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                                <Loader2 className="animate-spin text-rose-500" size={32} />
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-300 font-medium">Provisioning Lab Environment...</span>
                                                    <span className="text-gray-600 text-sm">Loading PyTorch extensions</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    code({node, inline, className, children, ...props}: any) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <div className="my-6 rounded-lg overflow-hidden border border-[#333] shadow-lg">
                                                                <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
                                                                    <span className="text-xs font-mono text-gray-500 uppercase">{match[1]}</span>
                                                                    <div className="flex gap-1.5">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="relative group">
                                                                    <code className={`${className} block bg-[#0a0a0a] p-4 text-sm font-mono overflow-x-auto`} {...props}>
                                                                        {children}
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <code className="bg-[#2d2d2d] px-1.5 py-0.5 rounded text-rose-300 font-mono text-sm border border-white/5" {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold pb-2 border-b border-[#333] mt-8 mb-4" {...props} />,
                                                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-8 mb-4 text-white" {...props} />,
                                                    blockquote: ({node, ...props}) => (
                                                        <blockquote className="border-l-4 border-rose-500 bg-[#1f1f1f] p-4 rounded-r-lg italic text-gray-400 my-6 not-italic" {...props} />
                                                    ),
                                                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-4 text-gray-300" {...props} />,
                                                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                                }}
                                            >
                                                {assignment}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === TabState.QUIZ && (
                         <div className="p-6 max-w-2xl mx-auto animate-fade-in">
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