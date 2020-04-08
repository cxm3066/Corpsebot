/*
* Discord Fish bot
* By Connor
*/

const Discord = require('discord.js');

const client = new Discord.Client();

const fish = require('./fish.json');
const prefix = '!';

var embed = new Discord.MessageEmbed()
	

client.on('ready', () => {
    console.log('I am ready!');
});

//Processor for all the messages
client.on('message', message => {
	if ((!message.content.startsWith(prefix) || message.author.bot) && message.channel.type != 'dm') return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

    if (command === 'fish') {
		if (args.length != 1) {
			buildFishEmbed(fish.fish[0]);
		} else {
			buildFishEmbed(fish.fish[Number(args[0])]);
		}
        message.channel.send(embed);
    }
});

function buildFishEmbed(fish) {
	embed = new Discord.MessageEmbed().setTitle('You caught a ' + fish.name + '!')
	.setDescription(fish.catch)
	.setImage(fish.image)
	.addFields(
		{ name: 'Value', value: fish.price + ' bells', inline: true },
		{ name: 'Size', value: fishSize(fish) + ' cm', inline: true },
		{ name: 'Rarity', value: fish.rarity, inline: true },
	)
	.setTimestamp();
}

function fishSize(fish) {
	return ((Math.random() * (fish.size[0] - fish.size[1]) + fish.size[1]).toFixed(1));
}

//DO NOT FORGET TO REMOVE LOGIN CODE BEFORE UPLOAD
client.login('na');