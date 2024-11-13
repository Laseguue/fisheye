// scripts/pages/photographer.js

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) throw new Error('Erreur de chargement du JSON');
        const data = await response.json();
        return data.photographers;
    } catch (error) {
        console.error("Erreur:", error);
    }
}

async function displayPhotographer() {
    const photographerId = parseInt(getQueryParam('id'));
    if (!photographerId) {
        console.error("ID de photographe non trouvé dans l'URL");
        return;
    }

    const photographers = await getPhotographers();
    const photographer = photographers.find(p => p.id === photographerId);

    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    document.querySelector('.photographer-name').textContent = photographer.name;
    document.querySelector('.photographer-location').textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector('.photographer-tagline').textContent = photographer.tagline;
    document.querySelector('.photographer-price').textContent = `${photographer.price}€/jour`;

}

function displayModal() {
    document.getElementById('contact_modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('contact_modal').style.display = 'none';
}

async function init() {
    await displayPhotographer();
}

init();
