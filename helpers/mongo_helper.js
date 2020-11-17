const mongodb = require('mongodb')
const config = require('../config.json')

async function loadDB() {
    const client = await mongodb.MongoClient.connect(
        `mongodb+srv://${config.mongo_user}:${config.mongo_password}@cluster0.xxz7f.mongodb.net/${config.mongo_db_name}?retryWrites=true&w=majority`,
        {
            // These are set to avoid errors
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )

    return client.db(config.mongo_db_name).collection(config.mongo_collection_name)
}

module.exports = {
    
    async addNewServer(server_id, server_name){

        const db = await loadDB()
        await db.insertOne({
            server_id,
            server_name,
            prefix: "!",
            date_joined: new Date(), 
        })
    },

    async removeServer(server_id){

        const db = await loadDB()
        await db.deleteOne({server_id})
    },

    async getPrefix(server_id){

        const db = await loadDB()
        const serverInfo = await db.findOne({server_id})
        return serverInfo.prefix
    },

    async getDescription(server_id){

        const db = await loadDB()
        const serverInfo = await db.findOne({server_id})
        return await serverInfo.desc
    },

    async updatePrefix(server_id, prefix){

        const db = await loadDB()
        await db.updateOne(
            {server_id},
            { $set:
                {
                    prefix
                }            
            }
        )
    },

    async updateDesc(server_id, desc) {

        const db = await loadDB()
        await db.updateOne(
            {server_id},
            { $set:
                {
                    desc
                }
            }
        )
    }
}