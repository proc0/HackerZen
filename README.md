<img src="logo.svg" />

# Hacker Zen

A minimalist Hacker News.

Link: [https://proc0.github.io/HackerZen](https://proc0.github.io/HackerZen)

## Optimized

Popular posts on [Hacker News](https://news.ycombinator.com) with thousands of comments slow down even powerful desktop machines. Despite its simple UI, it loads all replies at once with a lot of HTML stuttering the browser rendering.

**Hacker Zen** adds incremental loading of posts and replies with a minimal UI for a better experience. It has zero dependencies for its static version (read-only version of the site), using plain JS and CSS, and it caches posts and replies using IndexedDB to avoid double fetching.

## Features

- Minimal UI
- Local caching
- Static site (read-only)
- No dependencies
- Mobile friendly
- Easily extensible

## Implemented HN features

- load posts and comments for Top, New, Best, Jobs, Ask, and Show
- upvote posts and comments (requires local server)
- reply to comments (requires local server)
- load user posts (requires local server)

## Usage

### Github pages

[https://proc0.github.io/HackerZen](https://proc0.github.io/HackerZen)

### Just open index.html (read-only)

Clone the repo, open index.html! This will load the static, read-only version. This is more or less like browsing Hacker News without being logged in.

### Run local server (read, vote, reply)

In order to have write capabilities (i.e. upvoting, downvoting, replying), the requests need the user cookie, and as of right now there is no easy way to use the official /login to obtain this.

The workaround is to copy the cookie into an environment variable. The local server will look for HN_COOKIE, and use that for POST requests.

1. Clone the repo
2. Install dependencies `npm install`
3. Login to [Hacker News](https://news.ycombinator.com)
4. Open DevTools or equivalent (i.e. Ctrl+Alt+I)
5. Copy the user cookie
6. Paste into an environment variable
   - (Windows) Powershell`$env:HN_COOKIE="<insert here>"`
   - (\*nix) Bash`$HN_COOKIE=<insert here>`
7. Run the server with `node .`
8. Navigate to `localhost:3000`

## Building

No build is needed, but there is a Parcel dep and a script to bundle js to avoid serving lots of files. Work in progress.

## Future potential updates

- Support for post submition and editing comments
- Theme editor, choose custom colors
- Settings, i.e. how many comments to load
- Infinite scrolling
