require('dotenv').config()

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/generate-fsm', async (req, res) => {
    const prompt = req.body.prompt;
    const structuredPrompt = `Create a finite state machine with the following specifications:
    ${prompt}
    Output the states, transitions, initial state, and final states in a structured format:
    {
      "states": ["state1", "state2", ...],
      "initial_state": "state1",
      "final_states": ["stateX"],
      "transitions": [
        {"from": "state1", "to": "state2", "input": "input1"},
        {"from": "state2", "to": "state3", "input": "input2"},
        ...
      ]
    }`;
    console.log(req.body.prompt)
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        messages: [{role: "user", content: structuredPrompt}]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const fsmResponse = response.data.choices[0].message.content;
      console.log(fsmResponse)
      const fsmData = JSON.parse(fsmResponse); // Ensure the response is JSON-parsable
      res.json(fsmData);
    } catch (error) {
      res.status(500).send('Error generating FSM');
    }
});

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });