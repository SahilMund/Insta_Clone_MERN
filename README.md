
# Instagram

## <u>MERN heroku deploy</u> :-

###   For the deployment we have two options :-

*   We can deploy all the node js codes (backend)and only the build folder(frontend inside client folder).

*   We serve our whole folder and let heroku  genearte the build first .



<strong>But first option  has some drawbacks as when we change the code locally we have to recreate our build folder for all updation. So, this is not a good approach.Here we are going to use the 2nd option.</strong>


####    Setiing up files:-

1. Move all the react files inside the client folder.
2. Add the clinet folder in the server(i.e. node js ) folder.
3.  type in terminal :-
```
cd client
npm run build
```
<strong>npm run build will converts all our react files into static html file</strong>

<br>
4.  We can't make the port static so we need to change it first from our nodejs server file

```
const port = process.env.PORT || 5000;
```

5.  Then we have to serve our static files(i.e. build folder) into production mode
```
if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
}
```

6.  Now if user makes any request to the server, then we will serve index.html file in production mode
(write the below code in server nodejs file before listening to the server)

```
if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirrname,"client","build","index.html"))
    })
}
```

7. Now make a config folder and move all the keys files into it.

8. Create prod.js and dev.js inside the config folder.

9.  Now move your key.js file content to dev.js :-
So , now  we are gonna create this environment variables in heroku

<prod.js>

```
module.exports = {
    mongoURI: process.env.MONGOURI,
    JWT_SECRET:process.env.JWT_SECRET
}
```


<key.js>

```
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}

```

10.  Now we are gonna tell heroku to deploy the build folder by writing the following into the package.json of nodejs server

*   NPM_CONFIG_PRODUCTION=false : - this command ensure that our commands run in production site.
*   npm install --prefix client :- before build the files we need to install all the dependencies inside the client pacakge.json folder.
*   npm run build --prefix client" :- to run npm run build in client folder
	
```
  "scripts": {
    "start":"node index.js",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
  },
```

11.  Now remove {"proxy": "http://localhost:5000",} this from client/package.json file. As now we are gonna deploy to heroku so our both react and nodejs server runs on same server so no need for proxy.


12. Now go to heroku and signin / signup and then create an app .

13. delete any .git folder if u have any

14. type in terminal (if heroku cli is already installed)
```
    heroku login
	git init
	git add .
	heorku git:remote -a <your app name>
	git commit -m "first commit"
	git push heroku master
	heroku logs
```
<strong>heroku logs(if any error comes then check it out)</strong>

15. Now set the environment variables in heroku app in settings.

16. Now ur app is ready and deployed successfully.



