const axios = require('axios')
const { getDescription } = require('../helpers/mongo_helper')

module.exports = {
    name: 'asking',
    description: 'This command will allow a user to ask a question about the information provided about the server.',
    async execute(msg, input){
        
        const description = await getDescription(msg.guild.id)

        if(description == undefined){
            msg.channel.send("No description for this server has been provided. If you're an Admin provide one using the **desc** command")
        }
        
        await axios.post("https://api-inference.huggingface.co/models/deepset/bert-large-uncased-whole-word-masking-squad2", {
            "context": description,
            "question": input
        }).then(function (response){
            msg.reply(response.data.answer)
        }).catch(function(error){
            console.log(error)
        })
    }
}