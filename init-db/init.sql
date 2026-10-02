CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    correct_answer INTEGER,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

ALTER TABLE questions 
ADD CONSTRAINT fk_correct_answer 
FOREIGN KEY (correct_answer) REFERENCES options(id) ON DELETE SET NULL;

CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES test_results(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE SET NULL,
    selected_option_id INTEGER REFERENCES options(id) ON DELETE SET NULL
);

INSERT INTO questions (text) VALUES ('Какое животное считается самым крупным на планете Земля?');
INSERT INTO options (question_id, text) VALUES 
(1, 'Африканский слон'),
(1, 'Синий кит'),
(1, 'Жираф');
UPDATE questions SET correct_answer = 2 WHERE id = 1;

INSERT INTO questions (text) VALUES ('Какая планета Солнечной системы находится ближе всего к Солнцу?');
INSERT INTO options (question_id, text) VALUES 
(2, 'Венера'),
(2, 'Марс'),
(2, 'Меркурий');
UPDATE questions SET correct_answer = 6 WHERE id = 2;

INSERT INTO questions (text) VALUES ('Сколько лучей у обычной классической снежинки?');
INSERT INTO options (question_id, text) VALUES 
(3, 'Четыре'),
(3, 'Шесть'),
(3, 'Восемь');
UPDATE questions SET correct_answer = 8 WHERE id = 3;

INSERT INTO questions (text) VALUES ('Какой цвет получится, если смешать синюю и желтую краску?');
INSERT INTO options (question_id, text) VALUES 
(4, 'Зеленый'),
(4, 'Фиолетовый'),
(4, 'Оранжевый');
UPDATE questions SET correct_answer = 10 WHERE id = 4;

INSERT INTO questions (text) VALUES ('Какое свойство воды позволяет водомеркам бегать по её поверхности?');
INSERT INTO options (question_id, text) VALUES
(5, 'Вязкость'),
(5, 'Поверхностное натяжение'),
(5, 'Плотность');
UPDATE questions SET correct_answer = 14 WHERE id = 5;
