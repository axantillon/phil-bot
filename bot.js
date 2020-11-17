const fs = require('fs');
const config = require('./config.json');
const mongo_helper = require('./helpers/mongo_helper.js')


const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}
console.log("Bot getting ready... ✨")
client.once('ready', () => {
    console.log("Up and running! 🎉")
})

client.on('message', async(msg) => {

    const prefix = await mongo_helper.getPrefix(msg.guild.id)

    if(!msg.content.startsWith(prefix) || msg.author.bot) return
    
    const commandName = msg.content.slice(prefix.length).split(' ')[0].toLowerCase()
    const input =  msg.content.slice(prefix.length + commandName.length).trim()

    if(!client.commands.has(commandName)) return
    
    const command = client.commands.get(commandName)

    try {
        if(command.admin_only && msg.member.hasPermission("ADMINISTRATOR")){
            command.execute(msg, input)
        }else if(!command.admin_only){
            command.execute(msg, input)
        }

    } catch (err) {
        console.error(err)
        msg.reply("Error executing that command!")
    }
})

client.on('guildCreate', async (guild) => {

    const helloEmbed = new Discord.MessageEmbed()
        .setTitle("Hey, I'm Phil (The Bot)!")
        .setDescription("To get started, type in this command: **!desc** followed by a brief description of your server! \
        \nMy main purpose is to answer any question about this server! \
        \nYou can ask me by using the **'!asking'** followed by your question!\
        \nMy current prefix is **'!'** but you can change it by calling **!prefix** followed by your new preffered prefix")

    let defaultChannel;

    guild.channels.cache.forEach((channel) => {
        if(channel.type == "text") {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel
                return
            }
        }
    })

    defaultChannel.send(helloEmbed)

    await mongo_helper.addNewServer(guild.id, guild.name)

})

client.on('guildDelete', async (guild) => {
    await mongo_helper.removeServer(guild.id)
})

client.login(config.bot_token)