// const { ShardingManager } = require("discord.js");
// const { token, topggToken, dev } = require("./config.json");
// const manager = new ShardingManager("./bot.js", { token: token });

// manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

// manager
// 	.spawn()
// 	.catch((error) => console.error(`[ERROR/SHARD] Shard failed to spawn.`));

const { modules } = require('./config.json')

function bootstrap() {
    try {
        require('./bot')
        modules.use_server === 'yes' ? require('./server') : null
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}]`, error)
    }
}

bootstrap()
