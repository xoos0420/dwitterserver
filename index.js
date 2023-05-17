import express from "express";
import cors from "cors";
import morgan from "morgan";
import tweetsRouter from './router/tweets.js';
import authRouter from "./router/auth.js"
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";
// import {db} from './db/database.js'

const app = express();
const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan('tiny')); // 사용자가 들어오면 로그를 찍어줌

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
});

sequelize.sync().then(() => {
    console.log(`서버가 시작되었음: ${new Date()}`);
    const server =app.listen(config.host.port);
initSocket(server);
});