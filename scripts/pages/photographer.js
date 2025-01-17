// scripts/pages/photographer.js

let data;
let currentMediaIndex = 0;
let mediaList = [];

async function init() {
    await displayPhotographer();
    await displayMedia();
    await displayFooter();
    initLightboxEvents();
}

init();

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

        mediaList = media;
    }

    sortAndDisplayMedia();
    filterSelect.addEventListener('change', sortAndDisplayMedia);
}

function createMediaItem(item) {
    const { id, image, video, title, likes } = item;

    const div = document.createElement('div');
    div.classList.add('media_item');

    let mediaElement;

    if (image) {
        const imagePath = `assets/images/images_photographes/${image}`;
        mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', imagePath);
        mediaElement.setAttribute('alt', title);
        mediaElement.setAttribute('loading', 'lazy');
        mediaElement.setAttribute('tabindex', '0');
        mediaElement.classList.add('media_image');
    } else if (video) {
        const videoPath = `assets/images/images_photographes/${video}`;
        mediaElement = document.createElement('video');
        mediaElement.setAttribute('src', videoPath);
        mediaElement.setAttribute('aria-label', title);
        mediaElement.setAttribute('loading', 'lazy');
        mediaElement.setAttribute('tabindex', '0');
        mediaElement.classList.add('media_video');
    } else {
        const placeholder = document.createElement('div');
        placeholder.classList.add('media_placeholder');
        placeholder.textContent = 'Média non disponible';
        div.appendChild(placeholder);
        return div;
    }

    mediaElement.addEventListener('click', () => openLightbox(item));
    mediaElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLightbox(item);
        }
    });

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
    likeIcon.setAttribute('tabindex', '0');

    likeIcon.addEventListener('click', () => {
        const newLikes = parseInt(likeCount.textContent) + 1;
        likeCount.textContent = newLikes;
        addGeneralLike();
        localStorage.setItem(`likes_${id}`, newLikes);
    });

    likeIcon.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            likeIcon.click();
        }
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
        closeLightbox();
    }
});

document.getElementById('contact_modal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

async function displayFooter() {
    const photographerId = parseInt(getQueryParam('id'));
    if (!photographerId) return;

    const data = await getData();
    const photographer = data.photographers.find(p => p.id === photographerId);

    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    addGeneralLike();
    const priceElement = document.getElementById('photographer_price');
    priceElement.textContent = photographer.price;
}

async function addGeneralLike() {
    const likecountdisplay = document.getElementById('total_likes');
    const totalLikes = mediaList.reduce((sum, item) => {
        const storedLikes = localStorage.getItem(`likes_${item.id}`);
        return sum + (storedLikes ? parseInt(storedLikes) : item.likes);
    }, 0);

    likecountdisplay.textContent = totalLikes;
}




function openLightbox(selectedItem) {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'flex';

    currentMediaIndex = mediaList.findIndex(m => m.id === selectedItem.id);

    showMediaInLightbox(mediaList[currentMediaIndex]);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

function showMediaInLightbox(mediaItem) {
    const lightboxImage = document.querySelector('.lightbox__image');
    const lightboxVideo = document.querySelector('.lightbox__video');
    const lightboxTitle = document.querySelector('.lightbox__title');

    lightboxImage.style.display = 'none';
    lightboxVideo.style.display = 'none';

    if (mediaItem.image) {
        lightboxImage.src = `assets/images/images_photographes/${mediaItem.image}`;
        lightboxImage.alt = mediaItem.title;
        lightboxImage.style.display = 'block';
    } else if (mediaItem.video) {
        lightboxVideo.src = `assets/images/images_photographes/${mediaItem.video}`;
        lightboxVideo.alt = mediaItem.title;
        lightboxVideo.style.display = 'block';
    }

    lightboxTitle.textContent = mediaItem.title;
}

function showNextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
    showMediaInLightbox(mediaList[currentMediaIndex]);
}

function showPrevMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
    showMediaInLightbox(mediaList[currentMediaIndex]);
}

function initLightboxEvents() {
    const closeBtn = document.querySelector('.lightbox__close');
    const nextBtn = document.querySelector('.lightbox__next');
    const prevBtn = document.querySelector('.lightbox__prev');

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextMedia);
    prevBtn.addEventListener('click', showPrevMedia);

    document.addEventListener('keydown', (event) => {
        if (document.getElementById('lightbox').style.display === 'flex') {
            if (event.key === 'ArrowRight') {
                showNextMedia();
            } else if (event.key === 'ArrowLeft') {
                showPrevMedia();
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });
}
