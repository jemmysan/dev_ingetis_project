// Configuration Supabase
const SUPABASE_URL = "https://qhjxfdsbnvswaqxwhfwc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoanhmZHNibnZzd2FxeHdoZndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjU2MTYsImV4cCI6MjA3NDY0MTYxNn0.tkDaJvOmKeMM_DYqgqzO0aI-3pSeqzTOEs3KPk1uuKw";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// État de l'application
let currentUser = null;
let currentUserProfile = null;
let users = [];
let userToDelete = null;
let userToEdit = null;
let isEditingProfile = false;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();

    // Gestionnaires d'événements pour la navigation
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);

            // Mise à jour de la navigation active
            document.querySelectorAll('.page-link').forEach(navLink => {
                navLink.classList.remove('nav-active', 'text-indigo-700', 'border-indigo-500');
                navLink.classList.add('text-gray-500', 'border-transparent');
            });

            this.classList.add('nav-active', 'text-indigo-700', 'border-indigo-500');
            this.classList.remove('text-gray-500', 'border-transparent');
        });
    });

    // Gestionnaires pour les boutons
    document.getElementById('add-user-btn').addEventListener('click', showAddUserModal);
    document.getElementById('cancel-user-btn').addEventListener('click', hideUserModal);
    document.getElementById('cancel-delete-btn').addEventListener('click', hideDeleteModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', confirmDeleteUser);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Gestionnaires pour les formulaires
    document.getElementById('user-form').addEventListener('submit', handleUserFormSubmit);
    document.getElementById('profile-form').addEventListener('submit', handleProfileFormSubmit);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Navigation entre login et register
    document.getElementById('show-register').addEventListener('click', function (e) {
        e.preventDefault();
        showPage('register');
    });

    document.getElementById('show-login').addEventListener('click', function (e) {
        e.preventDefault();
        showPage('login');
    });

    // Recherche d'utilisateurs
    document.getElementById('search-users').addEventListener('input', filterUsers);

    // Initialiser les événements de la page profil
    initProfilePage();
});

// Initialiser les événements pour la page profil
function initProfilePage() {
    // Bouton modifier
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', enableProfileEditing);
    }
    
    // Bouton annuler
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', disableProfileEditing);
    }
}

// Activer le mode édition
function enableProfileEditing() {
    isEditingProfile = true;
    console.log('🔓 Activation du mode édition');
    
    // Activer les champs de saisie
    const inputs = document.querySelectorAll('#profile-form input, #profile-form textarea');
    inputs.forEach(input => {
        // Ne pas activer l'email pour les utilisateurs normaux
        if (input.id === 'profile-email' && currentUserProfile?.role !== 'admin') {
            return; // Garder l'email en lecture seule pour les non-admins
        }
        
        input.readOnly = false;
        input.classList.remove('bg-gray-50', 'cursor-not-allowed');
        input.classList.add('bg-white', 'cursor-text');
    });
    
    // Masquer le bouton "Modifier"
    document.getElementById('edit-profile-btn').classList.add('hidden');
    
    // Afficher les boutons d'action du formulaire
    document.getElementById('profile-form-actions').classList.remove('hidden');
    
    // Donner le focus au premier champ modifiable
    document.getElementById('profile-username').focus();
}

// Désactiver le mode édition
function disableProfileEditing() {
    isEditingProfile = false;
    console.log('🔒 Désactivation du mode édition');
    
    // Désactiver les champs de saisie
    const inputs = document.querySelectorAll('#profile-form input, #profile-form textarea');
    inputs.forEach(input => {
        // Pour l'email des utilisateurs normaux, garder en lecture seule
        if (input.id === 'profile-email' && currentUserProfile?.role !== 'admin') {
            input.readOnly = true;
            input.classList.add('bg-gray-50', 'cursor-not-allowed');
            input.classList.remove('bg-white', 'cursor-text');
        } else {
            input.readOnly = true;
            input.classList.remove('bg-white', 'cursor-text');
            input.classList.add('bg-gray-50', 'cursor-not-allowed');
        }
    });
    
    // Afficher le bouton "Modifier"
    document.getElementById('edit-profile-btn').classList.remove('hidden');
    
    // Masquer les boutons d'action du formulaire
    document.getElementById('profile-form-actions').classList.add('hidden');
    
    // Recharger les données originales (annuler les modifications non sauvegardées)
    loadProfileData();
}

// Charger les données dans le formulaire
function loadProfileData() {
    if (!currentUserProfile) return;
    
    console.log('📝 Chargement des données dans le formulaire profil');
    
    document.getElementById('profile-username').value = currentUserProfile.username || '';
    document.getElementById('profile-email').value = currentUserProfile.email || '';
    document.getElementById('profile-bio').value = currentUserProfile.bio || '';
}

// Configurer la page profil
function setupProfilePage() {
    if (!currentUserProfile) {
        console.log('⚠️  Aucun profil utilisateur pour configurer la page profil');
        return;
    }
    
    console.log('⚙️  Configuration de la page profil');
    
    // Charger les données
    loadProfileData();
    
    // S'assurer que le mode édition est désactivé
    disableProfileEditing();
}

// Initialisation de l'application
async function initializeApp() {
    console.log('Initialisation de l\'application...');
    
    // Vérifier si l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session);

    if (session) {
        currentUser = session.user;
        console.log('Utilisateur connecté:', currentUser);
        
        await loadUserProfile();
        setupAuthenticatedUI();
        showPage('dashboard');
    } else {
        console.log('Aucun utilisateur connecté');
        showPage('login');
    }
}

// Configurer l'interface pour un utilisateur connecté
function setupAuthenticatedUI() {
    // Afficher la navigation
    document.getElementById('main-nav').classList.remove('hidden');

    // Mettre à jour le message de bienvenue
    document.getElementById('user-greeting').textContent = `Bonjour, ${currentUserProfile?.username || currentUser.email}`;

    // Afficher le lien admin si l'utilisateur est admin
    if (currentUserProfile?.role === 'admin') {
        document.getElementById('admin-users-link').classList.remove('hidden');
        document.getElementById('admin-users-link').addEventListener('click', function (e) {
            e.preventDefault();
            showPage('admin-users');
            loadUsers();
        });
    } else {
        // S'assurer que le lien admin est caché pour les utilisateurs normaux
        document.getElementById('admin-users-link').classList.add('hidden');
    }

    // Mettre à jour le tableau de bord
    updateDashboard();
}

// Charger le profil de l'utilisateur connecté - VERSION CORRIGÉE
async function loadUserProfile() {
    console.log('Chargement du profil pour:', currentUser.id);
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (error) {
            console.error('Erreur lors du chargement du profil:', error);
            
            // Si le profil n'existe pas, créons-le
            if (error.code === 'PGRST116') {
                console.log('Profil non trouvé, création...');
                return await createUserProfile();
            }
            
            showToast('Erreur lors du chargement du profil', 'error');
            return null;
        }

        console.log('Profil chargé:', data);
        
        // L'email est déjà disponible dans currentUser.email
        currentUserProfile = {
            ...data,
            email: currentUser.email
        };

        return currentUserProfile;
    } catch (error) {
        console.error('Erreur générale lors du chargement du profil:', error);
        showToast('Erreur lors du chargement du profil', 'error');
        return null;
    }
}

// Créer un profil utilisateur s'il n'existe pas
async function createUserProfile() {
    console.log('Création d\'un nouveau profil...');
    
    try {
        const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0];
        
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                id: currentUser.id,
                username: username,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de la création du profil:', error);
            showToast('Erreur lors de la création du profil', 'error');
            return null;
        }

        console.log('Profil créé avec succès:', data);
        
        currentUserProfile = {
            ...data,
            email: currentUser.email
        };

        showToast('Profil créé avec succès', 'success');
        return currentUserProfile;
    } catch (error) {
        console.error('Erreur générale lors de la création du profil:', error);
        showToast('Erreur lors de la création du profil', 'error');
        return null;
    }
}

// Charger tous les utilisateurs (admin seulement)
async function loadUsers() {
    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        showPage('dashboard');
        return;
    }

    try {
        // Récupérer tous les profils
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            showToast('Erreur lors du chargement des utilisateurs', 'error');
            return;
        }
        
        console.log('Profiles chargés:', profiles);
        
        // Pour chaque profil, récupérer l'email depuis la table auth
        const usersWithEmails = await Promise.all(
            profiles.map(async (profile) => {
                try {
                    // Pour l'utilisateur courant, utiliser l'email déjà connu
                    if (profile.id === currentUser.id) {
                        return {
                            ...profile,
                            email: currentUser.email
                        };
                    }
                    
                    // Pour les autres utilisateurs, essayer de récupérer l'email
                    const { data: { user }, error } = await supabase.auth.admin.getUserById(profile.id);
                    if (error) {
                        console.error('Erreur lors de la récupération de l\'email:', error);
                        return {
                            ...profile,
                            email: 'Email non disponible'
                        };
                    }
                    return {
                        ...profile,
                        email: user?.email || 'Email non disponible'
                    };
                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'email:', error);
                    return {
                        ...profile,
                        email: 'Email non disponible'
                    };
                }
            })
        );
        
        users = usersWithEmails;
        renderUsersTable();
    } catch (error) {
        console.error('Erreur générale lors du chargement des utilisateurs:', error);
        showToast('Erreur lors du chargement des utilisateurs', 'error');
    }
}

// Afficher les utilisateurs dans le tableau (admin seulement)
function renderUsersTable(filteredUsers = null) {
    const usersToRender = filteredUsers || users;
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';

    if (usersToRender.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé
                </td>
            </tr>
        `;
        return;
    }

    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'fade-in';

        // Badge de rôle
        let roleBadge = '';
        if (user.role === 'admin') {
            roleBadge = '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Admin</span>';
        } else {
            roleBadge = '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Utilisateur</span>';
        }

        // Date formatée
        const createdDate = new Date(user.created_at).toLocaleDateString('fr-FR');

        // Actions
        let actions = '';
        if (currentUser.id !== user.id) {
            actions = `
                <button class="edit-user-btn text-indigo-600 hover:text-indigo-900 mr-3" data-id="${user.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-user-btn text-red-600 hover:text-red-900" data-id="${user.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            actions = '<span class="text-gray-400">Vous</span>';
        }

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-800 font-medium">${user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${user.username || 'Non renseigné'}</div>
                        <div class="text-sm text-gray-500">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${roleBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${createdDate}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${actions}
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Ajouter les gestionnaires d'événements pour les boutons d'édition et de suppression
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            showEditUserModal(userId);
        });
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            showDeleteConfirmation(userId);
        });
    });
}

// Filtrer les utilisateurs
function filterUsers() {
    const searchTerm = document.getElementById('search-users').value.toLowerCase();
    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm))
    );
    renderUsersTable(filteredUsers);
}

// Afficher le modal d'ajout d'utilisateur
function showAddUserModal() {
    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        return;
    }

    document.getElementById('modal-title').textContent = 'Ajouter un utilisateur';
    document.getElementById('user-form').reset();
    
    // Afficher tous les champs pour l'ajout
    document.getElementById('email-field').style.display = 'block';
    document.getElementById('user-email').required = true;
    
    document.getElementById('password-field').style.display = 'block';
    document.getElementById('user-password').required = true;
    
    userToEdit = null;
    document.getElementById('user-modal').classList.remove('hidden');
}

// Afficher le modal d'édition d'utilisateur
function showEditUserModal(userId) {
    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('modal-title').textContent = 'Modifier l\'utilisateur';
    document.getElementById('user-username').value = user.username || '';
    document.getElementById('user-role').value = user.role || 'user';

    // Masquer le champ email pour l'édition
    document.getElementById('email-field').style.display = 'none';
    document.getElementById('user-email').required = false;

    // Masquer le champ mot de passe pour l'édition
    document.getElementById('password-field').style.display = 'none';
    document.getElementById('user-password').required = false;

    userToEdit = user;
    document.getElementById('user-modal').classList.remove('hidden');
}
// Masquer le modal utilisateur
function hideUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
    // Réinitialiser l'affichage des champs
    document.getElementById('email-field').style.display = 'block';
    document.getElementById('password-field').style.display = 'block';
}

// Afficher la confirmation de suppression
function showDeleteConfirmation(userId) {
    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('delete-user-name').textContent = user.username || user.email;
    userToDelete = user;
    document.getElementById('delete-modal').classList.remove('hidden');
}

// Masquer la confirmation de suppression
function hideDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    userToDelete = null;
}

// Confirmer la suppression d'un utilisateur
async function confirmDeleteUser() {
    if (!userToDelete) return;

    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        hideDeleteModal();
        return;
    }

    try {
        // Supprimer d'abord le profil
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userToDelete.id);

        if (profileError) {
            console.error('Erreur lors de la suppression du profil:', profileError);
            showToast('Erreur lors de la suppression de l\'utilisateur', 'error');
            return;
        }

        showToast('Utilisateur supprimé avec succès', 'success');
        await loadUsers();
        hideDeleteModal();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showToast('Erreur lors de la suppression de l\'utilisateur', 'error');
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Erreur de connexion:', error);
            showToast('Erreur de connexion: ' + error.message, 'error');
            return;
        }

        currentUser = data.user;
        console.log('Utilisateur connecté:', currentUser);
        
        await loadUserProfile();
        setupAuthenticatedUI();
        showPage('dashboard');
        showToast('Connexion réussie!', 'success');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showToast('Erreur de connexion', 'error');
    }
}

// Gérer l'inscription - VERSION SIMPLIFIÉE
async function handleRegister(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        console.log('Tentative d\'inscription pour:', email);

        // Inscription avec Supabase Auth seulement
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            console.error('Erreur d\'inscription:', authError);
            showToast('Erreur d\'inscription: ' + authError.message, 'error');
            return;
        }

        console.log('Utilisateur auth créé:', authData.user);

        // Le profil sera créé automatiquement au premier login via loadUserProfile()
        showToast('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success');
        showPage('login');
        
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        showToast('Erreur lors de l\'inscription', 'error');
    }
}

// Gérer la soumission du formulaire utilisateur (admin)
async function handleUserFormSubmit(e) {
    e.preventDefault();

    // Vérifier que l'utilisateur est admin
    if (currentUserProfile?.role !== 'admin') {
        showToast('Accès refusé. Droits administrateur requis.', 'error');
        hideUserModal();
        return;
    }

    const formData = new FormData(e.target);
    const userData = {
        username: formData.get('username'),
        role: formData.get('role')
    };

    try {
        if (userToEdit) {
            // Mise à jour d'un utilisateur existant - seulement username et role
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: userData.username,
                    role: userData.role
                })
                .eq('id', userToEdit.id);

            if (error) {
                console.error('Erreur lors de la mise à jour:', error);
                showToast('Erreur lors de la mise à jour de l\'utilisateur', 'error');
                return;
            }

            showToast('Utilisateur mis à jour avec succès', 'success');
        } else {
            // Création d'un nouvel utilisateur
            const email = formData.get('email');
            const password = formData.get('password');

            // Validation des champs requis pour l'ajout
            if (!email || !password) {
                showToast('L\'email et le mot de passe sont requis pour créer un utilisateur', 'error');
                return;
            }

            // Créer l'utilisateur dans l'authentification Supabase
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: {
                    username: userData.username
                }
            });

            if (authError) {
                console.error('Erreur lors de la création de l\'utilisateur:', authError);
                showToast('Erreur lors de la création de l\'utilisateur: ' + authError.message, 'error');
                return;
            }

            // Ajouter le profil utilisateur
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    username: userData.username,
                    role: userData.role
                });

            if (profileError) {
                console.error('Erreur lors de la création du profil:', profileError);
                showToast('Erreur lors de la création du profil utilisateur', 'error');
                return;
            }

            showToast('Utilisateur créé avec succès', 'success');
        }

        await loadUsers();
        hideUserModal();
    } catch (error) {
        console.error('Erreur lors de la gestion de l\'utilisateur:', error);
        showToast('Erreur lors de l\'opération', 'error');
    }
}
// Gérer la soumission du formulaire de profil
async function handleProfileFormSubmit(e) {
    e.preventDefault();

    if (!isEditingProfile) {
        showToast('Veuillez activer le mode édition pour modifier votre profil', 'warning');
        return;
    }

    const formData = new FormData(e.target);
    
    try {
        // Préparer les données de profil
        const profileData = {
            username: formData.get('username'),
            bio: formData.get('bio'),
            updated_at: new Date().toISOString()
        };

        // Validation basique
        if (!profileData.username || profileData.username.trim() === '') {
            showToast('Le nom d\'utilisateur est requis', 'error');
            return;
        }

        // Seuls les admins peuvent modifier l'email
        if (currentUserProfile?.role === 'admin') {
            const newEmail = formData.get('email');
            if (newEmail && newEmail !== currentUserProfile.email) {
                // Mettre à jour l'email dans l'authentification (admin seulement)
                const { error: emailError } = await supabase.auth.updateUser({
                    email: newEmail
                });

                if (emailError) {
                    console.error('Erreur lors de la mise à jour de l\'email:', emailError);
                    showToast('Erreur lors de la mise à jour de l\'email: ' + emailError.message, 'error');
                    return;
                }

                showToast('Email mis à jour. Un email de confirmation a été envoyé.', 'warning');
            }
        }

        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', currentUser.id);

        if (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            showToast('Erreur lors de la mise à jour du profil', 'error');
            return;
        }

        showToast('Profil mis à jour avec succès', 'success');
        await loadUserProfile();
        updateDashboard();
        setupProfilePage();
        disableProfileEditing();

        // Recharger la page admin si l'utilisateur est admin
        if (currentUserProfile?.role === 'admin') {
            await loadUsers();
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        showToast('Erreur lors de la mise à jour du profil', 'error');
    }
}

// Configurer la page profil
function setupProfilePage() {
    if (!currentUserProfile) {
        console.log('⚠️  Aucun profil utilisateur pour configurer la page profil');
        return;
    }
    
    console.log('⚙️  Configuration de la page profil');
    
    // Charger les données
    loadProfileData();
    
    // Configurer le champ email selon le rôle
    const emailInput = document.getElementById('profile-email');
    if (currentUserProfile?.role === 'admin') {
        // Admins peuvent modifier l'email
        emailInput.title = "Modifiable pour les administrateurs";
        emailInput.placeholder = "Entrez le nouvel email";
    } else {
        // Utilisateurs normaux ne peuvent pas modifier l'email
        emailInput.readOnly = true;
        emailInput.title = "L'email ne peut pas être modifié";
        emailInput.placeholder = "Email non modifiable";
        emailInput.classList.add('bg-gray-50', 'cursor-not-allowed');
        emailInput.classList.remove('bg-white', 'cursor-text');
    }
    
    // S'assurer que le mode édition est désactivé
    disableProfileEditing();
}

// Mettre à jour le tableau de bord
function updateDashboard() {
    if (!currentUserProfile) {
        console.log('Aucun profil utilisateur pour mettre à jour le dashboard');
        return;
    }

    console.log('Mise à jour du dashboard avec:', currentUserProfile);

    document.getElementById('dashboard-welcome').textContent = `Bienvenue, ${currentUserProfile.username || currentUser.email}`;
    document.getElementById('user-role-display').textContent = currentUserProfile.role === 'admin' ? 'Administrateur' : 'Utilisateur';
    document.getElementById('member-since').textContent = new Date(currentUserProfile.created_at).toLocaleDateString('fr-FR');
    document.getElementById('dashboard-username').textContent = currentUserProfile.username || 'Non renseigné';
    document.getElementById('dashboard-email').textContent = currentUserProfile.email;
    document.getElementById('dashboard-bio').textContent = currentUserProfile.bio || 'Aucune bio renseignée';

    // Mettre à jour le formulaire de profil
    document.getElementById('profile-username').value = currentUserProfile.username || '';
    document.getElementById('profile-email').value = currentUserProfile.email || '';
    document.getElementById('profile-bio').value = currentUserProfile.bio || '';
}

// Afficher une page spécifique
function showPage(pageId) {
    console.log('Changement de page vers:', pageId);
    
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('page-hidden');
        page.classList.remove('page-active');
    });

    // Vérifier les permissions pour certaines pages
    if (pageId === 'admin-users') {
        if (currentUserProfile?.role !== 'admin') {
            showToast('Accès refusé. Droits administrateur requis.', 'error');
            showPage('dashboard');
            return;
        }
        loadUsers(); // Charger les utilisateurs pour la page admin
    }

    // Afficher la page demandée
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.remove('page-hidden');
        setTimeout(() => {
            targetPage.classList.add('page-active');
        }, 50);
    }

    // Charger les données si nécessaire
    if (pageId === 'dashboard' && currentUserProfile) {
        updateDashboard();
    } else if (pageId === 'profile' && currentUserProfile) {
        setupProfilePage();
    }
}

// Afficher un message toast
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast-' + Date.now();

    let bgColor = 'bg-blue-500';
    let icon = 'fas fa-info-circle';

    if (type === 'success') {
        bgColor = 'bg-green-500';
        icon = 'fas fa-check-circle';
    } else if (type === 'error') {
        bgColor = 'bg-red-500';
        icon = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-500';
        icon = 'fas fa-exclamation-triangle';
    }

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center justify-between max-w-sm transform transition-all duration-300 ease-in-out`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-2"></i>
            <span>${message}</span>
        </div>
        <button class="ml-4 text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
        toast.classList.add('opacity-100');
    }, 10);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (document.getElementById(toastId)) {
            document.getElementById(toastId).remove();
        }
    }, 5000);
}

// Déconnexion
async function logout() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        currentUserProfile = null;
        isEditingProfile = false;

        // Masquer la navigation
        document.getElementById('main-nav').classList.add('hidden');

        // Réinitialiser l'interface
        showPage('login');
        showToast('Déconnexion réussie', 'success');
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        showToast('Erreur lors de la déconnexion', 'error');
    }
}

// Fonction de debug pour tester manuellement
window.debugAuth = async function() {
    console.log('=== DEBUG AUTH ===');
    console.log('Current User:', currentUser);
    console.log('Current User Profile:', currentUserProfile);
    
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session);
    
    if (session) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        console.log('Profile direct:', profile, error);
    }
};