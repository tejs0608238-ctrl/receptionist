const chat = document.querySelector(".chat");
const form = document.querySelector(".composer");
const input = document.querySelector("#message");

const receptionistName = "Receptionist";
const userName = "You";

const botReplies = [
  {
    keywords: ["price", "cost", "tuition", "fee", "fees"],
    message:
      "Absolutely! Pricing depends on age group and how often someone attends each week. Most families find it very reasonable, and I can share a range once I know the age and preferred schedule.",
  },
  {
    keywords: ["schedule", "time", "availability", "weekend", "weekday"],
    message:
      "Let me check that for you… we have weekday options between 1 PM and 6 PM, plus weekend slots from 11 AM to 6 PM. Are you looking for weekdays or weekends?",
  },
  {
    keywords: ["kids", "child", "daughter", "son", "teen", "adult"],
    message:
      "Sure thing! We offer group classes for kids, teens, and adults, and we keep the levels beginner-friendly and energetic. What age group should I plan for?",
  },
  {
    keywords: ["enroll", "book", "register", "sign up"],
    message:
      "Perfect! I can get you locked in. Just let me know the age group, the class type you want, and your preferred day or time.",
  },
  {
    keywords: ["location", "address", "where"],
    message:
      "We’re located at 2023 Williams Pkwy #4 in Brampton, Ontario. It’s easy to find, and there’s parking nearby.",
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  chat.appendChild(createMessage(value, true));
  input.value = "";

  const reply = getReply(value);
  window.setTimeout(() => {
    chat.appendChild(createMessage(reply, false));
    chat.scrollTop = chat.scrollHeight;
  }, 350);
});
