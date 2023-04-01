FROM node:18.15.0 as node-base
ENV NODE_ENV=production
WORKDIR /frontend
COPY ["./photo-game-front/package.json", "./photo-game-front/package-lock.json*", "./"]
RUN --mount=type=cache,target=/root/.npm npm install --production
COPY ./photo-game-front .
RUN npm run build


FROM python:3.10
WORKDIR /app
COPY ./requirements.txt ./requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip pip install --upgrade -r ./requirements.txt
COPY ./photo-game-backend .
COPY --from=node-base /frontend/build /app/website
ENV PHOTO_GAME_DOCKER=true
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
