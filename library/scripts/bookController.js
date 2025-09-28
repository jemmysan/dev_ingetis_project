
// ==============================
// VARIABLES GLOBALES ET INITIALISATION
// ==============================

const Bibliotheque = {
    livres: [],
    utilisateurs: [],
    emprunts: [],
    prochainIdLivre: 1,
    prochainIdUtilisateur: 1,
    prochainIdEmprunt: 1,
    stockLivre: 0
};

let livreEnCoursModification = null;

// ==============================
// VARIABLES POUR LA SUPPRESSION
// ==============================

let livreASupprimerId = null;
let livreASupprimerTitre = null;


// ==============================
// INITIALISATION AU CHARGEMENT
// ==============================

document.addEventListener('DOMContentLoaded', function () {
    chargerBibliotheque();
    afficherLivres();
    mettreAJourStatistiques();
    console.log('Bibliothèque chargée:', Bibliotheque);
});

// ==============================
// GESTION DU LOCALSTORAGE
// ==============================

/**
 * Charge les données depuis le localStorage
 */
function chargerBibliotheque() {
    const data = localStorage.getItem('Bibliotheque');
    if (data) {
        try {
            const savedData = JSON.parse(data);
            Object.assign(Bibliotheque, savedData);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }
}

/**
 * Sauvegarde les données dans le localStorage
 */
function sauvegarderBibliotheque() {
    localStorage.setItem('Bibliotheque', JSON.stringify(Bibliotheque));
}

// ==============================
// FONCTIONS UTILITAIRES
// ==============================

/**
 * Affiche un message de notification
 * @param {string} text - Le texte du message
 * @param {boolean} isSuccess - true pour succès (vert), false pour erreur (rouge)
 */
function message(text, isSuccess) {
    const color = isSuccess ? 'green' : 'red';
    console.log(`%c${text}`, `color: ${color}; font-weight: bold;`);

    // Supprimer les notifications existantes
    document.querySelectorAll('.custom-notification').forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = text;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px;
                background: ${isSuccess ? '#d4edda' : '#f8d7da'};
                color: ${isSuccess ? '#155724' : '#721c24'};
                border: 1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'};
                border-radius: 5px;
                z-index: 1000;
                max-width: 400px;
            `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// ==============================
// GESTION DE LA NAVIGATION
// ==============================

/**
 * Affiche une section spécifique et cache les autres
 * @param {string} sectionId - L'ID de la section à afficher
 */
function afficherSection(sectionId) {
    // Cacher toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // Afficher la section demandée
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        section.classList.add('active');
    }

    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700');
    });
    event.target.classList.add('bg-blue-700');

    // Mettre à jour les données affichées
    if (sectionId === 'dashboard') {
        mettreAJourStatistiques();
    } else if (sectionId === 'livres') {
        afficherLivres();
    } else if (sectionId === 'utilisateurs') {
        afficherUtilisateurs();
    }
}

/**
 * Met à jour les statistiques du dashboard
 */
function mettreAJourStatistiques() {
    document.getElementById('total-livres').textContent = Bibliotheque.livres.length;
    document.getElementById('total-utilisateurs').textContent = Bibliotheque.utilisateurs.length;
    document.getElementById('total-emprunts').textContent = Bibliotheque.emprunts.filter(e => e.statut === 'actif').length;
}

// ==============================
// GESTION DES MODALS
// ==============================

/**
 * Ferme un modal
 * @param {string} modalId - L'ID du modal à fermer
 */
function fermerModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (modalId === 'modal-livre') {
        reinitialiserModalAjout();
    } else if (modalId === 'modal-utilisateur') {
        document.getElementById('form-utilisateur').reset();
    }
}

/**
 * Ouvre le modal d'ajout de livre
 */
function ouvrirModalAjoutLivre() {
    reinitialiserModalAjout();
    document.getElementById('modal-livre').classList.remove('hidden');
}

/**
 * Ouvre le modal de modification de livre
 * @param {number} id - L'ID du livre à modifier
 */
function ouvrirModalModificationLivre(id) {
    const livre = Bibliotheque.livres.find(l => l.id === id);
    if (!livre) return;

    livreEnCoursModification = livre;

    // Remplir le formulaire avec les données du livre
    document.getElementById('titre-livre').value = livre.titre;
    document.getElementById('auteur-livre').value = livre.auteur;
    document.getElementById('isbn-livre').value = livre.isbn;
    document.getElementById('annee-livre').value = livre.annee;
    document.getElementById('genre-livre').value = livre.genre;
    document.getElementById('quantite-livre').value = livre.quantiteTotal;

    // Changer le titre et le bouton du modal
    document.getElementById('titre-modal-livre').textContent = 'Modifier le Livre';
    document.getElementById('bouton-submit-livre').textContent = 'Modifier';

    document.getElementById('modal-livre').classList.remove('hidden');
}

/**
 * Réinitialise le modal en mode ajout
 */
function reinitialiserModalAjout() {
    livreEnCoursModification = null;
    document.getElementById('titre-modal-livre').textContent = 'Ajouter un Livre';
    document.getElementById('bouton-submit-livre').textContent = 'Ajouter';
    document.getElementById('form-livre').reset();
}

// ==============================
// VALIDATION DES DONNÉES
// ==============================

/**
 * Valide les données d'un livre
 * @returns {Object|boolean} Les données validées ou false si invalide
 */
function validerLivre(titre, auteur, isbn, annee, genre, quantite) {
    if (!titre || typeof titre !== 'string' || titre.trim() === '') {
        message('Le titre est obligatoire et doit être une chaîne non vide', false);
        return false;
    }

    if (!auteur || typeof auteur !== 'string' || auteur.trim() === '') {
        message('Le nom de l\'auteur est obligatoire et doit être une chaîne non vide', false);
        return false;
    }

    const isbnRegex = /^\d{3}-\d-\d{2}-\d{6}-\d$/;
    if (!isbnRegex.test(isbn)) {
        message('Format ISBN invalide. Format attendu: XXX-X-XX-XXXXXX-X', false);
        return false;
    }

    annee = parseInt(annee);
    quantite = parseInt(quantite);

    if (!annee || isNaN(annee) || annee < 0 || annee > new Date().getFullYear()) {
        message('L\'année doit être un nombre valide', false);
        return false;
    }

    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
        message('Le genre est obligatoire', false);
        return false;
    }

    if (!quantite || isNaN(quantite) || quantite <= 0) {
        message('La quantité doit être un nombre positif et au moins égale à 1', false);
        return false;
    }

    return { annee, quantite };
}


/**
 * Valide les données d'un utilisateur
 * @returns {boolean} true si valide, false si invalide
 */
function validerUtilisateur(nom, email, telephone) {
    if (!nom || typeof nom !== 'string' || nom.trim() === '') {
        message('Le nom est obligatoire', false);
        return false;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        message('L\'email est obligatoire et doit être valide', false);
        return false;
    }

    if (!telephone || typeof telephone !== 'string' || telephone.trim() === '') {
        message('Le téléphone est obligatoire', false);
        return false;
    }

    return true;
}

// ==============================
// CRUD LIVRES
// ==============================

/**
 * Ajoute un nouveau livre
 * @returns {boolean} true si succès, false si échec
 */
function ajouterLivre(titre, auteur, isbn, annee, genre, quantite) {
    const validation = validerLivre(titre, auteur, isbn, annee, genre, quantite);
    if (!validation) return false;

    const { annee: anneeValide, quantite: quantiteValide } = validation;

    // Vérifier si le livre existe déjà
    const livreExistant = Bibliotheque.livres.find(livre => livre.isbn === isbn);
    if (livreExistant) {
        message('Ce livre existe déjà', false);
        return false;
    }

    // Créer le nouveau livre
    const nouveauLivre = {
        id: Bibliotheque.prochainIdLivre,
        titre: titre.trim(),
        auteur: auteur.trim(),
        isbn: isbn,
        annee: anneeValide,
        genre: genre.trim(),
        quantiteDisponible: quantiteValide,
        quantiteTotal: quantiteValide,
        dateAjout: new Date().toISOString().split('T')[0],
        disponible: true
    };

    // Ajouter au tableau
    Bibliotheque.livres.push(nouveauLivre);
    Bibliotheque.prochainIdLivre++;
    Bibliotheque.stockLivre += quantiteValide;

    sauvegarderBibliotheque();
    message('Livre ajouté avec succès!', true);
    afficherLivres();
    mettreAJourStatistiques();

    return true;
}

/**
 * Modifie un livre existant via le formulaire
 * @returns {boolean} true si succès, false si échec
 */
function modifierLivreViaFormulaire(titre, auteur, isbn, annee, genre, quantite) {
    const validation = validerLivre(titre, auteur, isbn, annee, genre, quantite);
    if (!validation) return false;

    const { annee: anneeValide, quantite: quantiteValide } = validation;

    // Vérifier si l'ISBN existe déjà pour un autre livre
    const livreAvecMemeISBN = Bibliotheque.livres.find(livre =>
        livre.isbn === isbn && livre.id !== livreEnCoursModification.id
    );

    if (livreAvecMemeISBN) {
        message('Un livre avec cet ISBN existe déjà', false);
        return false;
    }

    // Calculer la différence de quantité
    const ancienneQuantite = livreEnCoursModification.quantiteTotal;
    const differenceQuantite = quantiteValide - ancienneQuantite;

    // Mettre à jour le livre
    livreEnCoursModification.titre = titre.trim();
    livreEnCoursModification.auteur = auteur.trim();
    livreEnCoursModification.isbn = isbn;
    livreEnCoursModification.annee = anneeValide;
    livreEnCoursModification.genre = genre.trim();
    livreEnCoursModification.quantiteTotal = quantiteValide;

    // Mettre à jour la quantité disponible
    livreEnCoursModification.quantiteDisponible += differenceQuantite;
    if (livreEnCoursModification.quantiteDisponible < 0) {
        livreEnCoursModification.quantiteDisponible = 0;
    }

    livreEnCoursModification.disponible = livreEnCoursModification.quantiteDisponible > 0;
    Bibliotheque.stockLivre += differenceQuantite;

    sauvegarderBibliotheque();
    message('Livre modifié avec succès!', true);
    afficherLivres();
    mettreAJourStatistiques();
    fermerModal('modal-livre');
    reinitialiserModalAjout();

    return true;
}

/**
 * Affiche la liste des livres
 */
function afficherLivres() {
    const container = document.getElementById("liste-livres");

    if (!Bibliotheque.livres || Bibliotheque.livres.length === 0) {
        container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">Aucun livre dans la bibliothèque</p>
                    </div>
                `;
        return;
    }

    container.innerHTML = Bibliotheque.livres.map(livre => `
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-lg font-semibold text-gray-800 truncate">${livre.titre}</h3>
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${livre.genre}</span>
                        </div>
                        
                        <p class="text-gray-600 mb-2"><i class="fas fa-user-pen text-gray-400 mr-2"></i>${livre.auteur}</p>
                        <p class="text-gray-600 mb-2"><i class="fas fa-calendar text-gray-400 mr-2"></i>${livre.annee}</p>
                        <p class="text-gray-600 mb-3"><i class="fas fa-barcode text-gray-400 mr-2"></i>${livre.isbn}</p>
                        
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-sm font-medium ${livre.quantiteDisponible > 0 ? 'text-green-600' : 'text-red-600'}">
                                <i class="fas fa-copy mr-1"></i>${livre.quantiteDisponible}/${livre.quantiteTotal} disponible(s)
                            </span>
                            <span class="text-xs px-2 py-1 rounded-full ${livre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${livre.disponible ? 'Disponible' : 'Indisponible'}
                            </span>
                        </div>
                        
                        <div class="flex space-x-2 mt-4">
                            <button onclick="emprunterLivre(${livre.id})" 
                                    class="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors ${!livre.disponible ? 'opacity-50 cursor-not-allowed' : ''}"
                                    ${!livre.disponible ? 'disabled' : ''}>
                                <i class="fas fa-hand-holding mr-1"></i>Emprunter
                            </button>
                            <button onclick="modifierLivre(${livre.id})" 
                                    class="bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="supprimerLivre(${livre.id})" 
                                    class="bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
}

// ==============================
// SUPPRESSION LIVRES
// ==============================

/**
 * Ouvre le modal de confirmation pour supprimer un livre
 * @param {number} id - L'ID du livre à supprimer
 */
function supprimerLivre(id) {
    const livre = Bibliotheque.livres.find(l => l.id === id);
    if (!livre) return;

    // Stocker les informations du livre
    livreASupprimerId = id;
    livreASupprimerTitre = livre.titre;

    // Afficher le modal de confirmation
    document.getElementById('confirmation-suppression-titre').textContent = livre.titre;
    document.getElementById('modal-confirmation-suppression').classList.remove('hidden');
}

/**
 * Confirme et exécute la suppression du livre
 */
function confirmerSuppression() {
    if (livreASupprimerId) {
        const index = Bibliotheque.livres.findIndex(livre => livre.id === livreASupprimerId);
        if (index !== -1) {
            const livre = Bibliotheque.livres[index];
            Bibliotheque.stockLivre -= livre.quantiteTotal;
            Bibliotheque.livres.splice(index, 1);
            sauvegarderBibliotheque();
            afficherLivres();
            mettreAJourStatistiques();
            message('Livre supprimé avec succès!', true);
        }
    }
    fermerModalConfirmation();
}

/**
 * Annule la suppression et ferme le modal
 */
function annulerSuppression() {
    fermerModalConfirmation();
}

/**
 * Ferme le modal de confirmation et réinitialise les variables
 */
function fermerModalConfirmation() {
    livreASupprimerId = null;
    livreASupprimerTitre = null;
    document.getElementById('modal-confirmation-suppression').classList.add('hidden');
}

// ==============================
// GESTION DES FORMULAIRES
// ==============================

/**
 * Gère la soumission du formulaire livre (ajout et modification)
 */
function ajouterLivreViaFormulaire(event) {
    event.preventDefault();

    const titreLivre = document.getElementById('titre-livre').value;
    const auteurLivre = document.getElementById('auteur-livre').value;
    const isbnLivre = document.getElementById('isbn-livre').value;
    const anneeLivre = document.getElementById('annee-livre').value;
    const genreLivre = document.getElementById('genre-livre').value;
    const quantiteLivre = document.getElementById('quantite-livre').value;

    if (livreEnCoursModification) {
        // Mode modification
        modifierLivreViaFormulaire(titreLivre, auteurLivre, isbnLivre, anneeLivre, genreLivre, quantiteLivre);
    } else {
        // Mode ajout
        if (ajouterLivre(titreLivre, auteurLivre, isbnLivre, anneeLivre, genreLivre, quantiteLivre)) {
            fermerModal('modal-livre');
            document.getElementById('form-livre').reset();
        }
    }
}



// ==============================
// FONCTIONS D'INTERFACE (À COMPLÉTER)
// ==============================

function emprunterLivre(id) {
    console.log("Emprunter livre ID:", id);
    message('Fonction d\'emprunt à implémenter', false);
}

function modifierLivre(id) {
    ouvrirModalModificationLivre(id);
}

function modifierUtilisateur(id) {
    message('Fonction de modification d\'utilisateur à implémenter', false);
}

function ouvrirModalAjoutUtilisateur() {
    document.getElementById('modal-utilisateur').classList.remove('hidden');
}

function ouvrirModalEmprunt() {
    message('Fonction d\'emprunt à implémenter', false);
}

function genererRapport() {
    message('Fonction de génération de rapport à implémenter', false);
}

function rechercherLivres() {
    message('Fonction de recherche à implémenter', false);
}

function afficherOngletEmprunts(onglet) {
    console.log("Afficher onglet:", onglet);
}