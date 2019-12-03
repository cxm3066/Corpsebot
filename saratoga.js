
/*
* Discord Corpse bot
* By Connor
*
* To fix:
* 1. Skipping as being read after submissions (Write a recursive fucntion to handle skips)
* 2. Fix reused code for the submission and skip commands
*/

const Discord = require('discord.js');

const client = new Discord.Client();

//Initialising variables
var voteMessage;
var corpselist = new Array();
var imagelist = new Array();
var order = 0;

client.on('ready', () => {
    console.log('I am ready!');
});

//Processor for all the messages
client.on('message', message => {

    /* Makelist Command
    *
    * Creates a list, noting the message used and reinitalising variables
    */
    if (message.content === '!makelist' && message.channel.type != 'dm') {
        message.channel.send('```Okay, I will make a list!\nNow whoever wants to participate, please react to the command (THE ONE THAT CALLED ME, NOT THIS MESSAGE)\nOnce eeryone is ready simply use the command \'!finishlist\'\nUsing the make list command will reset the game should there be any issues.```');
        console.log("List made!");
        voteMessage = message;
        corpselist = new Array();
        imagelist = new Array();
        order = 0;
    }

    /* Finishlist Command
    *
    * Checks the length of the list to make sure it has been properly reinitlised
    * After it takes the IDs of each reacting channel member and adds the ID to an array
    */
    else if (message.content === '!finishlist' && message.channel.type != 'dm') {
        if (corpselist.length !== 0) {
            message.channel.send("```Erm, it seems that you haven't yet used \'!makelist\'. I still have players from the last game in my database.```");
        } else {
            message.channel.send('```Okay, now the list of players is set!\nRecall the make list command if you aren\'t happy with the results\nIf everything is working correctly, simply type \'!startcorpse\' to begin and i\'ll handle the rest!```');
            console.log("List finalized");
            message.channel.fetchMessage(voteMessage.id).then(message => {
                for (i = 0; i < message.reactions.keyArray().length; i++) {
                    message.reactions.get(message.reactions.keyArray()[i]).fetchUsers().then(users => {
                        for (j = 0; j < users.keyArray().length; j++) {
                            corpselist.push(users.get(users.keyArray()[j]).id);
                        }
                    });
                }
            });
        }
    }
    
    /* Startcorpse command 
    *
    * Makes sure that there are members in the corpselist before proceeding
    * Shuffles the list of corpse members and begins the game
    */
    else if (message.content === '!startcorpse' && message.channel.type != 'dm') {
        if (corpselist.length === 0) {
            message.channel.send("```Erm, this is awkward, looks like you haven't called the commands in the correct order. There are no players in my database.\nHave you made sure to call \'!makelist\' and \'!finishlist\'?```");
        } else {
            console.log("Corpse starting!");
            corpselist = shuffle(corpselist);
            message.channel.send('```The game has begun, good luck everyone!```');
            message.channel.send(getCheck());
        }
    }

    /* Check Command
    *
    * Displays the order of players and their turns
    */
    else if (message.content === '!check' && message.channel.type != 'dm') {
        if (corpselist.length === 0) {
            message.channel.send("```There is no game currently in session!```");
        } else {
            message.channel.send(getCheck());
        }
    }

    /* Submission command
    *
    * This first checks that the channel is a private message and then that there is a defined attachement with a defined width (to confirm that it is an image)
    * 
    * The player is then compared with the turn order to confirm that it is their turn
    * If so, the corpse order advances and the url of the submission is pushed to the end of the imagelist array
    * A check command is then sent to the channel in which the makelist channel was called
    * 
    * There is then a check to see if the value of order is equal to the length of the the corpselist
    * If so, the the corpse ends and all the images along with their authors are posted in the makelist channel
    * The corpselist is also reset to help avoid issues with a new corpse
    * 
    * If the corpse is not finished, a direct message channel is opened up with the next player
    * The previous image will be sent
    * If the player has passed, the image before will be sent
    */
    else if (message.channel.type === 'dm' && typeof message.attachments.first() !== "undefined" && typeof message.attachments.first().width !== "undefined") {
        if (client.guilds.get(voteMessage.guild.id).members.get(corpselist[order]).user.id !== message.channel.recipient.id) {
            message.channel.send("Sorry, it's not your turn!");
        } else {
            //Issue to be fixed #2
            message.channel.send("Thank you for your submission!");
            order++;
            imagelist.push(message.attachments.first().url);
            client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send(getCheck());
            if (order === corpselist.length) {
                client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send("Its done!");
                for (i = 0; i < imagelist.length; i++) {
                    client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send(
                        client.guilds.get(voteMessage.guild.id).members.get(corpselist[i]).user.username + " " + imagelist[i]);
                }
                corpselist = new Array();
            } else {
                client.guilds.get(voteMessage.guild.id).members.get(corpselist[order]).user.createDM().then(channel => {
                    channel.send("Yer up!")
                    //Issue to be fixed #1
                    if (imagelist[imagelist.length-1] === "NA") {
                        channel.send(imagelist[imagelist.length-2]);
                    } else {
                        channel.send(imagelist[imagelist.length-1]);
                    }
                });
            }
        }
    }

    /* Skip Command
    * 
    * Functions very similar to the submission code without pushing an image URL
    * Placeholder 'NA' is used to signify a skipped submission
    */
    else if (message.content === '!skip' && message.channel.type === 'dm') {
        if (client.guilds.get(voteMessage.guild.id).members.get(corpselist[order]).user.id !== message.channel.recipient.id) {
            message.channel.send("Sorry, it's not your turn!");
        } else {
            //Issue to be fixed #2
            message.channel.send("https://i.imgur.com/gb3wIlH.png");
            order++;
            imagelist.push("NA");
            client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send(getCheck());
            if (order === corpselist.length) {
                client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send("Its done!");
                for (i = 0; i < imagelist.length; i++) {
                    client.guilds.get(voteMessage.guild.id).channels.get(voteMessage.channel.id).send(
                        client.guilds.get(voteMessage.guild.id).members.get(corpselist[i]).user.username + " " + imagelist[i]);
                }
                corpselist = new Array();
            } else {
                client.guilds.get(voteMessage.guild.id).members.get(corpselist[order]).user.createDM().then(channel => {
                    //Issue to be fixed #1
                    channel.send("Yer up!")
                    channel.send(imagelist[imagelist.length-1]);
                });
            }
        }
    }
});

/* getCheck
* 
* return type: string
* 
* Organizes all the players into a single string indicating order and current turn
*/
function getCheck() {
    console.log("Sending check");
    var list = "";
    for (i = 0; i < corpselist.length; i++) {
        if (i < order) {
            list += ":o: " + client.guilds.get(voteMessage.guild.id).members.get(corpselist[i]).user.username + "\n";
        } else {
            list += ":x: " + client.guilds.get(voteMessage.guild.id).members.get(corpselist[i]).user.username + "\n";
        }
    }
    return list;
}

/* shuffle
* 
* input type: array
* return type: array
* 
* Simple function to randomly shuffle the order of an array
*/
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

//DO NOT FORGET TO REMOVE LOGIN CODE BEFORE UPLOAD
client.login('botcode');