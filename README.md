# OptioBot

A Discord bot for the server "La guilde de Smoowy"

# Run the project on local

- You need a `.env` that respects the `.env.example`.
- You need to have **Node >18.x** and run `yarn install`
- Now you can run the project with `yarn start`

# Docker

To create the image of the bot you need to do this :

```bash

# The image is called optio-bot

docker build -t optio-bot .

```

Then, you have to create the container :

```bash

docker run --name optio-bot -d optio-bot

# If we want to add run options

docker run --name optio-bot --restart unless-stopped -d optio-bot

```
