const mongo_helper = require('../helpers/mongo_helper.js')

module.exports = {
    name: 'desc',
    description: 'update the description of the server in the database',
    admin_only: true,
    async execute(msg, input) {
        await mongo_helper.updateDesc(msg.guild.id, input)

        msg.channel.send(`Alright! \nThe server's description has been updated to: \n${input}`)

    }
}