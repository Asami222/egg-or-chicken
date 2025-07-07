<div id="top"></div>

# Egg or Chicken
### ストーリー
<!-- プロジェクトについて -->
Web APIから天気予報を取得し、当日の天気の内容によって鳥が異なる色の卵を産みます。鳥は羽根を毎日１枚落とします。鳥が食べる餌も天気の内容によって異なる餌を取得できます。鳥に餌を与えると、当日の産む卵の色が変わります。卵を集めると、最終的に金の卵になり、金の卵を集めると、鳥が特別な見た目になります。羽がある程度集まると、鳥は肉に変化し、肉になる前に餌を与えることでそれを防ぐことができます。


## URL
https://egg-or-chicken.vercel.app
 <br >
テストユーザーとして体験する（登録不要）から、メールアドレスとパスワードを入力せずにログインできます。

## 使用技術一覧

<!-- シールド一覧 -->
<!-- 該当するプロジェクトの中から任意のものを選ぶ-->
<p style="display: inline">
  <!-- フロントエンドの言語一覧 -->
  <img src="https://img.shields.io/badge/-typescript-000000?style=for-the-badge&logo=typescript&logoColor=FFE500">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-react-000000?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-tailwindcss-000000?style=for-the-badge&logo=tailwindcss&logoColor=0854C1">
  <img src="https://img.shields.io/badge/-reactquery-000000?style=for-the-badge&logo=reactquery&logoColor=FF4154">
  <img src="https://img.shields.io/badge/-axios-000000?style=for-the-badge&logo=axios&logoColor=5A29E4">
  <img src="https://img.shields.io/badge/-supabase-000000?style=for-the-badge&logo=supabase&logoColor=3FCF8E">
  <!-- バックエンドの言語一覧 -->
  <!-- ミドルウェア一覧 -->
  <!-- インフラ一覧 -->
</p>

## 機能一覧
- ユーザー認証、データ管理(Supabase)
- 外部API(OpenWeatherMap API)機能取得(axios)
- サーバー状態管理(React Query)
- React状態管理(Jotai)

<!-- 
- ユーザー登録、ログイン機能(devise)
- 投稿機能
  - 画像投稿(refile)
  - 位置情報検索機能(geocoder)
- いいね機能(Ajax)
  - ランキング機能
- コメント機能(Ajax)
- フォロー機能(Ajax)
- ページネーション機能(kaminari)
  - 無限スクロール(Ajax)
- 検索機能(ransack)
-->
## テスト
- E2Eテスト(Playwight)
  - 認証機能
  - フォーム

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Node.js               | 22.2.0    |
| React                 | ^19.0.0     |
| Next.js               | 15.3.1     |

その他のパッケージのバージョンは package.json を参照してください. 


## プロジェクト詳細

<h3 align="center">ご飯の予約</h3>
<p align="center">
  <img src="https://raw.githubusercontent.com/Asami222/egg-or-chicken/main/public/git/food-area.webp" width="500" style="max-width: 100%;" />
</p>
<h3 align="center">天気情報取得</h3>
<p align="center">
  <img src="https://raw.githubusercontent.com/Asami222/egg-or-chicken/main/public/git/weather-area.webp" width="500" style="max-width: 100%;" />
</p>
<h3 align="center">使い方ページ</h3>
<p align="center">
  <img src="https://raw.githubusercontent.com/Asami222/egg-or-chicken/main/public/git/home-area.webp" width="500" style="max-width: 100%;" />
</p>
<h3 align="center">使い方ページ</h3>
<p align="center">
  <img src="https://raw.githubusercontent.com/Asami222/egg-or-chicken/main/public/git/howto-area.webp" width="500" style="max-width: 100%;" />
</p>

<p align="right">(<a href="#top">トップへ</a>)</p>
