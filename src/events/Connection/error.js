module.exports = async (client, err) => {
	console.error(err);
	if (!client.status) {
		const { token, testToken } = require("config.json");
		await client.destroy().catch(console.error);
		client.login(process.argv[2] === "test" ? testToken : token)
			.then(() => console.log(`\nRelogando como ${client.user.tag} após erro de conexão\n`))
			.catch(console.error);
	}
};
