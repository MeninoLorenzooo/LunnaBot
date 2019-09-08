module.exports = (client, createdGuild) => {
    const { guild } = require("database.js");
    let newGuild = new guild({ _id: createdGuild.id });
    newGuild.save().catch(()=>{});

	const { RichEmbed } = require("discord.js");
	const entrei = new RichEmbed()
    .setAuthor(`${createdGuild.name} | Adicionado`)
    .setDescription(`Entrei no servidor **${createdGuild.name}** (id: ${createdGuild.id})`)
    .addField("Membros", `Com **${createdGuild.memberCount}** membros`)
    .addField("Dono", `${createdGuild.owner} (ID: ${createdGuild.ownerID})`)
    .setThumbnail(createdGuild.iconURL || "")
    .setColor("f781c6");
    let chn = client.channels.get("538466177454964746");
    if (chn) chn.send(entrei).catch(()=>{});
};
