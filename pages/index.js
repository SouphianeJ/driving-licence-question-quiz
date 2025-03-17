import { useState, useEffect } from 'react';

export default function QuestionApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswers, setShowAnswers] = useState({
    verification: false,
    securite: false,
    premiers_secours: false,
  });

  useEffect(() => {
    fetch('/content/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        selectNewQuestion(data);
      });
  }, []);

  const selectNewQuestion = (questionList = questions) => {
    const randomIndex = Math.floor(Math.random() * questionList.length);
    setCurrentQuestion(questionList[randomIndex]);
    setShowAnswers({
      verification: false,
      securite: false,
      premiers_secours: false,
    });
  };

  const toggleAnswer = (section) => {
    setShowAnswers(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!currentQuestion) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Question #{currentQuestion.number}</h1>
      
      <button className="new-question" onClick={() => selectNewQuestion()}>
        🎲 Nouvelle question
      </button>

      <div className="question-section">
        <h2>Vérification ({currentQuestion.verification.position})</h2>
        <p>{currentQuestion.verification.question}</p>
        <button onClick={() => toggleAnswer('verification')}>
          {showAnswers.verification ? 'Masquer' : 'Afficher'} la réponse
        </button>
        {showAnswers.verification && <p className="answer">{currentQuestion.verification.answer}</p>}
      </div>

      <div className="question-section">
        <h2>Sécurité</h2>
        <p>{currentQuestion.securite.question}</p>
        <button onClick={() => toggleAnswer('securite')}>
          {showAnswers.securite ? 'Masquer' : 'Afficher'} la réponse
        </button>
        {showAnswers.securite && <p className="answer">{currentQuestion.securite.answer}</p>}
      </div>

      <div className="question-section">
        <h2>Premiers Secours</h2>
        <p>{currentQuestion.premiers_secours.question}</p>
        <button onClick={() => toggleAnswer('premiers_secours')}>
          {showAnswers.premiers_secours ? 'Masquer' : 'Afficher'} la réponse
        </button>
        {showAnswers.premiers_secours && <p className="answer">{currentQuestion.premiers_secours.answer}</p>}
      </div>
    </div>
  );
}