export function validateQuestionText(text: string): string | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return "Текст вопроса не может быть пустым!";
  }

  if (trimmed.length < 10) {
    return "Текст вопроса слишком короткий (минимум 10 символов)!";
  }

  if (trimmed.length > 500) {
    return "Текст вопроса слишком длинный (максимум 500 символов)!";
  }

  return null;
}

export function validateOptions(options: string[]): string | null {
  if (options.length < 2) {
    return "Должно быть как минимум 2 варианта ответа!";
  }

  const trimmedOptions = options.map((o) => o.trim());

  for (let i = 0; i < trimmedOptions.length; i++) {
    if (!trimmedOptions[i]) {
      return `Вариант ответа №${i + 1} не может быть пустым!`;
    }

    if (trimmedOptions[i].length > 100) {
      return `Вариант ответа №${i + 1} слишком длинный (максимум 100 символов)!`;
    }
  }

  const uniqueOptions = new Set(trimmedOptions);

  if (uniqueOptions.size !== trimmedOptions.length) {
    return "Варианты ответов не должны повторяться!";
  }

  return null;
}
