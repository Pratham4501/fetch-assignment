Install the neccessary dependencies 
npm install express body-parser uuid

Ensure that you have Docker installed on your system

The Project structure is as follows:

fetch-rewards
├── example
│   ├── receipt1.json
│   ├── receipt2.json
│   └── ...
├── index.js
├── Dockerfile
└── README.md

Now build a docker image in the terminal using the following command:
docker build -t receipt-processor .

After the docker image has been built, run the following command to start the docker container:
docker run -p 8080:8080 receipt-processor

I was using VS code, so I created another create terminal, an Ubuntu Terminal (WSL), to test our POST and GET endpoints.

To test our POST method, which is calculating our id, use the following command:
curl -X POST http://localhost:8080/receipts/process -H "Content-Type: application/json" -d @example/receipt1.json

You will get an id for the json file in the below format
{"id": "7fb1377b-b223-49d9-a31a-5a02701dd310"}

After getting the id we can test our GET method now, which is calculating the points, using the following command:
curl http://localhost:8080/receipts/7fb1377b-b223-49d9-a31a-5a02701dd310/points

You will be presented with a response showing points as follows:
{"points": 32}
