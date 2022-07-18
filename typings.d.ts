import * as Discord from "discord.js";
import * as Builders from "@discordjs/builders";

/**
 * Represents a chat-based Message Command.
 */
export interface LegacyCommand {
	name: string;
	aliases?: string[];
	description?: string;
	usage?: string;
	permissions?: Discord.PermissionResolvable;
	guildOnly?: boolean;
	args?: boolean;
	cooldown?: number;
	ownerOnly?: boolean;
	execute(
		message: Discord.Message & { client: Client },
		args: string[]
	): void | Promise<void>;
}
export interface SlashInteractionCommand {
	data: Builders.SlashCommandBuilder;
	options: Array<
		| Builders.SlashCommandStringOption
		| Builders.SlashCommandNumberOption
		| Builders.SlashCommandRoleOption
		| Builders.SlashCommandUserOption
		| Builders.SlashCommandBooleanOption
		| Builders.SlashCommandChannelOption
		| Builders.SlashCommandIntegerOption
	>;
	execute(
		interaction: Discord.CommandInteraction & { client: Client }
	): void | Promise<void>;
}
export interface ButtonInteractionCommand {
	id: string;
	execute(
		interaction: Discord.ButtonInteraction & { client: Client }
	): void | Promise<void>;
}
export interface SelectInteractionCommand {
	id: string;
	execute(
		interaction: Discord.SelectMenuInteraction & { client: Client }
	): void | Promise<void>;
}
export interface ContextInteractionCommandData {
	name: string;
	type: 2 | 3;
}

export interface ContextInteractionCommand {
	data: ContextInteractionCommandData;
	execute(
		interaction: Discord.ContextMenuInteraction & { client: Client }
	): void | Promise<void>;
}
export interface ModalInteractionCommand {
	id: string;
	execute(
		interaction: Discord.ModalSubmitInteraction & { client: Client }
	): void | Promise<void>;
}
export interface TriggerCommand {
	name: string[];
	execute(
		message: Discord.Message & { client: Client },
		args: string[]
	): void | Promise<void>;
}
export interface Client extends Discord.Client {
	commands: Discord.Collection<string, LegacyCommand>;
	slashCommands: Discord.Collection<string, SlashInteractionCommand>;
	buttonCommands: Discord.Collection<string, ButtonInteractionCommand>;
	selectCommands: Discord.Collection<string, SelectInteractionCommand>;
	contextCommands: Discord.Collection<string, ContextInteractionCommand>;
	modalCommands: Discord.Collection<string, ModalInteractionCommand>;
	cooldowns: Discord.Collection<string, Discord.Collection<string, number>>;
	triggers: Discord.Collection<string, TriggerCommand>;
}
