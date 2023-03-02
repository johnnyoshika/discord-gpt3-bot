import 'dotenv/config';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

const instruction = fs.readFileSync('src/instruction.txt', 'utf8');
const question = fs.readFileSync('src/question.txt', 'utf8');

(async () => {
  const chatGptResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: instruction,
      },
      {
        role: 'user',
        content: question,
      },
    ],
  });

  console.log(chatGptResponse.data.choices[0].message?.content);
})();
