# anycast: cast <video /> to smart TVs 

Does what it says on the tin: allows casting of HTML5 video to certain smart TVs. 

Very experimental. Tested on LG webOS and that's about it. 

Not (yet?) compatible with Media Source Extensions (i.e. the video must be accessible at a URL). Definitely not compatible with EME. 

## Running

### Starting Bridge

The bridge is a HTTP proxy. Some DLNA TVs require particular HTTP headers on response content or they will refuse to play it. It also uses the User-Agent of your web browser, as some videos (e.g. hosted on S3) may use the User Agent in its signature. 

    cd bridge
    yarn
    node index.js

### Browser Extension

Forked from the very handy [extension-boilerplate](https://github.com/EmailThis/extension-boilerplate). Its README is included and contains useful install instructions.

    cd extension
    yarn
    yarn [chrome|firefox|opera]-[watch|build]


