import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { setLanguage, getTranslation } from "./utils/language.mjs"; 

const MAIN_MENU_ITEMS = buildMenu();

const GAME_FPS = 1000 / 60; 
let currentState = null;    
let gameLoop = null;        

let mainMenuScene = null;

(function initialize() {
    print(ANSI.HIDE_CURSOR);
    clearScreen();
    mainMenuScene = createMenu(MAIN_MENU_ITEMS);
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen  
    gameLoop = setInterval(update, GAME_FPS); 
})();

function update() {
    currentState.update(GAME_FPS);
    currentState.draw(GAME_FPS);
    if (currentState.transitionTo != null) {
        currentState = currentState.next;
        print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    }
}

function buildMenu() {
    let menuItemCount = 0;
    return [
        {
            text: getTranslation("menu.startGame"), id: menuItemCount++, action: function () { 
                clearScreen();
                let innbetween = createInnBetweenScreen();
                innbetween.init(getTranslation("shipPlacement.firstPlayerReady"), () => {

                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {

                        let innbetween = createInnBetweenScreen();
                        innbetween.init(getTranslation("shipPlacement.secondPlayerReady"), () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                return createBattleshipScreen(player1ShipMap, player2ShipMap);
                            })
                            return p2map;
                        });
                        return innbetween;
                    });

                    return p1map;

                }, 3);
                currentState.next = innbetween;
                currentState.transitionTo = "Map layout";
            }
        },
        { text: getTranslation("menu.exitGame"), id: menuItemCount++, action: function () { 
            print(ANSI.SHOW_CURSOR); 
            clearScreen(); 
            process.exit(); 
        }},
        {
            text: getTranslation("menu.languageSelect"), id: menuItemCount++, action: function () {
                
          const selectedLang = prompt(getTranslation("menu.selectLanguage"));

                setLanguage(selectedLang);  
                print(getTranslation("menu.languageChanged"));
                clearScreen();
                mainMenuScene = createMenu(MAIN_MENU_ITEMS);
                SplashScreen.next = mainMenuScene;
                currentState = SplashScreen;
            }
        },
    ];
}
