import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminQuestionCard from "../components/AdminQuestionCard";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { AdminQuestion } from "../interfaces/Question";
import { deleteQuestion, loadQuestionsForTest } from "../services/questions";

function AdminQuestionPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState<number | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string>("");

  useEffect(() => {
    loadQuestionsForTest(true)
      .then((data) => setQuestions(data as AdminQuestion[]))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleOpenDeleteModal(id: number) {
    setQuestionIdToDelete(id);
    setDeleteError("");
    setIsModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (questionIdToDelete === null) {
      return;
    }

    try {
      await deleteQuestion(questionIdToDelete);

      setQuestions((prev) => prev.filter((q) => q.id !== questionIdToDelete));

      setIsModalOpen(false);
      setQuestionIdToDelete(null);
    } catch (error: unknown) {
      const displayMessage =
        error instanceof Error
          ? error.message
          : "Произошла непредвиденная ошибка при удалении.";
      setDeleteError(displayMessage);
    }
  }

  if (error) {
    return <ErrorMessage />;
  }
  if (loading) {
    return <LoadingSpinner message="Загрузка банка вопросов..." />;
  }

  return (
    <div className="page-layout justify-start py-12">
      <div className="card-container max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
          <h2 className="text-2xl font-bold text-gray-900">Банк вопросов</h2>
          <div className="flex gap-3 self-start sm:self-auto">
            <Button variant="primary" onClick={() => navigate("/admin/edit")}>
              Добавить вопрос
            </Button>
            <Button variant="secondary" onClick={() => navigate("/admin")}>
              ← Назад в меню
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-2">
          <h3 className="text-base font-bold text-gray-800">
            Всего вопросов в базе: {questions.length}
          </h3>
          <div className="flex flex-col gap-4">
            {questions.map((question, idx) => (
              <AdminQuestionCard
                key={question.id}
                question={question}
                idx={idx}
                onDeleteClick={handleOpenDeleteModal}
              />
            ))}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Удалить вопрос?"
        message="Вы уверены, что хотите удалить этот вопрос из базы данных? Это действие нельзя отменить."
        confirmLabel="Удалить"
        onConfirm={handleConfirmDelete}
        error={deleteError}
        onCancel={() => {
          setIsModalOpen(false);
          setQuestionIdToDelete(null);
        }}
      />
    </div>
  );
}

export default AdminQuestionPage;
