document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const spotlight = document.getElementById('spotlight');

    // Modifiez ici pour inclure les positions top/left souhaitées pour chaque mot
    const wordsToHide = [
        { text: "LOCAL", top: 50, left: 100 },   // Exemple: mot "LOCAL" à 50px du haut, 100px de la gauche
        { text: "DEVOIRS", top: 450, left: 250 }, // Exemple: mot "DEVOIRS" à 150px du haut, 250px de la gauche
        { text: "TABLE", top: 750, left: 80 }    // Exemple: mot "TABLE" à 250px du haut, 80px de la gauche
        // Ajoutez d'autres mots avec leurs positions ici
    ];

    // Ces constantes ne sont plus utilisées pour le placement si les positions sont prédéfinies,
    // mais la fonction areRectsTooClose peut toujours être utile pour d'autres logiques si besoin.
    // const MIN_DISTANCE_BETWEEN_WORDS = 50;
    // const MAX_PLACEMENT_ATTEMPTS = 100;

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

        const areaRect = gameArea.getBoundingClientRect(); // Dimensions de la zone de jeu

        wordsToHide.forEach(wordObject => {
            const wordElement = document.createElement('span');
            wordElement.classList.add('hidden-word');
            wordElement.textContent = wordObject.text;

            // Appliquer les positions prédéfinies
            // Assurez-vous que les positions sont valides et à l'intérieur de gameArea si nécessaire
            // Pour l'instant, nous appliquons directement les valeurs fournies.

            // Il est toujours bon de s'assurer que les coordonnées sont des nombres
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

            // Optionnel : vérifier si les mots prédéfinis se chevauchent (à titre informatif)
            // Si vous voulez cette vérification, vous devrez stocker les rectangles des mots placés
            // et utiliser areRectsTooClose. Pour l'instant, nous faisons confiance aux positions prédéfinies.
            /*
            const wordBCR = wordElement.getBoundingClientRect();
            const currentWordRect = {
                top: topPos, // ou wordBCR.top - areaRect.top si vous voulez les coordonnées relatives après placement
                left: leftPos, // ou wordBCR.left - areaRect.left
                right: leftPos + wordBCR.width,
                bottom: topPos + wordBCR.height
            };
            // ... puis comparer avec les autres mots placés si vous tenez un tableau `placedWordRects`
            */
        });
    }

    function updateSpotlight(x, y) {
        if (!spotlight) {
            console.error("L'élément #spotlight est introuvable.");
            return;
        }
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
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