// ==============================
// VARIABLES POUR LA GESTION UTILISATEUR
// ==============================

let utilisateurASupprimerId = null;
let utilisateurASupprimerNom = null;
let utilisateurEnCoursModification = null;



// =====================================
// Chargements des des utilisateurs
//====================================

document.addEventListener('DOMContentLoaded', ()=>{
    chargerUtilisateur();
    afficherUtilisateurs();
})

function chargerUtilisateur (){
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

// ==============================
// GESTION DES MODALS UTILISATEUR
// ==============================

/**
 * Ouvre le modal d'ajout d'utilisateur
 */
function ouvrirModalAjoutUtilisateur() {
    reinitialiserModalAjoutUtilisateur();
    document.getElementById('modal-utilisateur').classList.remove('hidden');
}

/**
 * Ouvre le modal de modification d'utilisateur
 * @param {number} id - L'ID de l'utilisateur à modifier
 */
function ouvrirModalModificationUtilisateur(id) {
    const utilisateur = Bibliotheque.utilisateurs.find(u => u.id === id);
    if (!utilisateur) return;

    utilisateurEnCoursModification = utilisateur;

    // Remplir le formulaire avec les données de l'utilisateur
    document.getElementById('nom-utilisateur').value = utilisateur.nom;
    document.getElementById('email-utilisateur').value = utilisateur.email;
    document.getElementById('telephone-utilisateur').value = utilisateur.telephone;

    // Changer le titre et le bouton du modal
    document.getElementById('titre-modal-utilisateur').textContent = 'Modifier l\'Utilisateur';
    document.getElementById('bouton-submit-utilisateur').textContent = 'Modifier';

    document.getElementById('modal-utilisateur').classList.remove('hidden');
}

/**
 * Réinitialise le modal en mode ajout
 */
function reinitialiserModalAjoutUtilisateur() {
    utilisateurEnCoursModification = null;
    document.getElementById('titre-modal-utilisateur').textContent = 'Ajouter un Utilisateur';
    document.getElementById('bouton-submit-utilisateur').textContent = 'Ajouter';
    document.getElementById('form-utilisateur').reset();
}

// ==============================
// VALIDATION UTILISATEUR
// ==============================

/**
 * Valide les données d'un utilisateur
 * @returns {boolean} true si valide, false si invalide
 */
function validerUtilisateur(nom, email, telephone) {
    if (!nom || typeof nom !== 'string' || nom.trim() === '') {
        message('Le nom de l\'utilisateur est obligatoire', false);
        return false;
    }

    if (!email || typeof email !== 'string') {
        message('L\'adresse mail est requise', false);
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        message('Le format de l\'adresse mail est incorrect', false);
        return false;
    }

    if (!telephone || typeof telephone !== 'string') {
        message('Le numéro de téléphone est obligatoire', false);
        return false;
    }

    const cleanTel = telephone.trim();
    const regexMobileFR = /^(?:(?:\+|00)33|0)[67]\s*(?:\d{2}\s*){4}$/;
    
    if (!regexMobileFR.test(cleanTel)) {
        message('Le format du téléphone est incorrect. Format attendu: +33 6 12 34 56 78 ou 06 12 34 56 78', false);
        return false;
    }

    return true;
}

// ==============================
// CRUD UTILISATEURS
// ==============================

/**
 * Ajoute un nouvel utilisateur
 * @returns {boolean} true si succès, false si échec
 */
function ajouterUtilisateur(nom, email, telephone) {
    if (!validerUtilisateur(nom, email, telephone)) {
        return false;
    }

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = Bibliotheque.utilisateurs.find(u => u.email === email);
    if (utilisateurExistant) {
        message('Un utilisateur avec cet email existe déjà', false);
        return false;
    }

    // Créer le nouvel utilisateur
    const nouvelUtilisateur = {
        id: Bibliotheque.prochainIdUtilisateur,
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        dateInscription: new Date().toISOString().split('T')[0],
        empruntsEnCours: 0
    };

    // Ajouter au tableau
    Bibliotheque.utilisateurs.push(nouvelUtilisateur);
    Bibliotheque.prochainIdUtilisateur++;

    sauvegarderBibliotheque();
    message('Utilisateur ajouté avec succès!', true);
    afficherUtilisateurs();
    mettreAJourStatistiques();

    return true;
}

/**
 * Modifie un utilisateur existant via le formulaire
 * @returns {boolean} true si succès, false si échec
 */
function modifierUtilisateurViaFormulaire(nom, email, telephone) {
    if (!validerUtilisateur(nom, email, telephone)) {
        return false;
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const utilisateurAvecMemeEmail = Bibliotheque.utilisateurs.find(utilisateur => 
        utilisateur.email === email && utilisateur.id !== utilisateurEnCoursModification.id
    );

    if (utilisateurAvecMemeEmail) {
        message('Un utilisateur avec cet email existe déjà', false);
        return false;
    }

    // Mettre à jour l'utilisateur
    utilisateurEnCoursModification.nom = nom.trim();
    utilisateurEnCoursModification.email = email.trim();
    utilisateurEnCoursModification.telephone = telephone.trim();

    sauvegarderBibliotheque();
    message('Utilisateur modifié avec succès!', true);
    afficherUtilisateurs();
    fermerModal('modal-utilisateur');
    reinitialiserModalAjoutUtilisateur();

    return true;
}

/**
 * Affiche la liste des utilisateurs
 */
function afficherUtilisateurs() {
    const container = document.getElementById("corps-tableau-utilisateurs");

    if (!Bibliotheque.utilisateurs || Bibliotheque.utilisateurs.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    <i class="fas fa-users text-2xl text-gray-300 mb-2 block"></i>
                    Aucun utilisateur inscrit
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = Bibliotheque.utilisateurs.map(utilisateur => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">${utilisateur.nom}</td>
            <td class="px-6 py-4">${utilisateur.email}</td>
            <td class="px-6 py-4">${utilisateur.telephone}</td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button onclick="modifierUtilisateur(${utilisateur.id})" 
                            class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="supprimerUtilisateur(${utilisateur.id})" 
                            class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==============================
// SUPPRESSION UTILISATEURS
// ==============================

/**
 * Ouvre le modal de confirmation pour supprimer un utilisateur
 * @param {number} id - L'ID de l'utilisateur à supprimer
 */
function supprimerUtilisateur(id) {
    const utilisateur = Bibliotheque.utilisateurs.find(u => u.id === id);
    if (!utilisateur) return;

    // Vérifier si l'utilisateur a des emprunts en cours
    const empruntsActifs = Bibliotheque.emprunts.filter(e => 
        e.utilisateurId === id && e.statut === 'actif'
    );

    if (empruntsActifs.length > 0) {
        message('Impossible de supprimer cet utilisateur : il a des emprunts en cours', false);
        return;
    }

    // Stocker les informations de l'utilisateur
    utilisateurASupprimerId = id;
    utilisateurASupprimerNom = utilisateur.nom;

    // Afficher le modal de confirmation
    document.getElementById('confirmation-suppression-utilisateur-titre').textContent = utilisateur.nom;
    document.getElementById('modal-confirmation-suppression-utilisateur').classList.remove('hidden');
}

/**
 * Confirme et exécute la suppression de l'utilisateur
 */
function confirmerSuppressionUtilisateur() {
    if (utilisateurASupprimerId) {
        const index = Bibliotheque.utilisateurs.findIndex(u => u.id === utilisateurASupprimerId);
        if (index !== -1) {
            Bibliotheque.utilisateurs.splice(index, 1);
            sauvegarderBibliotheque();
            afficherUtilisateurs();
            mettreAJourStatistiques();
            message('Utilisateur supprimé avec succès!', true);
        }
    }
    fermerModalConfirmationUtilisateur();
}

/**
 * Annule la suppression de l'utilisateur
 */
function annulerSuppressionUtilisateur() {
    fermerModalConfirmationUtilisateur();
}

/**
 * Ferme le modal de confirmation utilisateur
 */
function fermerModalConfirmationUtilisateur() {
    utilisateurASupprimerId = null;
    utilisateurASupprimerNom = null;
    document.getElementById('modal-confirmation-suppression-utilisateur').classList.add('hidden');
}

// ==============================
// GESTION DES FORMULAIRES UTILISATEUR
// ==============================

/**
 * Gère la soumission du formulaire utilisateur (ajout et modification)
 */
function ajouterUtilisateurViaFormulaire(event) {
    event.preventDefault();

    const nomUtilisateur = document.getElementById('nom-utilisateur').value;
    const emailUtilisateur = document.getElementById('email-utilisateur').value;
    const telephoneUtilisateur = document.getElementById('telephone-utilisateur').value;

    if (utilisateurEnCoursModification) {
        // Mode modification
        modifierUtilisateurViaFormulaire(nomUtilisateur, emailUtilisateur, telephoneUtilisateur);
    } else {
        // Mode ajout
        if (ajouterUtilisateur(nomUtilisateur, emailUtilisateur, telephoneUtilisateur)) {
            fermerModal('modal-utilisateur');
            document.getElementById('form-utilisateur').reset();
        }
    }
}

// ==============================
// FONCTION MODIFICATION UTILISATEUR
// ==============================

function modifierUtilisateur(id) {
    ouvrirModalModificationUtilisateur(id);
}

// ==============================
// MODIFICATION DE LA FONCTION FERMERMODAL
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
        reinitialiserModalAjoutUtilisateur();
    }
}