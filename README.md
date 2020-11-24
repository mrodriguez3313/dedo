# Dedo

## The Problem and Solution
As of right now, anybody can upload files to IPFS but they do not have an idea of how to find and download that specific file without having the specific hash that goes with it. With Dedo, we created a prototype that focuses on uploading video files. In order to find our specific video file, we devised a schema that provides basic info that any uploader would need including title, video runtime, upload date, etc. We also utilized SkyDB to create specific user profiles so that all the files you have uploaded can be seen readily. 

Dedo is a video uploader application that utilizes SkyDB as the database for the verification of your particular user profile. 

Simple Web setup using the following technologies:

- [IPFS](https://ipfs.io/), used by `Ceramic`
- [Ceramic](https://ceramicnetwork.github.io/js-ceramic/api/), injected as `window.ceramic` once initiated
- [DID](https://ceramicnetwork.github.io/js-did/classes/did.html), injected as `window.did` once authenticated
- [IDX](https://idx.xyz/) ([Web version](https://idx.xyz/docs/libs-web)) using [3ID connect](https://github.com/3box/3id-connect), injected as `window.idx` once authenticated

## License

Apache-2.0 OR MIT


