import AnswerList from "@/features/project/components/AnswerList";
import { MessageCircleCheck } from "lucide-react";

interface PreviousAnswersSectionProps {
  projectId: string;
}

export const PreviousAnswersSection = ({
  projectId,
}: PreviousAnswersSectionProps) => {
  return (
    <div className="space-y-4 pt-12">
      <div className="flex items-center justify-start space-x-2">
        <MessageCircleCheck className="mt-1 size-6" />
        <h1 className="text-2xl font-semibold">Previous Answers</h1>
      </div>
      <AnswerList projectId={projectId} />
    </div>
  );
};
