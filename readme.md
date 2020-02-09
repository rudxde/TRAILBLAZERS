# Commands

All commands can be executed over npm. Just use ```npm run <command>```

Available commands:

| Command                | Description                                                 |
|------------------------|-------------------------------------------------------------|
| help                   | Logs help for                                               |
| start                  | starts the app.                                             |
| start:debug            | starts the app with modified config, to debug frontend.     |
| stop                   | stops all running containers.                               |
| install                | Installs all dependencies.                                  |
| setup                  | Runs the setup container.                                   |
| setup:all              | Sets the complete environment up.                           |
| typedoc                | Generates the typedoc documentation.                        |
| install-apps           | Installs the node dependencies for all apps.                |
| update-apps            | Updates the dependencies from all apps.                     |
| build                  | Builds all apps.                                            |
| build-lib-images       | Builds the images, which are required for the containers.   |
| build:prod             | Builds app apps in the production configuration.            |
| lint                   | Lints all apps.                                             |
| lint:fix               | Lints all apps with autoFix enabled.                        |
| download-map-template  | Downloads the template for the database of the map service. |
| download-tour-template | Downloads the hiking tour template for hike-service.        |

# Build


```
cd interfaces
npm run build
cd ../frontend
npm run build:prod
```


# start docker
run setup
```
npm run setup
```

start all containers:
```
npm run start
```
rebuild containers:
```
npm run compose -- up [--force-recreate] --build <container>
npm run compose -- restart proxy
```


# Test frontend
```
cd frontend
npm start
```

# Api-endpoints:
```
/api
    /v1
        /auth                       (GET): returns auth status 🗸
            /login                  (PUT - {login, password}): returns Auth token 🗸
            /logout                 (GET- Auth): deletes the token from the database and makes it un-refreshable 🗸
            /register               (POST - ApiAuth, {userid, login, password}) adds an login and returns Auth token 🗸
            /password               (PATCH - Auth, {oldpassword, newpassword}): changes the password 🗸
            /update-login           (PATCH - ApiAuth, {userId, login}): updates the login 🗸
            /token
                /verify             (GET - Auth): return 200 if user is Authenticated 🗸
                /refresh            (GET - Auth): returns new authtoken 🗸
        /hikes                      (GET): returns hikes status 🗸
            /recommender            (GET - Auth): returns a list of hike reccomentadtions for the loggedin user
            /search                 (GET  - IHikeSearchQuery): returns the ids of hikes matching the search query
            /{id}                   (GET): returns the hike with the given id 🗸
        /user                       (GET): returns user status 🗸
            /register               (POST): registers a new user and returns a auth token 🗸
            /friends                (GET - Auth): returns a list of user-id's from all friends
                /{id}               (POST - Auth): adds the user with id to the friends list
                /{id}               (DELETE - Auth): adds the user with id to the friends list
            /search
                /{query}            (GET - Auth): returns the user-ids whom match the search-query
            /me                     (GET - Auth): returns the profile of theauthenticated user 🗸
            /me                     (PATCH - Auth, {userProfile}): updates the user-profie 🗸
            /{id}                   (GET - Auth): return the userprofile ot user with the reuqsted id 🗸
            /submit-report          (POST - Auth, IHikeReport): Stores an hiking report
        /map                        (GET): returns map status 🗸
            /chunk                  (PUT - chunkIds): returns nodes and ways for all requested chunks 🗸
                /{chunkid}          (GET - chunkId): returns nodes and ways from the requested chunk 🗸
        /weather
            /{city}                 (GET): returns weather status of the parameter city 🗸
```