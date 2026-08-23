import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/data/relativity-content";

type QuizSectionProps = {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
};

export default function QuizSection({ questions, answers, onAnswer }: QuizSectionProps) {
  return (
    <div className="relativity-quizzes">
      {questions.map((question, index) => {
        const answer = answers[question.id];
        const correct = answer === question.answer;
        return (
          <article className="relativity-quiz" key={question.id}>
            <span className="quiz-index">0{index + 1}</span>
            <fieldset>
              <legend>{question.prompt}</legend>
              <div>
                {question.options.map((option) => (
                  <label className={answer === option.value ? (correct ? "correct" : "incorrect") : ""} key={option.value}>
                    <input type="radio" name={question.id} checked={answer === option.value} onChange={() => onAnswer(question.id, option.value)} />
                    <span>{option.label}</span>
                    {answer === option.value && (correct ? <Check size={18} /> : <X size={18} />)}
                  </label>
                ))}
              </div>
            </fieldset>
            {answer && (
              <p className={`quiz-feedback ${correct ? "correct" : "incorrect"}`}>
                <b>{correct ? "Model confirmed." : "Recalibrate."}</b> {question.explanation}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
