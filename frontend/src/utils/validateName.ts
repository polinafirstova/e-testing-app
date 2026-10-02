export function validateName(name: string): string | null {
  if (!name) {
    return "Заполните поле!";
  }

  if (name.length < 2) {
    return "Минимальная длина — 2 символа!";
  }

  if (name.length > 50) {
    return "Максимальная длина — 50 символов!";
  }

  const allowedCharsRegex = /^[а-яА-ЯёЁ\s-]+$/u;
  if (!allowedCharsRegex.test(name)) {
    return "Цифры, латиница и спецсимволы запрещены!";
  }

  if (/\s{2,}/.test(name)) {
    return "Удалите лишние пробелы между словами!";
  }

  if (/-{2,}/.test(name)) {
    return "Нельзя использовать несколько дефисов подряд!";
  }

  if (/\s-/.test(name)) {
    return "После пробела не должен идти дефис!";
  }

  if (/-\s/.test(name)) {
    return "После дефиса не должен идти пробел!";
  }

  return null;
}
