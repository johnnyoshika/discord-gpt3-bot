import 'dotenv/config';
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from 'openai';
import fs from 'fs';
import { encoding_for_model } from '@dqbd/tiktoken';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

const instruction = fs.readFileSync('src/instruction.txt', 'utf8');
const question = fs.readFileSync('src/question.txt', 'utf8');

(async () => {
  try {
    let encoding = encoding_for_model('text-davinci-003');
    let tokens = encoding.encode(question);
    encoding.free();
    console.log('expected prompt tokens', tokens.length);

    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 60,
      temperature: 0.3,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });

    console.log(
      'actual prompt tokens',
      gptResponse.data.usage?.prompt_tokens,
    );

    const text = gptResponse.data.choices[0].text;

    console.log(text);

    console.log();
    console.log('========================================');
    console.log();

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: instruction,
      },
      {
        role: 'user',
        content: question,
      },
    ];

    encoding = encoding_for_model('gpt-4');
    tokens = encoding.encode(
      messages.map(m => `${m.role}: ${m.content}`).join('\n'),
    );
    console.log('expected prompt tokens (map)', tokens.length); // This estimates low
    tokens = encoding.encode(JSON.stringify(messages));
    console.log('expected prompt tokens (JSON)', tokens.length); // This estimates high (conservative and safe)
    encoding.free();

    const chatGptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      temperature: 1,
      top_p: 0.5,
      messages,
    });

    console.log(
      'actual prompt tokens',
      chatGptResponse.data.usage?.prompt_tokens,
    );

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
