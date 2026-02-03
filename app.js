const chat = document.querySelector(".chat");
const form = document.querySelector(".composer");
const input = document.querySelector("#message");
const micButton = document.querySelector(".composer__mic");
const supportNote = document.querySelector(".composer__support");

const receptionistName = "Receptionist";
const userName = "You";

const defaultSchedule = {
  weekdays: "1 PM to 6 PM",
  weekends: "11 AM to 6 PM",
};

const botReplies = [
  {
    keywords: ["price", "cost", "tuition", "fee", "fees"],
    message:
      "Absolutely! Pricing depends on the age group and how often someone attends each week. Most families find it very reasonable. Tell me the age and preferred schedule and I can share a range.",
  },
  {
    keywords: ["schedule", "time", "availability", "weekend", "weekday"],
    message:
      `Let me check that for you… we have weekday options between ${defaultSchedule.weekdays} and weekend slots from ${defaultSchedule.weekends}. Are you looking for weekdays or weekends?`,
  },
  {
    keywords: ["kids", "child", "daughter", "son", "teen", "adult"],
    message:
      "Sure thing! We offer group classes for kids, teens, and adults, and we keep everything beginner-friendly and energetic. What age group should I plan for?",
  },
  {
    keywords: ["enroll", "book", "register", "sign up"],
    message:
      "Perfect! I can get you locked in. Just let me know the age group, the class type, and your preferred day or time.",
  },
  {
    keywords: ["location", "address", "where"],
    message:
      "We’re located at 2023 Williams Pkwy #4 in Brampton, Ontario. It’s easy to find, and there’s parking nearby.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    message:
      "Sure thing! I’m happy to help. Are you looking for kids, teen, or adult classes today?",
  },
];

const fallbackMessage =
  "That’s a great question! I’ll have one of our team members follow up with you on that. Could I grab your name, phone number, and email?";

const createMessage = (content, isUser = false) => {
  const wrapper = document.createElement("div");
  wrapper.className = `chat__message ${
    isUser ? "chat__message--user" : "chat__message--bot"
  }`;

  const name = document.createElement("p");
  name.className = "chat__name";
  name.textContent = isUser ? userName : receptionistName;

  const bubble = document.createElement("div");
  bubble.className = "chat__bubble";
  const text = document.createElement("p");
  text.textContent = content;
  bubble.appendChild(text);

  const timestamp = document.createElement("p");
  timestamp.className = "chat__timestamp";
  timestamp.textContent = "Just now";

  wrapper.appendChild(name);
  wrapper.appendChild(bubble);
  wrapper.appendChild(timestamp);
  return wrapper;
};

const getReply = (message) => {
  const lower = message.toLowerCase();
  const match = botReplies.find((reply) =>
    reply.keywords.some((keyword) => lower.includes(keyword))
  );
  return match ? match.message : fallbackMessage;
};

const appendBotReply = (reply) => {
  const typing = createMessage("Let me check that for you…", false);
  typing.classList.add("chat__message--typing");
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  window.setTimeout(() => {
    typing.remove();
    chat.appendChild(createMessage(reply, false));
    chat.scrollTop = chat.scrollHeight;
  }, 450);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  chat.appendChild(createMessage(value, true));
  input.value = "";

  const reply = getReply(value);
  appendBotReply(reply);
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  micButton.disabled = true;
  micButton.setAttribute("aria-disabled", "true");
  supportNote.textContent = "Mic not supported in this browser.";
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const stopListening = () => {
    micButton.classList.remove("is-listening");
    micButton.setAttribute("aria-pressed", "false");
  };

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    form.requestSubmit();
  });

  recognition.addEventListener("end", stopListening);
  recognition.addEventListener("error", stopListening);

  micButton.addEventListener("click", () => {
    if (micButton.classList.contains("is-listening")) {
      recognition.stop();
      return;
    }
    micButton.classList.add("is-listening");
    micButton.setAttribute("aria-pressed", "true");
    recognition.start();
  });
}
