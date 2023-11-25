import { Command } from '@/classes/command.ts';
import { getInstagramProfile } from '@/utils/instagram.ts';
import { Colors, EmbedBuilder } from 'discord.js';

export default new Command({
  data: (builder) => builder
    .setName('profile')
    .setDescription('Bir kullanıcı adı girerek kullanıcının profil bilgilerini elde edebilirsiniz.')
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
        name: `Kullanıcı bilgisi — @${interaction.user.username}`,
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

    interaction.editReply({
      embeds: [
        embedBuilder
          .setColor('#e1306c')
          .setAuthor({
            name: `Kullanıcı bilgisi — ${instagramUser.title}`,
            iconURL: instagramUser.profilePicture ?? '',
            url: `https://www.instagram.com/${username}/`,
          })
          .setDescription('• Bot verileri anlık olarak güncelleme gösterebilir ve tüm kullanıcı gerektiren veriler, kullanıcı kimliğini açığa çıkarmaz.')
          .setFields([
            {
              name: 'Gönderi:',
              value: `${instagramUser.posts ?? 0} gönderi`,
              inline: true,
            },
            {
              name: 'Takipçi:',
              value: `${instagramUser.followers ?? 0} takipçi`,
              inline: true,
            },
            {
              name: 'Takip:',
              value: `${instagramUser.following ?? 0} takip`,
              inline: true,
            },
          ]),
      ],
    });
  },
});