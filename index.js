const { Client, Intents, MessageReaction } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const { joinVoiceChannel, AudioPlayerStatus,createAudioPlayer,createAudioResource ,NoSubscriberBehavior, AudioResource } = require('@discordjs/voice')
const {token,prefix,directory} = require("./config.json");
const fs = require("fs");
const {find_song} = require("./find_song.js")
const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
const config = require("./isPlaying.json")

config.status = false;
config.paused = false;
config.already_playing= false;
fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
    if (err) {
    console.log(`Final check writing error -> ${err}`)
    } 
    
})


client.on('ready', () => {
    console.log('Js bot is Ready!');
});
player.on('error', error => {
	console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
	player.play(getNextResource());
});
client.on('messageCreate', async message => {
    
    if(message.author.bot){
        return;
    }
  
    if (message.content === `${prefix} play`) {
        var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
        
        if(obj.already_playing ===false){ 
   

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.member.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator
        })
      
            let song_name = await find_song();
        
            const resource = createAudioResource(`${directory}/${song_name}`);
         

        
            player.play(resource);
            connection.subscribe(player);
            config.status = true;
            fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
                if (err) {
                console.log(`Final check writing error -> ${err}`)
                } 
                
            })
            player.on(AudioPlayerStatus.Idle, async() => {
                var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
                        if(resource.ended){
                            if(obj.queueloop ===true && obj.status ===true){
                                let song_name = await find_song();
        
                                const resource = createAudioResource(`${directory}/${song_name}`);
                                player.play(resource);
                                connection.subscribe(player);
                        }
        
        
                        if(obj.queueloop ===false){
                            await message.channel.send(`Finished Playing ${song_name}`)
        
                        }
                    } 
                      //  player.play(getNextResource());
                    
                    });
                    config.already_playing = true;
                    fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
                        if (err) {
                        console.log(`Final check writing error -> ${err}`)
                        } 
                        
                    })

                }
    }

     

    if (message.content === `${prefix} skip`) {
        var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
        if(obj.status ===true){
        player.stop();
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.member.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator
        })
        
            let song_name = await find_song();
        
            const resource = createAudioResource(`${directory}/${song_name}`);
            player.play(resource);
            connection.subscribe(player);
          
    } else if (obj.status ===false){
        await message.channel.send(`Use the ***${prefix} play*** command first`)
    }
    }

    if (message.content === `${prefix} stop`) {
        var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
        if(obj.status ===true){
        config.status = false;
        config.already_playing = false;
        fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
            if (err) {
            console.log(`Final check writing error -> ${err}`)
            } 
            
        })
        player.stop();
    }
    if(obj.status ===false){
        await message.channel.send(`No song playing. Use ***${prefix} play***`)
    }
       
    }

    if (message.content === `${prefix} pause`) {
        var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
        if(obj.paused===false && obj.status ===true){
        player.pause();
        config.paused= true;
        fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
            if (err) {
            console.log(`Final check writing error -> ${err}`)
            } 
            
        })
    } if(obj.paused ===true) {
        await message.channel.send(`Already paused.. Use ***${prefix} unpause***`)
    }
    if(obj.status===false) {
        await message.channel.send(`Song is not playing.. Use ***${prefix} play***`)
    }
    }

    if (message.content === `${prefix} queueloop`) {
    if(config.queueloop ===true){
        config.queueloop= false;
        fs.writeFile("./isPlaying.json", JSON.stringify(config),async function writeJSON(err) {
            if (err) {
            console.log(`Final check writing error -> ${err}`)
            } else {
                await message.channel.send("Queue loop stopped!")
            }
            
        })
    } else if(config.queueloop === false){
        config.queueloop= true;
        fs.writeFile("./isPlaying.json", JSON.stringify(config),async function writeJSON(err) {
            if (err) {
            console.log(`Final check writing error -> ${err}`)
            } else {
                await message.channel.send("Queue loop enabled!")
            }
            
        })  
    }
    }




    if (message.content === `${prefix} unpause`) {
        var obj = JSON.parse(fs.readFileSync('./isPlaying.json', 'utf8'));
        if(obj.paused ===true){
        player.unpause();
        config.status = true;
        fs.writeFile("./isPlaying.json", JSON.stringify(config), function writeJSON(err) {
            if (err) {
            console.log(`Final check writing error -> ${err}`)
            } 
            
        })
    }
    if(obj.paused ===false ){
        await message.channel.send(`No song on pause.. Use ***${prefix} play***`)
    
    } 
} 


});

client.login(token);
