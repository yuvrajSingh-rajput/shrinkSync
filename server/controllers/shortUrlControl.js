const express = require('express');
const urlModel = require('../models/shorturl'); 
const shortid = require('shortid');

const getResult = async (req, res) => {
    try {
        const result = await urlModel.find().sort({updatedAt: -1}).limit(10);
        return res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const urlShortFunction = async (req, res) => {
    const { originalUrl } = req.body;

    try {
        if (!originalUrl) {
            return res.status(400).json({ error: 'Please provide a URL' });
        }

        let existingUrl = await urlModel.findOne({ originalUrl });
        if (existingUrl) {
            existingUrl.updatedAt = new Date();
            await existingUrl.save();
            return res.status(200).json({ shortedUrl: existingUrl.shortedUrl });
        }

        const shortedUrl = shortid.generate();
        const savingData = new urlModel({
            originalUrl,
            shortedUrl
        });

        await savingData.save();
        return res.status(200).json({ shortedUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const clickShortUrl = async (req, res) => {
    try {
        console.log("Request params:", req.params);
        console.log("Request query:", req.query);
        console.log("Request URL:", req.url);
        console.log("Request method:", req.method);
        
        const { shortedUrl } = req.params;
        console.log("Shortened URL:", shortedUrl);

        if (!shortedUrl) {
            return res.status(400).json({ error: 'Please provide a valid shortened URL' });
        }

        const existingData = await urlModel.findOne({ shortedUrl: shortedUrl });
        if (!existingData) {
            return res.status(404).json({ error: 'Shortened URL not found' });
        }

        existingData.clickCount++;
        await existingData.save();

        return res.json({msg: "got it"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getResult,
    urlShortFunction,
    clickShortUrl
};