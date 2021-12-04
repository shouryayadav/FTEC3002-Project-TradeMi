import * as AWS from 'aws-sdk';
import Responses from '../common/API_Responses';
import Axios from 'axios';

const lexruntime = new AWS.LexRuntime();

exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);
        console.log('body: ', body);
        const messageForLex = mapTelegramToLex(body);
        const lexResponse = await lexruntime.postText(messageForLex).promise();

        const messageForTelegram = mapLexToTelegram(lexResponse, body);
        await sendToTelegram(messageForTelegram);

        return Responses._200();
    } catch (error) {
        console.log('error in try catch', error);
        return Responses._400();
    }
};

const mapTelegramToLex = body => {
    const chatID = String(body.message.chat.id);
    const message = body.message.text;
    return {
        inputText: message,
        userId: chatID,
        botName: 'TradeMi',
        botAlias: 'dev',
        sessionAttributes: {},
    };
};

const mapLexToTelegram = (lexResponse, body) => {
    return {
        text: lexResponse.message,
        chat_id: body.message.chat.id,
    };
};

const sendToTelegram = message => {
    const token = '2113936643:AAF05Coh4PfElYYHOcuDXzA4QYD1yp4jYLs';
    const telegramURL = `https://api.telegram.org/bot${token}/sendMessage`;

    return Axios.post(telegramURL, message);
};