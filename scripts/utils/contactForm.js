// scripts/utils/contactForm.js

// Vous pouvez ajouter des validations ou des fonctionnalités supplémentaires ici

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Récupérer les valeurs du formulaire
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Afficher les données dans la console (à remplacer par une vraie soumission)
    console.log("Formulaire soumis :", { prenom, nom, email, message });

    // Fermer le modal après soumission
    closeModal();

    // Réinitialiser le formulaire
    event.target.reset();

    // Vous pouvez ajouter une alerte ou un message de confirmation ici
    alert("Votre message a été envoyé !");
});
