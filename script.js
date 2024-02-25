async function loadPosters() {
    const response = await fetch('/js_dammy.csv');
    const data = await response.text();
    const movies = data.split('\n').slice(1).map(line => line.split(','));

    const moviePosters = document.getElementById('movie-posters');
    const loadMoreButton = document.getElementById('load-more');

    for (let i = 0; i < 24; i++) {
        const [title, posterUrl, ids] = movies[i];

        var divBlock = document.createElement('div');
        var divText = document.createElement('div');
        var divRate = document.createElement('div');
        var divImg = document.createElement('div');
        var aTag = document.createElement('a');
        var imgTag = document.createElement('img');

        divRate.textContent = '10';
        divRate.id = "movie-rate";
        divText.textContent = title;
        divText.id = "movie-info";

        divImg.id = "container";

        aTag.href = "https://www.kinopoisk.ru/film/"+ids;
        aTag.target = "_blank";
        imgTag.className = 'movie-poster';
        imgTag.src = posterUrl; 
        
        aTag.appendChild(imgTag);
        divImg.appendChild(aTag);
        divImg.appendChild(divRate);
        divImg.appendChild(divText);
        divBlock.appendChild(divImg);
        moviePosters.appendChild(divBlock);

    }

    loadMoreButton.addEventListener('click', async () => {
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = 'Loading...';
    
        const newMovies = movies.splice(24, 8);
        for (let i = 0; i < 8; i++) {
            const [title, posterUrl, ids] = newMovies[i];
         
            var moviePosters = document.getElementById('movie-posters');
            var divBlock = document.createElement('div');
            var divText = document.createElement('div');
            var divImg = document.createElement('div');
            var aTag = document.createElement('a');
            var imgTag = document.createElement('img');

            divText.textContent = title;
            divText.id = "movie-info";
            aTag.href = "https://www.kinopoisk.ru/film/"+ids;
            aTag.target = "_blank";
            imgTag.className = 'movie-poster';
            imgTag.src = posterUrl;

            aTag.appendChild(imgTag);
            divImg.appendChild(aTag);
            divImg.appendChild(divText);
            divBlock.appendChild(divImg);
            moviePosters.appendChild(divBlock);
            
            
        }
    
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    });
    
    
}

loadPosters();
