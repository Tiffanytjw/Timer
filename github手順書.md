
# 📘 GitHub 初回アップロード手順書（SSH版）

## ✅ 0. 前提条件
- Git がインストールされていること
- GitHub アカウントを作成済み
- ローカルにプロジェクトフォルダがある（例：`C:\projects\timer`）

## ① Git リポジトリを初期化
```bash
cd C:\projects\timer
git init
```
成功すれば、以下のメッセージ：
```
Initialized empty Git repository in C:/projects/timer/.git/
```
## ② アップロードしないファイル・フォルダの設定
- **.gitignore**ファイルを作成
- その中ににアップロードしたくないファイルかフォルダを書く。以下の例を参照
```txt
__pycache__/
*.pyc
.env
venv
node_modules/
dist/
*.csv
```
## ユーザー名とメールアドレスの設定
```bash
git config --global user.name "<username>"
git config --global user.email "<username@yahoo.co.jp>"
```
## ③ ファイルをステージングして初回コミット

```bash
git add .
git commit -m "first commit"
git branch -M main
```

## ④ GitHub で新しいリポジトリを作成
GitHub 上で「New repository」をクリックし、空のリポジトリを作成します（例：`timer`）

## ⑤ SSH キーを作成（初回のみ）
```bash
ssh-keygen -t ed25519 -C "username@yahoo.co.jp"
```

- Enter を押して標準の場所に保存（保存場所→パソコンwindowsユーザーのフォルダ）
- パスフレーズは空でもOK


## ⑥ 公開鍵を GitHub に登録

```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```

1. 実行結果をコピー
2. GitHub → [Settings] → [SSH and GPG keys] → [New SSH key]
3. タイトル入力＋コピーした鍵を貼り付けて保存

## ⑦ GitHub との接続テスト

```bash
ssh -T git@github.com
```

成功例：
```
Hi <your-username>! You've successfully authenticated, ...
```

## ⑧ GitHub のリポジトリをリモートに追加
```bash
git remote add origin git@github.com:ユーザー名/リポジトリ名.git
```
例：
```bash
git remote add origin git@github.com:username/timer.git
```

## ⑨ 初回プッシュ（`main` ブランチ）
```bash
git push --set-upstream origin main
```

成功すれば、GitHub 上にコードがアップロードされます 🎉  


### 🔁 よくある追加コマンド

- 変更を反映：
  ```bash
  git add .
  git commit -m "自由記述できる内容"
  git push
  ```

- リモート状態確認：
  ```bash
  git remote -v
  ```