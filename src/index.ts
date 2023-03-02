import 'dotenv/config';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

(async () => {
  const gptResponse = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Suggest one name for a horse.',
    max_tokens: 60,
    temperature: 0.3,
    top_p: 0.3,
    presence_penalty: 0,
    frequency_penalty: 0.5,
  });

  const text = gptResponse.data.choices[0].text;

  console.log(text);

  console.log();
  console.log('========================================');
  console.log();

  const chatGptResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `I'd like to you act like a teacher's assistant. When I give you a question, I want to you tell me the correct answer and provide a good explanation.`,
      },
      {
        role: 'user',
        content: `Which of the following reasons were in favor of Migros' entry into Online Retail around 2008?

        Provided the opportunity to counter loss in sales in hypermarkets
        Lower profitability, and lower margins
        Distraction from core business offering
        Fragmented grocery market, and non-supportive cultural norms (Bakkals already meet customer need for speed and convenience)`,
      },
    ],
  });

  console.log(chatGptResponse.data.choices[0].message?.content);
})();
