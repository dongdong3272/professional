# Local development & publish

This is a **Jekyll** site (Minimal Mistakes theme).

- Live site: [https://dongdong3272.github.io/professional](https://dongdong3272.github.io/professional)
- Repo: [https://github.com/dongdong3272/professional](https://github.com/dongdong3272/professional)
- Deploy: push to `main` → GitHub Actions builds and deploys to GitHub Pages

**Recommendation:** use **WSL (Ubuntu)** for local runs. Jekyll/Ruby is painful on native Windows, and Ruby is not currently installed in PowerShell.

---

## 1. One-time setup (WSL)

Open **Ubuntu (WSL)** and install Ruby + build tools:

```bash
sudo apt update
sudo apt install -y ruby-full build-essential zlib1g-dev
sudo gem install bundler
```

Go to this project (Windows `D:\` is usually `/mnt/d/` in WSL):

```bash
cd /mnt/d/PersonalWeb/professional

# Install gems into the project folder (not /var/lib/gems — that needs sudo)
bundle config set --local path 'vendor/bundle'
bundle install
```

`bundle install` downloads Jekyll and the gems listed in `Gemfile` (including `github-pages`) into `vendor/bundle/`.

### Optional: PowerShell / native Windows

Only if you prefer not to use WSL:

1. Install [RubyInstaller](https://rubyinstaller.org/) (Ruby 3.1+ with MSYS2 / DevKit).
2. In PowerShell, from this folder:

```powershell
gem install bundler
bundle install
```

The `Gemfile` already includes `wdm` for Windows file watching.

---

## 2. Run locally

### WSL (recommended)

If the project is on a Windows drive (`/mnt/d/...`), file watching does **not** work by default. Use polling:

```bash
cd /mnt/d/PersonalWeb/professional
bash scripts/set_last_updated.sh
bundle exec jekyll serve --force_polling --livereload
```

- `bash scripts/set_last_updated.sh` — writes `_data/last_updated.yml` from the latest git commit (homepage “last updated” date). Re-run after new commits if you want the date to refresh while serving.
- `--force_polling` — detects file changes on `/mnt/d/` (slightly slower than native Linux, but automatic)
- `--livereload` — refreshes the browser after each rebuild

Then open:

**[http://127.0.0.1:4000/professional/](http://127.0.0.1:4000/professional/)**

(`baseurl` is `/professional`, so the root path alone will look broken.)

Other useful variants:

```bash
# Polling only (refresh browser manually)
bundle exec jekyll serve --force_polling

# Bind so other devices on the LAN can open it
bundle exec jekyll serve --force_polling --livereload --host 0.0.0.0
```

Stop with `Ctrl+C`.

### PowerShell (if Ruby is installed on Windows)

```powershell
cd D:\PersonalWeb\professional
bash scripts/set_last_updated.sh
bundle exec jekyll serve
```

(`bash` needs Git Bash or WSL on the PATH. Alternatively run the same script from WSL first.)

Same URL: [http://127.0.0.1:4000/professional/](http://127.0.0.1:4000/professional/)

---

## 3. Publish

Publishing is automatic via `[.github/workflows/jekyll.yml](.github/workflows/jekyll.yml)`:

1. Commit your changes.
2. Push to `main`:

```bash
git add .
git commit -m "Your message"
git push origin main
```

1. Wait for the **Deploy Jekyll site to Pages** workflow (GitHub → Actions).
2. Site updates at: [https://dongdong3272.github.io/professional](https://dongdong3272.github.io/professional)

You can also trigger a deploy manually: GitHub → **Actions** → **Deploy Jekyll site to Pages** → **Run workflow**.

### First-time GitHub Pages check

If the site does not go live after a green workflow:

1. Repo → **Settings** → **Pages**
2. **Source** should be **GitHub Actions** (not a branch)

---

## Troubleshooting

### `Bundler::PermissionError` on `/var/lib/gems/...`

Ubuntu's `ruby-full` installs system Ruby. A normal user cannot write there.

**Fix:** install gems locally (do **not** use `sudo bundle install`):

```bash
cd /mnt/d/PersonalWeb/professional
bundle config set --local path 'vendor/bundle'
bundle install
```

Then run the site:

```bash
bundle exec jekyll serve --force_polling --livereload
```

### Changes not detected on WSL (`/mnt/d/...`)

WSL cannot watch Windows filesystem events reliably. You will see:

> Auto-regeneration may not work on some Windows versions.

**Fix:** always use `--force_polling` (and `--livereload` to auto-refresh the browser):

```bash
bundle exec jekyll serve --force_polling --livereload
```

**Better alternative:** clone the repo into WSL's native filesystem so polling is not needed:

```bash
git clone https://github.com/dongdong3272/professional.git ~/professional
cd ~/professional
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve --livereload
```

Edit files via `\\wsl$\Ubuntu\home\<your-user>\professional` in Cursor, or open the folder with **WSL: Reopen Folder in WSL**.

---

## Quick cheat sheet


| Goal                         | Command                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| Install deps (once)          | `bundle config set --local path 'vendor/bundle'` then `bundle install`     |
| Local preview (on `/mnt/d/`) | `bundle exec jekyll serve --force_polling --livereload`                    |
| Open locally                 | [http://127.0.0.1:4000/professional/](http://127.0.0.1:4000/professional/) |
| Publish                      | `git push origin main`                                                     |


