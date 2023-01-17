import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//accessing and processing api key
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//initialize express application
const app = express();
//make cross origin request
app.use(cors());
//pass json from front-end to back-end
app.use(express.json());

//request function
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from ChatBot',
  });
});

//response data
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    //get response from openAI - get more example code from https://beta.openai.com/playground/p/default-openai-api?model=text-davinci-003

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`, //pass it from front-end text area
      temperature: 0, // tempature = risks of module
      max_tokens: 3000, // maximum tokens to genereta in completion
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // if you ask the same question it won't give you similar answer
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    //send the answer to the front end
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    //catch error and send it to the front end
    console.error(error);
    res.status(500).send(error || 'Something went wrong!');
  }
});

//make sure server always listen when request
app.listen(3002, () =>
  console.log('Server is running on port http://localhost:3002')
);
