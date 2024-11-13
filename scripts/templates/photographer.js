function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;

    const picture = `assets/images/images_photographes/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');

        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.classList.add('link-container');

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `${name}`);
        img.classList.add('logo');

        const h2 = document.createElement('h2');
        h2.textContent = name;

        link.appendChild(img);
        link.appendChild(h2);

        const infoDiv = document.createElement('div');

        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        location.classList.add('location-class');

        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.classList.add('tagline-class');

        const priceElement = document.createElement('p');
        priceElement.textContent = `${price}€/jour`;
        priceElement.classList.add('price-class');

        infoDiv.appendChild(location);
        infoDiv.appendChild(taglineElement);
        infoDiv.appendChild(priceElement);
        article.appendChild(link);
        article.appendChild(infoDiv);

        return article;
    }

    return { name, picture, getUserCardDOM };
}
