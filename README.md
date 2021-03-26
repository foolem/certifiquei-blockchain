## Certifiquei Etherum API

Simple REST API interaction with Certifiquei smart contract
Deployed on Vercel

### Usage

- Production URL https://verum-digital-etherum.vercel.app

- GET /get/:id
  Gets certificate by Certifiquei participant certificate id, sent on /set endpoint

- POST /set
  Creates a new certificate on blockchain.

### Requirements (vercel CLI)

`yarn global add vercel`\
`vercel login`

### Development

`cp .env.example .env`\
`vercel dev`

### Deployment

`vercel deploy`

Have fun
