module.exports = {
	name: "voiceStateUpdate",
	execute(oldState, newState, client) {
		if (oldState.id !== newState.id) return;
		if (newState.id !== client.user.id) return;
		if (oldState.guild.id !== newState.guild.id) return;
		if (!newState.channel) return;
		if (newState.channel.type !== "GUILD_STAGE_VOICE") return;
        if (!newState.suppress) return;
		newState.guild.me.voice.setSuppressed(false);
	},
};
