# Webproject - MindBreaker

## Mindbreaker
MindBreaker is a website for solving and creating challenges/riddles and gaining points in doing so. It features
 - A simple login system
 - Profile editing with cutom images and banner
 - Challenge Creator/Editor
 - Challenges have tags, difficultylevels and categories by which tey can be sorted
 - A simple pointsystem that rewards users for solving and creating challenges

## Be careful
This is just a simple test project and should not be used for anything other than fun and testing. Passwords are hashed saltless with MD5, the RSA key for the webtoken is publicly available and there most definitely are some bugs.

## Installation
This installation guide was tested for Ubuntu based systems but can be, with some minor changes, applied to others and Windows as well.

1. Install NodeJS, instructions are provided here: 
https://nodejs.dev/learn/how-to-install-nodejs/

1. Clone the GitHub repo or download the zip 
`git clone https://github.com/idontwannachooseanotherusername/KrassesWebprojekt.git`

2. Run `npm install` to intall all required node modules

3. `cd webtoken` and `npm install` to intall all required node modules for the JSON webtoken

3. `cd ..` and `npm start` to start frontend and backend

4. Open your browser and navigate to http://localhost:8002  
(the backend uses port 8001, the frontend port 8002)
