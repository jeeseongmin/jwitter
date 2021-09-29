# 🦅 Jwitter

## Project URL

- [jwitter](https://jeeseongmin.github.io/jwitter/#/)

## Project Description

This Project is Jwitter, Twitter Clone Project, Jwitter

Therefore, from now on, each expression will be changed to suit the project name as follows.

- Twitter → Jwitter
- Tweet →Jweet
- retweet → rejweet

## Project Stack

### Client

Following items are core frontend technologies used in this project:

- React
- React Router
- Redux
- tailwind css

### Server

Following items are core backend technologies used in this project:

- firebase
- github deploy
- gh-pages (for hosting)

## Data Schema

### Cloud Firestore

```jsx
Jweet {
	text : string,
	createdAt : timestamp,
	creatorId : string,
	like : array,
	reply : array,
	rejweet : array,
	attachmentUrl : array,
}

reply {
	text : string,
	createdAt : timestamp,
	creatorId : string,
	like : array,
	attachmentUrl : string,
	parent : string,
}

user {
	photoURL : string,
	email : string,
	displayName : string,
	bookmark : array,
	follower : array,
	following : array,
	rejweet : array,
	description : string,
	bgURL : string,
}
```

### Redux Schema

```jsx
currentUser {
	uid : string,
	photoURL : string,
	displayName : string,
	email : string,
	bgURL : string,
	description : string,
	bookmark : array,
	rejweet : array,
	follower : array,
	following : array,
}
```

## Jwitter Architecture

### Page

1.  Login 🔑

    Users can use Jwitter with Google login, Github login, and regular email login.
    ![Login](https://i.imgur.com/KhAYXqP.jpg)

2.  Home 🏠

    In this page, all Jweets are arranged in the order of the time they were created.

    ![Home](https://user-images.githubusercontent.com/47960777/135110151-9805fe11-67b2-4304-89da-3751fb7d6185.png)

3.  Explore 🔎

    Explore page is literally a page that user can explore. This page is divided into two tabs, Jweets and Users. The Jweets tab allows users to randomly browse Jweets posted by users, and the users tab can randomly browse all users.
    ![Explore](https://user-images.githubusercontent.com/47960777/135110145-72197b11-e3cd-4008-ae72-6ab22ad66226.png)

4.  Bookmark 📗

    Bookmark page has a function that allows users to bookmark if user have Jweet that they want to collect, and they can see Jweet that they bookmark at once. If they click the bookmark mark below, it will disppear from the corresponding page.

    ![Bookmark](https://user-images.githubusercontent.com/47960777/135110141-73b61a11-013c-4e71-bf56-8c8f7deb1422.png)

5.  Popluar 🌶

    The popular page is a page where user can see popluar Jweet sorted by like number from the top. So it's a page where user can collect Jweets that are currently well received.

    ![Popluar](https://user-images.githubusercontent.com/47960777/135110119-ea195241-5807-4f2c-8a35-3d537cd9a318.png)

6.  Profile

    The Profile page shows the user's information.
    ![Profile](https://user-images.githubusercontent.com/47960777/135110119-ea195241-5807-4f2c-8a35-3d537cd9a318.png)

    The user may change desired information(displayName, profile image, background image, description). In the user's profile, you can see which Jweet was posted by the person and which Jweet was displayed on.

    ![Profile_edit](https://user-images.githubusercontent.com/47960777/135110133-92ae62a8-0bea-4d10-98d4-20ebd03cc4b7.png)

### Functions

1. Search

   All Jweets and users can be searched through the Search function at the upper right. Since firebase's query does not support real-time text search, it was implemented through javascript text search.

   ![https://i.imgur.com/Xq9EU0S.png](https://i.imgur.com/Xq9EU0S.png)

   This part is just for fun, and if user enter the text 'all', it represents all the users and Jweets that currently exist.

   ![https://i.imgur.com/IUZ4jj5.png](https://i.imgur.com/IUZ4jj5.png)

2. Like

   Anyone can mark Jweet with 'Like' once.

   ![https://i.imgur.com/U4FGF6E.png](https://i.imgur.com/U4FGF6E.png)

3. Reply

   User can write reply on any Jweet. Reply, like Jweet, can enter photos and emojis.

   ![https://i.imgur.com/U4FGF6E.png](https://i.imgur.com/U4FGF6E.png)

4. Rejweet

   It has a function that can be rejweet like real Twitter. Through this, the Jweet can be quickly shared.

   ![rejweet](https://user-images.githubusercontent.com/47960777/135110119-ea195241-5807-4f2c-8a35-3d537cd9a318.png)

5. Recommend

   Originally, like Twitter, recommendation functions should be inserted with certain criteria, but there was not enough data to recommend users.

   ![https://i.imgur.com/C62bpjP.png](https://i.imgur.com/C62bpjP.png)

## part to be supplemented

- Follow
- Dark mode
- Alarm (for rejweet or reply, like)
