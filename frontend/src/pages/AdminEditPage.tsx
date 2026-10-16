import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import QuestionForm from "../components/QuestionForm";
import ConfirmModal from "../components/ui/ConfirmModal";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type {
  AdminQuestion,
  CreateQuestionData,
  EditQuestionData,
} from "../interfaces/Question";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestion,
} from "../services/questions";

export default function AdminEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const questionIdParam = searchParams.get("id");
  const isEditMode = questionIdParam !== null;
  const questionId = isEditMode ? parseInt(questionIdParam || "", 10) : null;

  const [initialQuestion, setInitialQuestion] = useState<AdminQuestion | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string>("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  useEffect(() => {
    if (!isEditMode || questionId === null || isNaN(questionId)) return;

    getQuestion(questionId)
      .then((data) => setInitialQuestion(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [questionId, isEditMode]);

  const handleSubmit = async (
    formData: CreateQuestionData | EditQuestionData,
  ) => {
    if ("id" in formData) {
      await editQuestion(formData as AdminQuestion);
    } else {
      await addQuestion(formData);
    }
    navigate("/admin/questions");
  };

  const handleDelete = async () => {
    if (questionId === null) return;
    try {
      setDeleteError("");
      await deleteQuestion(questionId);
      setIsDeleteModalOpen(false);
      navigate("/admin/questions");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка при удалении";
      setDeleteError(msg);
    }
  };

  if (error) {
    return <ErrorMessage />;
  }
  if (loading) {
    return <LoadingSpinner message="Загрузка данных вопроса..." />;
  }

  return (
    <div className="page-layout justify-start py-12">
      <div className="card-container max-w-2xl">
        <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Редактирование вопроса" : "Создание нового вопроса"}
          </h2>
        </div>
        <QuestionForm
          initialData={initialQuestion}
          onSubmit={handleSubmit}
          onCancel={() => setIsCancelModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
        />
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Отменить редактирование?"
        message="Вы уверены, что хотите покинуть эту страницу? Все внесенные изменения будут безвозвратно потеряны."
        confirmLabel="Выйти"
        onConfirm={() => {
          setIsCancelModalOpen(false);
          navigate("/admin/questions");
        }}
        onCancel={() => setIsCancelModalOpen(false)}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Удалить данный вопрос?"
        message="Вы уверены, что хотите удалить этот вопрос? Это действие необратимо."
        confirmLabel="Удалить"
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteError("");
        }}
      />
    </div>
  );
}
