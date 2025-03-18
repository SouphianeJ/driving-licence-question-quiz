import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'content', 'questions.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(fileContents);
  console.log(questions);
  const randomIndex = Math.floor(Math.random() * questions.length);
  const randomQuestion = questions[randomIndex];

  res.status(200).json(randomQuestion);
}
