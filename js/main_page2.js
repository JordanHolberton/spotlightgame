document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const spotlight = document.getElementById('spotlight');

    // --- Configuration du Spotlight ---
    // Remplacez ces valeurs par les dimensions réelles de votre #spotlight en CSS
    const SPOTLIGHT_WIDTH = 100; // Largeur du spotlight en pixels
    const SPOTLIGHT_HEIGHT = 100; // Hauteur du spotlight en pixels
    // Nouvelle constante : de combien de pixels le CENTRE du halo doit être AU-DESSUS du doigt.
    const CENTER_Y_OFFSET_ABOVE_FINGER = 30; // Par exemple, 30px au-dessus. Ajustez selon vos besoins.

    // Calcul des décalages
    // Pour le centrage horizontal : décaler de la moitié de la largeur du spotlight.
    const spotlightOffsetX = SPOTLIGHT_WIDTH / 2;
    // Pour le positionnement vertical :
    // Le 'top' du spotlight doit être y_doigt - (hauteur_demi_spotlight + decalage_centre_au_dessus_doigt)
    const spotlightOffsetY = (SPOTLIGHT_HEIGHT / 2) + CENTER_Y_OFFSET_ABOVE_FINGER;
    // --- Fin de la configuration du Spotlight ---

    // MODIFIEZ CETTE LISTE POUR LA PAGE 2
    const wordsToHide = [
        { text: "LOCAL", top: 70, left: 120 },
        { text: "PORTE-MANTEAU", top: 400, left: 250 },
        { text: "CASIER", top: 700, left: 150 }
        // Ajoutez d'autres mots et positions pour la page 2
    ];

    /**
     * Vérifie si deux rectangles sont trop proches, en considérant une séparation minimale.
     * @param {object} rect1 - Le premier rectangle {top, left, right, bottom}.
     * @param {object} rect2 - Le deuxième rectangle {top, left, right, bottom}.
     * @param {number} minSeparation - La séparation minimale requise entre les rectangles.
     * @returns {boolean} - True si les rectangles sont trop proches, sinon false.
     */
    function areRectsTooClose(rect1, rect2, minSeparation) {
        const horizontalConflict = (rect1.left < rect2.right + minSeparation) && (rect1.right > rect2.left - minSeparation);
        const verticalConflict = (rect1.top < rect2.bottom + minSeparation) && (rect1.bottom > rect2.top - minSeparation);
        return horizontalConflict && verticalConflict;
    }

    function createHiddenWords() {
        if (!gameArea) {
            console.error("L'élément #game-area est introuvable.");
            return;
        }

        const areaRect = gameArea.getBoundingClientRect();

        wordsToHide.forEach(wordObject => {
            const wordElement = document.createElement('span');
            wordElement.classList.add('hidden-word');
            wordElement.textContent = wordObject.text;

            const topPos = parseFloat(wordObject.top);
            const leftPos = parseFloat(wordObject.left);

            if (isNaN(topPos) || isNaN(leftPos)) {
                console.warn(`Positions invalides pour le mot "${wordObject.text}". Positionnement au centre par défaut.`);
                wordElement.style.top = `50%`;
                wordElement.style.left = `50%`;
                wordElement.style.transform = `translate(-50%, -50%)`;
            } else {
                wordElement.style.top = `${topPos}px`;
                wordElement.style.left = `${leftPos}px`;
            }
            gameArea.appendChild(wordElement);
        });
    }


    function updateSpotlight(x, y) {
        if (!spotlight) {
            console.error("L'élément #spotlight est introuvable.");
            return;
        }

        const finalX = x - spotlightOffsetX; // Centre horizontalement
        const finalY = y - spotlightOffsetY; // Positionne verticalement comme calculé

        spotlight.style.left = `${finalX}px`;
        spotlight.style.top = `${finalY}px`;
        spotlight.style.display = 'block';
    }

    if (gameArea && spotlight) {
        gameArea.addEventListener('mousemove', (e) => {
            const rect = gameArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateSpotlight(x, y);
        });

        gameArea.addEventListener('mouseleave', () => {
            spotlight.style.display = 'none';
        });

        gameArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = gameArea.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            updateSpotlight(x, y);
        }, { passive: false });

        gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = gameArea.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            updateSpotlight(x, y);
        }, { passive: false });

        gameArea.addEventListener('touchend', () => {
            spotlight.style.display = 'none';
        });

        gameArea.addEventListener('touchcancel', () => {
            spotlight.style.display = 'none';
        });

        createHiddenWords();
    } else {
        console.error("Impossible d'initialiser le jeu : #game-area ou #spotlight manquant.");
    }
});