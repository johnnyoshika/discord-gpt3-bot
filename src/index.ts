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
})();
