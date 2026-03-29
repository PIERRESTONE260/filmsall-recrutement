// ==========================================
// 1. CONFIGURATION DU RECRUTEMENT
// ==========================================
// Remplace "true" par "false" quand tu veux fermer définitivement les candidatures
const RECRUTEMENT_OUVERT = true; 

// ==========================================
// 2. VÉRIFICATION DE LA LIMITE (ANTI-SPAM)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const mainForm = document.getElementById('Form');
    const messageFermeture = document.getElementById('message-fermeture');
    const titreFormulaire = document.getElementById('titre-formulaire');
    const badge = document.querySelector('.limite-badge');

    // Vérifie si la personne a déjà postulé sur cet appareil
    const aDejaPostule = localStorage.getItem("filmsall_candidature");

    // Si le recrutement est fermé ou si la personne a déjà postulé
    if (!RECRUTEMENT_OUVERT || aDejaPostule === "oui") {
        if (mainForm) mainForm.style.display = "none"; 
        if (titreFormulaire) titreFormulaire.style.display = "none";
        if (badge) badge.style.display = "none";
        if (messageFermeture) {
            messageFermeture.style.display = "block";
            
            // Message spécifique s'il a déjà postulé
            if (aDejaPostule === "oui") {
                messageFermeture.innerHTML = "<h2>Candidature déjà reçue !</h2><p>Vous avez déjà soumis votre candidature. Nous l'analysons et vous contacterons sous peu sur votre adresse email.</p>";
            }
        }
    }
});

// ==========================================
// 3. AFFICHER LE PDG
// ==========================================
function Affiche() {
    const pdgDiv = document.getElementById('click');
    // Remplace par ton nom
    pdgDiv.innerHTML = "<strong>Le PDG de FILMSall est :</strong> NGOY WA BANZA PIERRE";
    pdgDiv.style.color = "#e50914"; 
}

// ==========================================
// 4. CONFIGURATION ET ENVOI EMAILJS
// ==========================================
emailjs.init("m5g95xmPymbqe8fbb"); // Ta clé publique

const form = document.getElementById('Form');
const btnSubmit = document.getElementById('btn-submit');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la page de se recharger

    // Changer le texte du bouton pendant l'envoi
    btnSubmit.innerText = 'Envoi en cours...';
    btnSubmit.style.opacity = '0.7';
    btnSubmit.disabled = true;

    // Récupérer les compétences (checkboxes) cochées
    let competencesCochees = [];
    let checkboxes = document.querySelectorAll('input[name="competences"]:checked');
    checkboxes.forEach((cb) => {
        competencesCochees.push(cb.value);
    });

    // Préparer les données à envoyer (elles correspondent à tes variables {{...}} sur EmailJS)
    const templateParams = {
        nom: document.getElementById('nom').value,
        postnom: document.getElementById('postnom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value,
        genre: document.getElementById('genre').value,
        langue: document.getElementById('langue').value,
        experience: document.getElementById('experience').value,
        competences: competencesCochees.join(', '), 
        url_projet: document.getElementById('projets').value,
        poste: document.getElementById('poste').value
    };

    // Tes IDs de service et de template
    const SERVICE_ID = "service_yxqsli2";
    const TEMPLATE_ID = "template_k6a7kjq";

    // Envoi via EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            alert('Félicitations ! Votre candidature a été envoyée avec succès à FILMSall.');
            
            // Enregistre que cette personne a postulé pour bloquer un nouvel envoi (Anti-spam)
            localStorage.setItem("filmsall_candidature", "oui");
            
            // Recharge la page (ce qui déclenchera la sécurité anti-spam visuelle au-dessus)
            window.location.reload();
            
        }, function(error) {
            alert('Erreur lors de l\'envoi. Veuillez réessayer. Erreur: ' + JSON.stringify(error));
            btnSubmit.innerText = 'Envoyer la candidature';
            btnSubmit.style.opacity = '1';
            btnSubmit.disabled = false;
        });
});