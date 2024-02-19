async function loadPosters() {
    const response = await fetch('https://raw.githubusercontent.com/obeyadw/p/main/js_dammy.csv');
    const data = await response.text();
    const movies = data.split('\n').slice(1).map(line => line.split(','));

    const moviePosters = document.getElementById('movie-posters');
    const loadMoreButton = document.getElementById('load-more');

    for (let i = 0; i < 24; i++) {
        //alert(movies[i]);
        const [title, posterUrl, ids] = movies[i];
        const img = document.createElement('img');
        var aTag = document.createElement('a');

        img.src = posterUrl;
        img.className = 'movie-poster';
        aTag.href = "https://www.kinopoisk.ru/film/"+ids;
        aTag.target = "_blank"; 
        aTag.appendChild(img);
        moviePosters.appendChild(aTag);

    }

    loadMoreButton.addEventListener('click', async () => {
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = 'Loading...';
    
        const newMovies = movies.splice(24, 8);
        for (let i = 0; i < 8; i++) {
            const [title, posterUrl, ids] = newMovies[i];
            //alert(ids);

            // const div = document.createElement('div');
            // div.textContent = title;
            // moviePosters.appendChild(div);

            // const img = document.createElement('img');
            // img.src = posterUrl;
            // img.className = 'movie-poster';
            // moviePosters.appendChild(img);


            var moviePosters = document.getElementById('movie-posters');
            var aTag = document.createElement('a');
            var imgTag = document.createElement('img');

            aTag.href = "https://www.kinopoisk.ru/film/"+ids;
            imgTag.className = 'movie-poster';
            imgTag.src = posterUrl;
            aTag.target = "_blank"; 
            // imgTag.height = 300;
            // imgTag.width = 200;

            aTag.appendChild(imgTag);
            moviePosters.appendChild(aTag);

            
            
        }
    
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    });
    
    
}

loadPosters();
