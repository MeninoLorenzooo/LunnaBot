module.exports = (client, deletedGuild) => {
	const { guild } = require("database.js");
	guild.findByIdAndDelete(deletedGuild.id).catch(()=>{});

	const { RichEmbed } = require("discord.js");
	const sai = new RichEmbed()
	.setAuthor(`${deletedGuild.name} | Removido`)
	.setDescription(`Fui removido do servidor **${deletedGuild.name}** (ID: ${deletedGuild.id})!`)
	.addField("Membros", `Com **${deletedGuild.memberCount}** membros`)
	.addField("Dono", `${deletedGuild.owner} (ID: ${deletedGuild.ownerID})`)
	.setThumbnail(deletedGuild.iconURL || "")
	.setColor("f781c6")
	let chn = client.channels.get("538466180562944010");
	if (chn) chn.send(sai).catch(()=>{});
};
