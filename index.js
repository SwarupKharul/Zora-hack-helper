const express = require('express')
// const bodyParser = require("body-parser");
// const router = express.Router();
var cors = require('cors')
const app = express()
const port = 3000

//Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(cors())

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/stream/:streamId', async (req, res) => {
    if (req.method === "GET") {
        const authorizationHeader = req.headers && req.headers["authorization"];
        const streamId = req.query.streamId;
        try {
            const streamStatusResponse = await axios.get(
                `https://livepeer.com/api/stream/${streamId}`,
                {
                    headers: {
                        "content-type": "application/json",
                        authorization: authorizationHeader, // API Key needs to be passed as a header
                    },
                }
            );

            if (streamStatusResponse && streamStatusResponse.data) {
                res.statusCode = 200;
                res.json({ ...streamStatusResponse.data });
            } else {
                res.statusCode = 500;
                res.json({ error: "Something went wrong" });
            }
        } catch (error) {
            res.statusCode = 500;
            res.json({ error });
        }
    }
})

app.post('/streams', async (req, res) => {
    if (req.method === "POST") {
        const authorizationHeader = req.headers && req.headers["authorization"];
        const streamName = req.body && req.body.name;
        const streamProfiles = req.body && req.body.profiles;

        try {
            const createStreamResponse = await axios.post(
                "https://livepeer.com/api/stream",
                {
                    name: streamName,
                    profiles: streamProfiles,
                },
                {
                    headers: {
                        "content-type": "application/json",
                        authorization: authorizationHeader, // API Key needs to be passed as a header
                    },
                }
            );

            if (createStreamResponse && createStreamResponse.data) {
                res.statusCode = 200;
                res.json({ ...createStreamResponse.data });
            } else {
                res.statusCode = 500;
                res.json({ error: "Something went wrong" });
            }
        } catch (error) {
            res.statusCode = 500;

            // Handles Invalid API key error
            if (error.response.status === 403) {
                res.statusCode = 403;
            }
            res.json({ error });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Success 2022')
})
