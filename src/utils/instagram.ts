import htmlMetaParser from 'html-metadata-parser';

export interface InstagramPorfileData {
    title: string | undefined;
    url: string | undefined;
    profilePicture: string | undefined;
    followers: string | undefined;
    following: string | undefined;
    posts: string | undefined;
}

export async function getInstagramProfile(username: string): Promise<InstagramPorfileData> {
  const metadata = await htmlMetaParser.parser(
    `https://www.instagram.com/${username}/`,
  );
  const url = metadata.meta.url;
  const title = metadata.meta.title?.split('•')[0]?.slice(0, -1);
  const profilePicture = metadata.og.image;
  const metaDescription = metadata.meta.description ?? '';

  const [followers, following, posts] = metaDescription
    .split(',')
    .map((value) => value.trim().split(' ')[0]);

  return { title, url, profilePicture, followers, following, posts };
}
