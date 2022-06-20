<p align="center">
    <img alt="Reddit Video Creator Logo" src="./src-tauri/icons/icon.png" width="60" />
</p>

<h1 align="center">
Reddit Video Creator App
</h1>

# ⚠️ Under Construction

## 💻 [Download](https://github.com/ValentinHLica/reddit-video-creator-app/releases)

## 🍿 [Example](https://youtu.be/xTjnCoePU18)

<br/>

## 🚀 Setup

For any problems please check [References](#references)

<br/>

### 💀 Windows

1. Download [FFMPEG](https://ffmpeg.org/), [BAL4WEB](http://www.cross-plus-a.com/bweb.htm), [BALCON](http://www.cross-plus-a.com/bconsole.htm) and [NodeJs](https://nodejs.org/). Save them in a folder that you wont touch.
2. Store .exe path for ffmpeg, bal4web and balcon as environment variables [Tutorial](https://www.youtube.com/watch?v=hD9bQE4R6eA) (same tutorial method for bal4web and balcon)

<br/>

### 💀 Linux

Start by updating the packages list and installing ffmpeg:

```
sudo apt update && sudo apt install ffmpeg
```

<br/>

### 💀 MaxOS

Install ffmpeg:

```
brew install ffmpeg
```

Install wine **(used for balcon and bal4web)**:

```
brew tap homebrew/cask-versions && brew install --cask --no-quarantine wine-stable
```

<br/>

## 🧰 Todo

- [x] Package with git actions
- [x] Store settings into .json to be used in backend
- [ ] Create custom thumbnail
- [ ] Auto Update
- [ ] Create custom thumbnails
- [ ] Set background image for post
- [ ] Refactor
- [ ] Improve README.md
- [ ] Change logo icon color

<br id="references"/>

## 📑 References

- [Installing Node.js with nvm to Linux & macOS & WSL](https://gist.github.com/d2s/372b5943bce17b964a79)
- [How to Install and Use FFmpeg on Debian](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- [How to Install Wine on Ubuntu 20.04 LTS](https://vitux.com/how-to-install-wine-on-ubuntu/)
