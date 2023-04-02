FROM node:18.15.0 as node-base
ENV NODE_ENV=production
WORKDIR /frontend
COPY ["./photo-game-front/package.json", "./photo-game-front/package-lock.json*", "./"]
RUN --mount=type=cache,target=/root/.npm npm install --production
ENV REACT_APP_API_URL=
COPY ./photo-game-front .
RUN npm run build

FROM python:3.10
WORKDIR /app
COPY ./requirements.txt ./requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip pip install --upgrade -r ./requirements.txt
RUN --mount=type=cache,target=/models python -c "from min_dalle import MinDalle;import torch;MinDalle(models_root='/models',dtype=torch.float16,device='cpu',is_mega=False,is_reusable=True)" && \
	cp -r /models /app/pretrained && mkdir -p images
COPY ./run.sh .
COPY ./photo-game-backend .
COPY --from=node-base /frontend/build /app/website
ENV PHOTO_GAME_DOCKER=true
ENV OPENAI_API_KEY=""
EXPOSE 80
CMD /app/run.sh
