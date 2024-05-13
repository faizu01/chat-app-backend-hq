
# Chat Application
 
 A real-time chat app uses Socket.io for instant messaging, MongoDB for data storage, and Node.js with Express for the backend. LLM Integration using GPT API, The frontend, will be built using React,Together, these technologies enable seamless communication in real-time.


## Authors

- [@faizu01](https://www.github.com/faizu01)


## API Reference

#### Register A User

```http
  POST /api/v1/user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fullName` | `string` | **Required** |
| `email` | `string` | **Required** |
| `password` | `string` | **Required** |
| `avatar` | `string` | **** |

#### Login A User

```http
  POST /api/v1//user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. email of registered user  |
| `password`      | `string` | **Required**. password of registered user |

#### Logout User

```http
  POST /api/v1//user/logout
```



#### Update Status Of Logged In User

```http
  PUT /api/v1/user/update-status
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `status`      | `enum["BUSY,AVAILABLE"]` | **Required**. email of registered 

#### Get All User that matches regular expression

```http
  GET /api/v1/user/get-all-users?name=name-of-user
```


#### Fetch All Chat of Logged In User

```http
  GET /api/v1/chat/:auth-user
```

#### Create One-to-One Chat with another User

```http
  POST /api/v1/chat/one-to-one?userID=id-of-user-you-want-to-create-chat-with
```


#### Create Group Chat 

```http
  POST /api/v1/chat/group
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `usersId`      | `[]` | **Required**. userId of registered user  |
| `chatName`      | `string` | **Required**. Group Name |


#### Rename existing Group Chat

```PUT
  POST /api/v1/chat/group/rename
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `chatId`      | `string` | **Required**. chatId of Group chat you want to change name  |
| `newGroupName`      | `string` | **Required**. New Group Name |


#### Add User To Group Chat

```PUT
  POST /api/v1/chat/group/adduser
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `chatId`      | `string` | **Required**. chatId of Group chat | 
| `newUsersId`      | `[]` | **Required**. Array of UserID of Users you wanted to add in group | 



#### Remove User from Group Chat

```http
  PUT /api/v1/chat/group/removeuser
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. userId of users | 
| `chatId`      | `[]` | **Required**. chatId of Group chat from which you want to remove user


#### Send Message to Personal/Group Chat

```http
  POST /api/v1/message/send-message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `chatId`      | `string` | **Required**. chatId of Personal/Group chat | 
| `content`      | `[]` | **Required**. message to Send

#### Fetch all messages from Personal/Group Chat

```http
  GET /api/v1/message/:chat-id

|:-------------------------------- |



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`CORS_ORIGIN`
`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`
`REFRESH_TOKEN_SECRET`
`REFRESH_TOKEN_EXPIRY`
`OPEN_AI_API_KEY`



## Run Locally

Clone the project

```bash
  git clone https://github.com/faizu01/chat-app-backend-hq
```

Go to the project directory

```bash
  cd chatApplication
```

Go to the Backend directory

Install dependencies in backend

```bash
  npm install
```

Start the server in Backend

```bash
  npm start
```

Install dependencies in Frontend

```bash
  npm install
```

Start the server in Frontent

```bash
  npm run dev
```


## FAQ

#### Is Backend Code Complete?

Yes, Backend Code is Complete.

#### Is Frontend Code Complete

No, I am working on it.

