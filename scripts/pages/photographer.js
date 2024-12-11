// scripts/pages/photographer.js

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getData() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) throw new Error('Erreur de chargement du JSON');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur:", error);
    }
}

let data

async function displayPhotographer() {
    const photographerId = parseInt(getQueryParam('id'));
    if (!photographerId) {
        console.error("ID de photographe non trouvé dans l'URL");
        return;
    }

    data = await getData();
    const photographer = data.photographers.find(p => p.id === photographerId);

    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    document.querySelector('.photographer-name').textContent = photographer.name;
    document.querySelector('.photographer-location').textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector('.photographer-tagline').textContent = photographer.tagline;

    const portraitPath = `assets/images/images_photographes/${photographer.portrait}`;
    const portraitImg = document.querySelector('.photographer-portrait');
    portraitImg.setAttribute('src', portraitPath);
    portraitImg.setAttribute('alt', `Portrait de ${photographer.name}`);
}

async function displayMedia() {
    const photographerId = parseInt(getQueryParam('id'));
    if (!photographerId) return;

    const data = await getData();
    let media = data.media.filter(m => m.photographerId === photographerId);

    const mediaGrid = document.querySelector('.media_grid');
    const filterSelect = document.getElementById('filter');

    function sortAndDisplayMedia() {
        const filterValue = filterSelect.value;

        if (filterValue === 'popularity') {
            media.sort((a, b) => b.likes - a.likes);
        } else if (filterValue === 'date') {
            media.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filterValue === 'title') {
            media.sort((a, b) => a.title.localeCompare(b.title));
        }

        mediaGrid.innerHTML = '';
        media.forEach(item => {
            const mediaItem = createMediaItem(item);
            mediaGrid.appendChild(mediaItem);
        });
    }

    sortAndDisplayMedia();

    filterSelect.addEventListener('change', sortAndDisplayMedia);
}

init().then(() => displayMedia());


function createMediaItem(data) {
    const { id, image, video, title, likes } = data;

    const div = document.createElement('div');
    div.classList.add('media_item');

    let mediaElement;

    if (image) {
        const imagePath = `assets/images/images_photographes/${image}`;
        mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', imagePath);
        mediaElement.setAttribute('alt', title);
        mediaElement.setAttribute('loading', 'lazy');
        mediaElement.classList.add('media_image');
    } else if (video) {
        const videoPath = `assets/images/images_photographes/${video}`;
        mediaElement = document.createElement('video');
        mediaElement.setAttribute('controls', '');
        mediaElement.setAttribute('src', videoPath);
        mediaElement.setAttribute('aria-label', title);
        mediaElement.setAttribute('loading', 'lazy');
        mediaElement.classList.add('media_video');
    } else {
        const placeholder = document.createElement('div');
        placeholder.classList.add('media_placeholder');
        placeholder.textContent = 'Média non disponible';
        div.appendChild(placeholder);
        return div;
    }

    div.appendChild(mediaElement);

    const mediaInfo = document.createElement('div');
    mediaInfo.classList.add('media_info');

    const mediaTitle = document.createElement('div');
    mediaTitle.classList.add('media_title');
    mediaTitle.textContent = title;

    const mediaLikes = document.createElement('div');
    mediaLikes.classList.add('media_likes');

    const likeCount = document.createElement('span');
    likeCount.classList.add('like_count');

    const storedLikes = localStorage.getItem(`likes_${id}`);
    likeCount.textContent = storedLikes ? storedLikes : likes;

    const likeIcon = document.createElement('img');
    likeIcon.src = 'assets/icons/like-icone.svg';
    likeIcon.alt = 'Like Icon';
    likeIcon.classList.add('like_icon');

    likeIcon.addEventListener('click', () => {
        const newLikes = parseInt(likeCount.textContent) + 1;
        likeCount.textContent = newLikes;
        addGeneralLike()

        localStorage.setItem(`likes_${id}`, newLikes);
    });

    mediaLikes.appendChild(likeCount);
    mediaLikes.appendChild(likeIcon);

    mediaInfo.appendChild(mediaTitle);
    mediaInfo.appendChild(mediaLikes);

    div.appendChild(mediaInfo);

    return div;
}

function displayModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.getElementById('contact_modal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});



async function init() {
    await displayPhotographer();
    await displayMedia();
}

init();


async function displayFooter() {
    const photographerId = parseInt(getQueryParam('id'));
    if (!photographerId) return;

    const data = await getData();
    const photographer = data.photographers.find(p => p.id === photographerId);
    const media = data.media.filter(m => m.photographerId === photographerId);

    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    addGeneralLike()

    const priceElement = document.getElementById('photographer_price');
    priceElement.textContent = photographer.price;
}

init().then(() => displayFooter());


async function addGeneralLike() {
    const likebutton = document.getElementById('likeButton');
    const likecountdisplay = document.getElementById('total_likes');

    const totalLikes = data.media.reduce((sum, item) => {
        const storedLikes = localStorage.getItem(`likes_${item.id}`);
        return sum + (storedLikes ? parseInt(storedLikes) : item.likes);
    }, 0);

    likecountdisplay.textContent = totalLikes;

}

