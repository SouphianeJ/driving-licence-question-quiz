import { useState } from 'react';
import path from 'path';
import fs from 'fs';

export async function getStaticProps() {
  const questionsPath = path.join(process.cwd(), 'public/content/questions.json');
  const questionsData = fs.readFileSync(questionsPath, 'utf-8');
  const questions = JSON.parse(questionsData);

  return {
    props: {
      questions
    },
    revalidate: 3600 // ISR pour mise à jour périodique
  };
}

export default function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswers, setShowAnswers] = useState({
    verification: false,
    securite: false,
    premiers_secours: false,
  });

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
    setShowAnswers({
      verification: false,
      securite: false,
      premiers_secours: false,
    });
  };

  // Initialisation au premier rendu
  useState(() => {
    getRandomQuestion();
  }, []);

  if (!currentQuestion) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Question #{currentQuestion.number}</h1>
      
      <button onClick={getRandomQuestion} className="new-question">
        Nouvelle question 🎲
      </button>

      <QuestionSection
        title={`Vérification (${currentQuestion.verification.position})`}
        question={currentQuestion.verification.question}
        answer={currentQuestion.verification.answer}
        isShowing={showAnswers.verification}
        toggle={() => setShowAnswers(s => ({ ...s, verification: !s.verification }))}
      />

      <QuestionSection
        title="Sécurité"
        question={currentQuestion.securite.question}
        answer={currentQuestion.securite.answer}
        isShowing={showAnswers.securite}
        toggle={() => setShowAnswers(s => ({ ...s, securite: !s.securite }))}
      />

      <QuestionSection
        title="Premiers Secours"
        question={currentQuestion.premiers_secours.question}
        answer={currentQuestion.premiers_secours.answer}
        isShowing={showAnswers.premiers_secours}
        toggle={() => setShowAnswers(s => ({ ...s, premiers_secours: !s.premiers_secours }))}
      />
    </div>
  );
}

function QuestionSection({ title, question, answer, isShowing, toggle }) {
  return (
    <div className="question-section">
      <h2>{title}</h2>
      <p>{question}</p>
      <button onClick={toggle} className="answer-toggle">
        {isShowing ? 'Masquer la réponse' : 'Afficher la réponse'}
      </button>
      {isShowing && <p className="answer">{answer}</p>}
    </div>
  );
}