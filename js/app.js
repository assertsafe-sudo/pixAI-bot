const MODELS = [
  { id: "gpt", name: "GPT-5", cat: "text", color: "#10a37f", hint: "универсальный текст" },
  { id: "claude", name: "Claude 4", cat: "text", color: "#d97706", hint: "длинный контекст" },
  { id: "gemini", name: "Gemini", cat: "text", color: "#4285f4", hint: "поиск и файлы" },
  { id: "grok", name: "Grok 4", cat: "text", color: "#111111", hint: "прямой стиль" },
  { id: "deepseek", name: "DeepSeek", cat: "code", color: "#4f46e5", hint: "код и логика" },
  { id: "qwen", name: "Qwen", cat: "code", color: "#0ea5e9", hint: "код / RU-CN" },
  { id: "mistral", name: "Mistral", cat: "text", color: "#f97316", hint: "быстрые ответы" },
  { id: "llama", name: "Llama 4", cat: "text", color: "#6366f1", hint: "open-weight" },
  { id: "perplexity", name: "Perplexity", cat: "text", color: "#22c55e", hint: "ответы с источниками" },
  { id: "flux", name: "Flux", cat: "image", color: "#ec4899", hint: "фотореализм" },
  { id: "ideogram", name: "Ideogram", cat: "image", color: "#a855f7", hint: "текст на картинке" },
  { id: "dalle", name: "DALL·E 3", cat: "image", color: "#14b8a6", hint: "иллюстрации" },
  { id: "midjourney", name: "Midjourney", cat: "image", color: "#1d4ed8", hint: "арт / стили" },
  { id: "recraft", name: "Recraft", cat: "image", color: "#ef4444", hint: "дизайн и иконки" },
  { id: "kling", name: "Kling", cat: "video", color: "#111827", hint: "видео из текста" },
  { id: "veo", name: "Veo", cat: "video", color: "#2563eb", hint: "кинематограф" },
  { id: "runway", name: "Runway", cat: "video", color: "#0f172a", hint: "монтаж / gen" },
  { id: "sora", name: "Sora", cat: "video", color: "#111", hint: "длинные ролики" },
  { id: "luma", name: "Luma", cat: "video", color: "#64748b", hint: "быстрые клипы" },
  { id: "suno", name: "Suno", cat: "music", color: "#f43f5e", hint: "песня с вокалом" },
  { id: "udio", name: "Udio", cat: "music", color: "#8b5cf6", hint: "треки и стемы" },
  { id: "stable", name: "Stable Audio", cat: "music", color: "#334155", hint: "саунд и fx" }
];

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("#07080c");
  tg.setBackgroundColor("#07080c");
  const user = tg.initDataUnsafe?.user;
  if (user?.first_name) {
    document.getElementById("user-hello").textContent = user.first_name;
  }
}

const list = document.getElementById("model-list");
const messages = document.getElementById("messages");
const title = document.getElementById("chat-title");
const sub = document.getElementById("chat-sub");
let current = MODELS[0];
let filter = "all";

function initials(name) {
  return name.replace("·", " ").split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function renderModels() {
  list.innerHTML = "";
  MODELS.forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "model-card";
    btn.dataset.cat = m.cat;
    btn.innerHTML = `
      <div class="avatar" style="background:${m.color}">${initials(m.name)}</div>
      <div>
        <b>${m.name}</b>
        <small>${m.hint}</small>
      </div>
      <span class="tag">${m.cat}</span>
    `;
    btn.addEventListener("click", () => selectModel(m, true));
    list.appendChild(btn);
  });
  applyFilter(filter);
}

function applyFilter(next) {
  filter = next;
  document.querySelectorAll("#pills .pill").forEach((p) => {
    p.classList.toggle("is-on", p.dataset.filter === next);
  });
  document.querySelectorAll(".model-card").forEach((card) => {
    card.classList.toggle("is-hidden", next !== "all" && card.dataset.cat !== next);
  });
}

function selectModel(model, jump) {
  current = model;
  title.textContent = model.name;
  sub.textContent = model.hint;
  addBot(`Модель ${model.name} выбрана. Это витрина Mini App: ответы демо. Ключи API подключаются на backend.`);
  if (jump) go("chat");
}

function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addBot(text) {
  addBubble(text, "bot");
}

function demoReply(prompt) {
  const samples = {
    text: `Ответ от ${current.name}:\n«${prompt}» — развернул бы структуру, факты и следующий шаг. Для живого ответа нужен OpenRouter / прямой API.`,
    code: `// ${current.name} demo\nfunction handle(prompt) {\n  return "подключите backend";\n}\n// запрос: ${prompt}`,
    image: `${current.name} сгенерировал бы изображение по запросу «${prompt}». В проде это очередь + файл в S3.`,
    video: `${current.name}: клип по «${prompt}» ставится в очередь на 15–60 сек.`,
    music: `${current.name} собрал бы трек по «${prompt}»: куплет / припев / бит.`
  };
  return samples[current.cat] || samples.text;
}

function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.go === id));
}

document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => go(el.dataset.go));
});

document.getElementById("pills").addEventListener("click", (e) => {
  const pill = e.target.closest("[data-filter]");
  if (pill) applyFilter(pill.dataset.filter);
});

document.querySelector(".menu-grid").addEventListener("click", (e) => {
  const card = e.target.closest("[data-filter],[data-go]");
  if (!card) return;
  if (card.dataset.go) return go(card.dataset.go);
  applyFilter(card.dataset.filter);
  go("models");
});

document.getElementById("composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("prompt");
  const text = input.value.trim();
  if (!text) return;
  addBubble(text, "me");
  input.value = "";
  setTimeout(() => addBot(demoReply(text)), 450);
});

document.getElementById("clear-chat").addEventListener("click", () => {
  messages.innerHTML = "";
  addBot("История очищена.");
});

const scroller = document.getElementById("scroller");
scroller.addEventListener("scroll", () => {
  const sections = ["home", "models", "chat", "studio"];
  let active = "home";
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 220) active = id;
  });
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.go === active));
});

renderModels();
addBot("Привет. Это NeuroHub Mini App. Выберите сеть в каталоге или напишите запрос.");
