const mongo_helper = require('../helpers/mongo_helper.js')

module.exports = {
    name: 'prefix',
    description: "Change the prefix used by this server. Default is '!'. \
    Options are: [!, ^, *, $, ~, -]",
    async execute(msg, input) {
        const prefixes = [ '!', '^', '*', '$', '~', '-', '%']

        if(prefixes.includes(input)){

            await mongo_helper.updatePrefix(msg.guild.id, input)
            msg.channel.send(`Succesfully changed my prefix to ${input}`)
        
        } else {

            msg.channel.send(`Can't change my prefix to that.\
            \n The options are: [!, ^, *, $, ~, -]`)

        }

    } 
}