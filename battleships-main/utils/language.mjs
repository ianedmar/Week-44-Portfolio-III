const translations = {
    en: {
        shipPlacementPhase: "Ship Placement Phase",
        controls: {
            moveCursor: "Arrow keys: Move cursor",
            rotateShip: "R: Rotate ship",
            placeShip: "Enter: Place ship"
        },
        shipsToPlace: "Ships to place",
        status: {
            placed: "✓",
            current: ">",
            notYetPlaced: " "
        }
    },
    es: {
        shipPlacementPhase: "Fase de colocación de barcos",
        controls: {
            moveCursor: "Teclas de flecha: Mover cursor",
            rotateShip: "R: Rotar barco",
            placeShip: "Enter: Colocar barco"
        },
        shipsToPlace: "Barcos a colocar",
        status: {
            placed: "✓",
            current: ">",
            notYetPlaced: " "
        }
    }
};

let currentLanguage = 'en';  

function setLanguage(language) {
    if (translations[language]) {
        currentLanguage = language;
    } else {
        console.error("Language not supported:", language);
    }
}

function getTranslation(key) {
    const keys = key.split('.');
    let translation = translations[currentLanguage];

    keys.forEach(k => {
        if (translation) {
            translation = translation[k];
        }
    });

    return translation || key; 
}

export { setLanguage, getTranslation };
