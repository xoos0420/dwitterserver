import * as tweetRepository from '../data/tweet.js';
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res) {
    const username = req.query.username;
    const data = await (username
        ? tweetRepository.getAllByUsername(username)
        : tweetRepository.getAll());
    res.status(200).json(data);
};

export async function getTweet(req, res, next) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (tweet) {
        res.status(200).json(tweet);
    } else {
        res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
};

export async function CreateTweet(req, res, next) {
    const { text } = req.body;
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);
    getSocketIO().emit('tweet', tweet);
};

export async function UpdateTweet(req, res, next) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id);
    // update 와 delete 에 특정토큰만 접근가능하게 만들기
    if (!tweet) {
        res.status(404).json({ message: `tweet id(${id})not found` })
    }
    if (tweet.userId !== req.userId) {
        return res.sendStatus(403);
    }
    const updated = await tweetRepository.update(id, text);
    res.status(200).json(updated);
}

export async function deleteTweet(req, res, next) {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
        res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
    if (tweet.userId !== req.userId) {
        return res.sendStatus(403);
    }
    await tweetRepository.remove(id);
    res.sendStatus(204);
};