async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) throw new Error('Erreur de chargement du JSON');
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Erreur:", error);
    }
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const data = await getPhotographers();
    displayData(data.photographers);
}
    
init();
    
