const express = require("express");
const app = express();
const port = 3000;

// // Original code
// import { HfInference } from "@huggingface/inference";

// New way
const { HfInference } = require("@huggingface/inference");

const client = new HfInference("HUGGING_FACE_API_KEY_GOES_HERE");

async function chat() {
  let out = "";

  const stream = client.chatCompletionStream({
    model: "google/gemma-2-2b-it",
    messages: [
      {
        role: "user",
        content: "What is the capital of France?",
      },
    ],
    provider: "hf-inference",
    max_tokens: 500,
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
      console.log(newContent);
    }
  }
  return out;
}

app.get("/chat", async (req, res) => {
  const response = await chat();
  res.send(response);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
