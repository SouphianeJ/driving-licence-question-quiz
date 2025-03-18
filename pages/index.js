import { useState, useEffect } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';

export default function Home() {
  const [question, setQuestion] = useState(null);

  const fetchRandomQuestion = async () => {
    const response = await fetch('/api/random-question');
    const data = await response.json();
    setQuestion(data);
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  return (
    <div className="container">
      <h1>Mini Application de Questions</h1>
      {question && <QuestionDisplay question={question} />}
      <button onClick={fetchRandomQuestion}>Nouvelle question</button>
    </div>
  );
}
