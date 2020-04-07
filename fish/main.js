/*
* Discord Fish bot
* By Connor
*/

const Discord = require('discord.js');

const client = new Discord.Client();

//const fish = require('./fish.json');
var fs = require('fs');

const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

client.on('ready', () => {
    console.log('I am ready!');
    console.log(JSON.parse(fs.readFileSync('fish/fish.json', 'utf8')).length);
});

//Processor for all the messages
client.on('message', message => {

    if (message.content === '!test' && message.channel.type != 'dm') {
        message.channel.send(fish[0].name);
    }
});

//DO NOT FORGET TO REMOVE LOGIN CODE BEFORE UPLOAD
client.login('MzgwNTA5NDcwMTgwMjQ1NTA1.Xoy7ug.rcipWu4aolBz_SPIXjqrsOa8wkQ');