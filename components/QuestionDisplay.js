import { useState, useEffect } from 'react';

export default function QuestionDisplay({ question }) {
  const [showVerification, setShowVerification] = useState(false);
  const [showSecurite, setShowSecurite] = useState(false);
  const [showPremierSecours, setShowPremierSecours] = useState(false);

  // Réinitialiser l'affichage des réponses lorsque la question change
  useEffect(() => {
    setShowVerification(false);
    setShowSecurite(false);
    setShowPremierSecours(false);
  }, [question]);

  return (
    <div className="question-display">
      <h2>Question {question.number}</h2>
      
      <div className="sub-question">
        <h3>Vérification</h3>
        <p>{question.verification.question}</p>
        <button onClick={() => setShowVerification(!showVerification)}>
          {showVerification ? 'Cacher' : 'Afficher'} la réponse
        </button>
        {showVerification && <p className="answer">{question.verification.answer}</p>}
      </div>

      <div className="sub-question">
        <h3>Sécurité</h3>
        <p>{question.securite.question}</p>
        <button onClick={() => setShowSecurite(!showSecurite)}>
          {showSecurite ? 'Cacher' : 'Afficher'} la réponse
        </button>
        {showSecurite && <p className="answer">{question.securite.answer}</p>}
      </div>

      <div className="sub-question">
        <h3>Premiers Secours</h3>
        <p>{question.premiers_secours.question}</p>
        <button onClick={() => setShowPremierSecours(!showPremierSecours)}>
          {showPremierSecours ? 'Cacher' : 'Afficher'} la réponse
        </button>
        {showPremierSecours && <p className="answer">{question.premiers_secours.answer}</p>}
      </div>
    </div>
  );
}
