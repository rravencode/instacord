import { Command } from '@/classes/command.ts';
import { getInstagramProfile } from '@/utils/instagram.ts';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';

export default new Command({
  data: (builder) => builder
    .setName('avatar')
    .setDescription('Bir kullanıcı adı girerek kullanıcının profil avatarını elde edebilirsiniz.')
    .addStringOption((input) => input
      .setName('username')
      .setDescription('Bir kullanıcı adı girininiz. (fenerbahce)')
      .setRequired(true),
    )
    .setDMPermission(false),

  async execute(interaction) {
    const embedBuilder = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        name: `Kullanıcı avatarı — @${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
        url: `https://discord.com/users/${interaction.user.id}`,
      })
      .setDescription('Bu kullanıcı ile ilgili hiçbir bilgi bulamadım. Kullanıcının ismini yanlış yazmış olabilirsiniz veya Instagram bilgilerini görmeme izin vermiyor olabilir.')
      .setFooter({
        text: 'Bu altyapı @rravencode için yapılmıştır, daha fazla bilgi için tıkla.',
        iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/c2a37851263289188afde2ea135e0665.png',
      })
      .setTimestamp();

    const username = interaction.options.getString('username', true);
    const htmlData = await fetch(`https://www.instagram.com/${username}/`);
    const instagramUser = await getInstagramProfile(username);

    if (htmlData.status !== 200 || !instagramUser.url) {
      await interaction.editReply({ embeds: [embedBuilder] }).catch(() => undefined);
      return;
    }

    const profilePicture = instagramUser.profilePicture ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/800px-Instagram_logo_2022.svg.png';

    interaction.editReply({
      embeds: [
        embedBuilder
          .setColor('#e1306c')
          .setDescription(null)
          .setAuthor({
            name: `Kullanıcı avatarı — ${instagramUser.title}`,
            iconURL: instagramUser.profilePicture ?? '',
            url: `https://www.instagram.com/${username}/`,
          })
          .setImage(profilePicture),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setURL(profilePicture)
            .setLabel('Tarayıcda görüntüle')
            .setStyle(ButtonStyle.Link),
        ),
      ],
    });
  },
});