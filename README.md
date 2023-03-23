# rest-api-social-media

a [Sails v1](https://sailsjs.com) project is a REST API developed for a social media platform that provides users with various features like creating posts, adding comments, liking and disliking posts, save posts, share posts, and following/unfollowing other users. The API also includes an admin panel that allows admins to manage user accounts and posts also make user active and inactive.

## User Features

- User Login and Signup
- Change password
- Create a New post
- List all posts
- Like and Dislike post
- Add comments
- view other user's profile
- follow and unfollow user
- list following and followers
- save posts
- share posts

## Admin features

- Admin login
- User management
- Post management

## Technologies Used

- Sails.js
- MongoDB
- Graphql
- Mocha.js

## Installtion

Clone the project

```bash
  git clone https://github.com/utsavKhatri/REST-api-social-media.git
```

Go to the project directory

```bash
  cd REST-api-social-media
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Running Tests

To run tests, run the following command

```bash
  npm test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- mongodb database url : `MONGO_URL`
- Jwt secret : `SECRET`
- Cloudinary cloud_name : `CLOUD_NAME`
- Api_key : `KEY`
- Cloudinary api secret : `API_SECRET`

## Links

- [Sails framework documentation](https://sailsjs.com/get-started)
- [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
- [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
- [Community support options](https://sailsjs.com/support)
- [Professional / enterprise options](https://sailsjs.com/enterprise)

### Version info

This app was originally generated on Thu Mar 02 2023 13:03:03 GMT+0530 (India Standard Time) using Sails v1.5.4.

<!-- Internally, Sails used [`sails-generate@2.0.7`](https://github.com/balderdashy/sails-generate/tree/v2.0.7/lib/core-generators/new). -->

<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->
