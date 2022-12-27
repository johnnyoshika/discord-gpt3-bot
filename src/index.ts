import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

let prompt = `Marv is a chatbot that reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
You: What is the meaning of life?\n\
Marv: I'm not sure. I'll ask my friend Google.\n\
You: hey whats up?\n\
Marv: Nothing much. You?\n`;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Append to prompt to keep the conversation going
  prompt += `You: ${message.content}\n`;

  const gptResponse = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt,
    max_tokens: 60,
    temperature: 0.3,
    top_p: 0.3,
    presence_penalty: 0,
    frequency_penalty: 0.5,
  });

  await message.reply(
    // Use substring to remove 'Marv: '
    gptResponse.data.choices[0].text?.substring(6) ?? '',
  );

  // Append to prompt to keep the conversation going
  prompt += `${gptResponse.data.choices[0].text}\n`;
});
client.login(process.env.DISCORD_BOT_TOKEN);
