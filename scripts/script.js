document.addEventListener("DOMContentLoaded", function () {
    let meusSeguidores = [];

    function carregarPerfil(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                const perfilDiv = document.getElementById('perfil');
                perfilDiv.innerHTML = `
                    <h2 class="nome">${data.name}</h2>
                    <img class="perfil-img" src="${data.avatar_url}" alt="Avatar de ${data.name}">
                    <p class="bio">${data.bio}</p>
                `;

                return fetch(data.followers_url);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar seguidores');
                }
                return response.json();
            })
            .then(followersData => {
                meusSeguidores = followersData;
                exibir(meusSeguidores);
            })
            .catch(error => console.error('Erro ao carregar perfil ou seguidores:', error));
    }

    function exibir(listaSeguidores) {
        const seguidoresDiv = document.getElementById('seguidores-gh');
        seguidoresDiv.innerHTML = '';

        listaSeguidores.forEach(follower => {
            const seguidorDiv = document.createElement('div');
            seguidorDiv.classList.add('seguidor');
            seguidorDiv.setAttribute('data-username', follower.login);

            seguidorDiv.innerHTML = `
                <img src="${follower.avatar_url}" alt="Avatar de ${follower.login}">
                <p class="seguidor-nome">${follower.login}</p>
            `;

            seguidoresDiv.appendChild(seguidorDiv);
        });
    }

    function seguidoresDoSeguidor(username) {
        const url = `https://api.github.com/users/${username}`;
        carregarPerfil(url);
    }

    function carregarUsuarioPrincipal() {
        const url = 'https://api.github.com/users/atilaVasck';
        carregarPerfil(url);
    }

    document.getElementById('seguidores-gh').addEventListener('click', function (event) {
        if (event.target.classList.contains('seguidor') || event.target.parentNode.classList.contains('seguidor')) {
            const seguidorDiv = event.target.closest('.seguidor');
            const username = seguidorDiv.getAttribute('data-username');
            seguidoresDoSeguidor(username);
            atualizarLinkHome('Voltar');
        }
    });

    document.getElementById('link-home').addEventListener('click', function () {
        carregarUsuarioPrincipal();
        atualizarLinkHome('Home');
    });

    function atualizarLinkHome(texto) {
        const linkHome = document.getElementById('link-home');
        linkHome.textContent = texto;
    }

    carregarUsuarioPrincipal();

    // Função para mostrar/esconder o menu
    document.getElementById('menu-toggle').addEventListener('change', function () {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('show');
    });
});