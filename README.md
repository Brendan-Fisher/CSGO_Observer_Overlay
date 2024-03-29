# CSGO Observer Overlay

Custom overlay for CSGO Casters and Observers which uses an Express API and a React Frontend

[Check the new repository
](https://github.com/zachtyson/uf_csgo_observer_overlay)
## Project Setup

- Clone repo
- In root directory:
  - ```npm install```
  - ```npm run client-install```
  - ```npm install -g sass```   
- Unzip ```Bolotobserv.zip``` for custom radar
- Put ```gamestate_integration_observer.cfg``` in your CSGO cfg folder

## Startup

- Launch CSGO
- In root directory:
  - ```npm run dev``` (Runs client and server concurrently in same terminal)
  - **OR**
  - ```npm run server``` & ```npm run client``` (Each command in a separate terminal, easier to keep track of console logging)
- Under the config shortcut (or \client\sfc\config):
  - Modify config.json, replace AAA with name of team one (team starting CT side)
  - Replace BBB with name of team two (team starting T side)
  - replace teamOneLogo.png with logo of team one, giving it the same file name and extension
  - replace teamTwoLogo.png with logo of team two, giving it the same file name and extension
- Run ```Boltobserv.exe``` for custom minimap
- Join CSGO match as spectator
  - Run ```cl_draw_only_deathnotices 1``` in console to get rid of default HUD

## OBS Setup

- Make Browser Source for Minimap with URL ```http://127.0.0.1:36364``` and width/height ```600```. Make sure to clear the Custom CSS box. 
- Make Browser Source for Custom HUD with URL ```http://localhost:3000/``` and width/height ```1920x1080```.
- Make Game Capture for CSGO
- At halftime, when teams switch, click on the browser source, select 'interact' and press tilde ` to switch the sides and logos if needed
