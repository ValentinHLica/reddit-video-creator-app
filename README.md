<p align="center">
    <img alt="Reddit Video Creator App" src="./src-tauri/icons/logo.svg" width="60" />
</p>
<h1 align="center">
Reddit Video Creator App
</h1>

# ⚠️ Under Construction

## 📼 Create Reddit Videos with JavaScript - 💻 [Download App](https://github.com/ValentinHLica/reddit-video-creator-app/releases)

https://user-images.githubusercontent.com/74852397/176777528-649ec815-441d-4e94-9cfb-09a7bdaf0c74.mp4

## 🚀 Setup

For any problems please check [References](#references)

### 💀 Windows

1. Download [FFMPEG](https://ffmpeg.org/), [BAL4WEB](http://www.cross-plus-a.com/bweb.htm) , and [NodeJS](https://nodejs.org/), [Git](https://git-scm.com/). Save them in a folder that you won't touch and store .exe path for ffmpeg, ffprobe, bal4web into settings drawer.

### 🐧 Linux

1. Install latest version of NodeJs

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install --lts
```

2. Download [FFMPEG](https://ffmpeg.org/), [BAL4WEB](http://www.cross-plus-a.com/bweb.htm). Save them in a folder that you won't touch and store path for ffmpeg, ffprobe, bal4web into settings drawer.

3. Install Wine

Debian:

```sh
sudo apt update -y && sudo apt install wine64 -y
```

Arch:

```sh
sudo pacman -Syu -y && sudo pacman -Syu -y && sudo pacman -S wine-staging -y
```

### 💀 MaxOS - **_#todo_**

<!-- Install [Brew](https://brew.sh/)

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Download [FFMPEG](https://ffmpeg.org/), [BAL4WEB](http://www.cross-plus-a.com/bweb.htm). Save them in a folder that you won't touch and store path for ffmpeg, ffprobe, bal4web into settings drawer.

3. Install Wine

```
brew tap homebrew/cask-versions
brew install --cask --no-quarantine wine-stable
``` -->

## 🧰 Todo

- [x] Package with git actions
- [x] Store settings into .json to be used in backend
- [ ] Create custom thumbnail
- [ ] Auto Update
- [ ] Create custom thumbnails
- [x] Set background image for post
- [ ] Refactor
- [ ] Improve README.md
- [ ] Change logo icon color

<span id="references"></span>

## 📑 References

- [Installing Node.js with nvm to Linux & macOS & WSL](https://gist.github.com/d2s/372b5943bce17b964a79)
- [How to Install and Use FFmpeg on Debian](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- [How to Install Wine on Linux](https://wiki.winehq.org/Ubuntu)
- [Git Official Website](https://git-scm.com/)
- [Brew Official Website](https://brew.sh/)
