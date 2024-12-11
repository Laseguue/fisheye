// scripts/utils/contactForm.js


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log("Formulaire soumis :", { prenom, nom, email, message });

    closeModal();

    event.target.reset();

    alert("Votre message a été envoyé !");
});
