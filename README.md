# Webproject - MindBreaker

## Mindbreaker
MindBreaker is a website for solving and creating challenges/riddles and gaining points in doing so. It features:
 - A simple reqister/login system
 - Profile editing with custom images and banner
 - Challenge Creator/Editor
 - Challenges have tags, difficultylevels and categories by which they can be sorted
 - A simple pointsystem that rewards users for solving and creating challenges

## Be careful
This is just a simple test project and should not be used for anything other than fun and testing. Passwords are hashed saltless with MD5, the RSA key for the webtoken is publicly available, the node version is way too old and there most definitely are some bugs.

## Installation
This installation guide was only tested for Ubuntu based systems! It should work on Windows but could throw unexpected errors.

1. Ubuntu: Install NodeJS `sudo apt install nodejs`  
Win: Download and install NodeJS from https://nodejs.org/en/blog/release/v12.10.0/ (tick the box to install Chocolatery)

2. Ubuntu: Install node version 12.10 `nvm install v12.10` and `nvm use v12.10`  
Win: not needed

3. Clone the GitHub repo or download the zip 
`git clone https://github.com/idontwannachooseanotherusername/KrassesWebprojekt.git`

4. If not already done so, open terminal: `cd KrassesWebprojekt` and `npm install` to intall all required node modules

5. `cd webtoken` and `npm install` to intall all required node modules for the JSON webtoken

6. `cd ..` and `npm start` to start frontend and backend

7. Open your browser and navigate to http://localhost:8002 (the backend api uses port 8001)
