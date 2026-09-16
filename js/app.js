const MODELS = {
  gpt: { name: "ChatGPT", hint: "универсальный текст" },
  grok: { name: "Grok", hint: "прямой стиль" },
  gemini: { name: "Gemini", hint: "поиск и файлы" }
};

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor("#07020c");
  tg.setBackgroundColor("#07020c");
  const user = tg.initDataUnsafe?.user;
  if (user?.first_name) document.getElementById("user-hello").textContent = user.first_name;
}

const messages = document.getElementById("messages");
const title = document.getElementById("chat-title");
const sub = document.getElementById("chat-sub");
let current = null;

function add(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

document.querySelectorAll(".model").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    current = MODELS[id];
    document.querySelectorAll(".model").forEach((b) => b.classList.toggle("is-on", b === btn));
    title.textContent = current.name;
    sub.textContent = current.hint;
    add(`${current.name} выбран. Это витрина Mini App — живой API подключается на backend.`, "bot");
    document.getElementById("chat").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("prompt");
  const text = input.value.trim();
  if (!text) return;
  add(text, "me");
  input.value = "";
  const name = current?.name || "pixAI";
  setTimeout(() => add(`${name}: ответ на «${text}». Для живой генерации нужен ключ OpenRouter / официальный API.`, "bot"), 400);
});

const layers = document.querySelectorAll("[data-depth]");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  layers.forEach((el) => {
    const d = Number(el.dataset.depth);
    el.style.transform = `translate3d(0, ${y * d}px, 0)`;
  });
}, { passive: true });

add("Привет. В pixAI сейчас три сети: ChatGPT, Grok и Gemini.");
