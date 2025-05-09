export const getURL = (path: string = '') => {
  // NEXT_PUBLIC_SITE_URLが設定されており、空でないことを確認してください。本番環境では、これをサイトのURLに設定してください。
  let url =
      process?.env?.NEXT_PUBLIC_SITE_URL &&
          process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
          ? process.env.NEXT_PUBLIC_SITE_URL
          : // 設定されていない場合は、Vercel によって自動的に設定される NEXT_PUBLIC_VERCEL_URL を確認します。
          process?.env?.NEXT_PUBLIC_VERCEL_URL &&
              process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
              ? process.env.NEXT_PUBLIC_VERCEL_URL
              : // どちらも設定されていない場合は、ローカル開発の場合はデフォルトで localhost になります。
              'http://localhost:3000/';

  // URL をトリミングし、末尾のスラッシュが存在する場合は削除します。
  url = url.replace(/\/+$/, '');
  // localhost 以外の場合は必ず `https://` を含めてください。
  url = url.includes('http') ? url : `https://${url}`;
  // 最終的な URL で二重のスラッシュを回避するために、パスがスラッシュなしで始まっていることを確認してください。
  path = path.replace(/^\/+/, '');

  // URL とパスを連結します。
  return path ? `${url}/${path}` : url;
};