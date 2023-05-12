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
  try {
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
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
      model: 'gpt-4',
      temperature: 1,
      top_p: 0.5,
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

    console.log('tokens', chatGptResponse.data.usage?.total_tokens);

    console.log();

    console.log(chatGptResponse.data.choices[0].message?.content);

    console.log();
    console.log('========================================');
    console.log();

    const image = await openai.createImage({
      prompt: 'a white siamese ca',
      n: 1,
      size: '512x512',
    });

    console.log('image', image.data.data[0].url);
  } catch (error) {
    console.error(error);
  }
})();
