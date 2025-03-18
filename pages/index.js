import { useState, useEffect } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomQuestion = async () => {
    setLoading(true);
    const response = await fetch('/api/random-question');
    setLoading(false);
    const data = await response.json();
    setQuestion(data);
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  return (
    <div className="container">
      <h1>Questions Permis</h1>
      {loading ? <p>Loading...</p> : question && <QuestionDisplay question={question} />}
      <button style={{ backgroundColor: '#492fc0'}} onClick={fetchRandomQuestion}>Nouvelle question</button>
    </div>
  );
}
