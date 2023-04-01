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
    temperature: 1,
    top_p: 0.5,
    messages: [
      {
        role: 'system',
        content: `You assist instructors in building exam questions. When I ask you a question, I don't want you to answer it. Instead, I want you to replace certain words or phrases in that question with meaningful variable names surrounded by square brackets so that those variables can later be substituted with different words.`,
      },
      {
        role: 'user',
        content: `Nick sues Tucker for a breach of trust. What is Nick's role and what is Tucker's role?`,
      },
      {
        role: 'assistant',
        content: `{{first name 1}} sues {{first name 2}} for a breach of trust. What is {{first name 1}}'s role and what is {{first name 2}}'s role?`,
      },
      {
        role: 'user',
        content: `On January 1, 2021, Stevie Company purchased equipment for $60,000 that has an estimated useful life of 6 years and a salvage value of $5,000. Stevie Company uses the double-declining balance method of depreciation. What is the net book value of the equipment at the end of 2021?`,
      },
      {
        role: 'assistant',
        content: `On {{month}} {{day}}, {{year}}, {{company}} purchased equipment for $\{{purchase price}} that has an estimated useful life of {{useful life}} years and a salvage value of $\{{salvage value}}. {{company}} uses the double-declining balance method of depreciation. What is the net book value of the equipment at the end of {{year}}?`,
      },
      // {
      //   role: 'user',
      //   content: `Galapagos Suppliers had beginning inventory of $10,000. It purchased $20,000 of inventory on January 5. What is Galapagos Suppliers total goods available for sale?`,
      // },
      // {
      //   role: 'assistant',
      //   content: `{{company}} had beginning inventory of $\{{beginning inventory}}. It purchased $\{{purchase amount}} of inventory on {{month}} {{day}}. What is Galapagos Suppliers total goods available for sale?`,
      // },
      {
        role: 'user',
        content: `On January 1, Brewer Beverages purchased equipment for $20,000. Brewer Beverages paid $4,000 in cash at the time of the sale and a 5-month note was issued for the remaining balance. Which of the following journal entries would Brewer make on January 1?`,
      },
    ],
  });

  console.log('tokens', chatGptResponse.data.usage?.total_tokens);

  console.log();

  console.log(chatGptResponse.data.choices[0].message?.content);
})();
