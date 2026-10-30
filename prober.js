const BASE_URL = process.env.BASE_URL || "http://localhost:30500/api";
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || "10000", 10);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const CLEANUP_EVERY = parseInt(process.env.CLEANUP_EVERY || "10", 10);
const HIDDEN_PROBABILITY = parseFloat(process.env.HIDDEN_PROBABILITY || "0.7");

const createdQuestionIds = [];
let cycleCount = 0;

async function makeRequest(method, path, body = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const duration = Date.now() - start;
    console.log(
      `[Prober] ${method} ${path} → ${response.status} (${duration} ms)`,
    );
    return { status: response.status, duration, ok: response.ok, response };
  } catch (err) {
    const duration = Date.now() - start;
    console.log(
      `[Prober] ${method} ${path} → Error (${err.message}) (${duration} ms)`,
    );
    return { status: 0, duration, ok: false, response: null };
  }
}

async function login() {
  const isSuccess = Math.random() < 0.8;
  const password = isSuccess ? ADMIN_PASSWORD : "wrong-password";
  const url = `${BASE_URL}/auth/login`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const duration = Date.now() - start;
    console.log(
      `[Prober] POST /auth/login → ${res.status} (${duration} ms) [${isSuccess ? "success" : "failed"}]`,
    );
    if (res.ok) {
      const data = await res.json();
      return data.token;
    }
    return null;
  } catch (err) {
    console.log(`[Prober] POST /auth/login → Error (${err.message})`);
    return null;
  }
}

async function createQuestion(token) {
  const isHidden = Math.random() < HIDDEN_PROBABILITY;
  const result = await makeRequest(
    "POST",
    "/questions",
    {
      text: `Test question from prober ${Date.now()}`,
      isHidden,
      options: ["Option 1", "Option 2", "Option 3"],
      correctAnswerIndex: 0,
    },
    token,
  );
  if (result.ok && result.response) {
    try {
      const data = await result.response.json();
      if (data && data.questionId) {
        createdQuestionIds.push(data.questionId);
        console.log(
          `[Prober] Saved question id=${data.questionId} (isHidden=${isHidden}), total saved: ${createdQuestionIds.length}`,
        );
      }
    } catch (e) {
      console.log(
        `[Prober] Failed to parse created question response: ${e.message}`,
      );
    }
  }
}

async function cleanupQuestions(token) {
  if (createdQuestionIds.length === 0) {
    return;
  }
  console.log(
    `[Prober] Cleanup: deleting ${createdQuestionIds.length} questions...`,
  );
  while (createdQuestionIds.length > 0) {
    const id = createdQuestionIds.pop();
    const res = await makeRequest("DELETE", `/questions/${id}`, null, token);
    if (!res.ok) {
      console.log(
        `[Prober] Cleanup: failed to delete id=${id}, status=${res.status}`,
      );
    }
  }
  console.log(
    `[Prober] Cleanup done. Remaining in buffer: ${createdQuestionIds.length}`,
  );
}

async function cycle() {
  cycleCount++;
  console.log(
    `\n[Prober] === New cycle #${cycleCount} ${new Date().toISOString()} ===`,
  );

  for (let i = 0; i < 5; i++) {
    await makeRequest("GET", "/questions");
  }

  const token = await login();

  if (token) {
    await createQuestion(token);
  }

  const questionsRes = await fetch(`${BASE_URL}/questions`);
  if (questionsRes.ok) {
    const questions = await questionsRes.json();
    if (questions.length > 0) {
      const answers = questions.map((q) => ({
        questionId: q.id,
        optionId: q.options[0]?.id || 0,
      }));
      await makeRequest("POST", "/results", {
        username: `prober-${Date.now()}`,
        answers,
      });
    }
  }

  if (token && cycleCount % CLEANUP_EVERY === 0) {
    await cleanupQuestions(token);
  }
}

async function main() {
  console.log(`[Prober] Run. BASE_URL=${BASE_URL}, interval=${INTERVAL_MS} ms`);
  while (true) {
    await cycle();
    console.log(`[Prober] Pause ${INTERVAL_MS} ms...`);
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
  }
}

main();
