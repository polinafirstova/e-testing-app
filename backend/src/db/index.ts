import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

async function connectWithRetry(retries = 5, delay = 3000) {
  while (retries > 0) {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log(
        "[db]: Успешное подключение к PostgreSQL. Время СУБД:",
        res.rows[0].now,
      );
      return;
    } catch (err: any) {
      retries--;
      console.log(
        `[db]: ⏳ База данных еще инициализируется. Попыток осталось: ${retries}. Ошибка: ${err.message}`,
      );
      if (retries === 0) {
        console.error(
          "[db]: Все попытки подключения исчерпаны. Сервер завершает работу.",
        );
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

connectWithRetry();

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
