document.addEventListener('DOMContentLoaded', function () {
    const presentForm = document.getElementById('present-form');
    const presentList = document.getElementById('present-list');
    const editPresentList = document.getElementById('edit-present-list');
    const editForm = document.getElementById('edit-form');

    // Adicionar presente
    if (presentForm) {
        presentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(presentForm);

            const present = {
                title: formData.get('title'),
                description: formData.get('description'),
                value: parseFloat(formData.get('value')),
                link: formData.get('link')
            };

            const imageFile = formData.get('imageFile');
            if (imageFile && imageFile.size > 0) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    present.imageUrl = reader.result;
                    sendPresent(present);
                };
                reader.readAsDataURL(imageFile);
            } else {
                sendPresent(present);
            }
        });
    }

    function sendPresent(present) {
        fetch('/presents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(present)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Presente cadastrado com sucesso!');
                presentForm.reset();
                window.location.href = 'edit.html';
            })
            .catch(error => console.error('Error:', error));
    }

    // Exibir lista de presentes para compra
    if (presentList) {
        fetch('/presents')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(presents => {
                presentList.innerHTML = ''; // Limpar a lista antes de adicionar itens
                presents.forEach(present => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h2>${present.title}</h2>
                        <p>${present.description}</p>
                        ${present.imageUrl ? `<img src="${present.imageUrl}" alt="${present.title}">` : ''}
                        <p>Valor: R$ ${present.value.toFixed(2)}</p>
                        <button onclick="window.location.href='${present.link}'" class="btn btn-green">Comprar Presente</button>
                    `;
                    presentList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Exibir lista de presentes com botões "Editar" e "Deletar"
    if (editPresentList) {
        fetch('/presents')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(presents => {
                editPresentList.innerHTML = ''; // Limpar a lista antes de adicionar itens
                presents.forEach(present => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h2>${present.title}</h2>
                        <p>${present.description}</p>
                        ${present.imageUrl ? `<img src="${present.imageUrl}" alt="${present.title}">` : ''}
                        <p>Valor: R$ ${present.value.toFixed(2)}</p>
                        <button onclick="editPresent(${present.id})" class="btn btn-green">Editar</button>
                        <button onclick="deletePresent(${present.id})" class="btn btn-red">Deletar</button>
                    `;
                    editPresentList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    window.deletePresent = function(id) {
        fetch(`/presents/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Presente deletado com sucesso!');
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    };

    window.editPresent = function(id) {
        window.location.href = `/edit-item.html?id=${id}`;
    };

    // Editar presente
    if (editForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const presentId = urlParams.get('id');

        fetch(`/presents/${presentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(present => {
                document.getElementById('present-id').value = present.id;
                document.getElementById('title').value = present.title;
                document.getElementById('description').value = present.description;
                document.getElementById('value').value = present.value;
                document.getElementById('link').value = present.link;
            })
            .catch(error => console.error('Error:', error));

        editForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(editForm);

            const updatedPresent = {
                title: formData.get('title'),
                description: formData.get('description'),
                value: parseFloat(formData.get('value')),
                link: formData.get('link')
            };

            const imageFile = formData.get('imageFile');
            if (imageFile && imageFile.size > 0) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    updatedPresent.imageUrl = reader.result;
                    sendUpdatedPresent(presentId, updatedPresent);
                };
                reader.readAsDataURL(imageFile);
            } else {
                sendUpdatedPresent(presentId, updatedPresent);
            }
        });
    }

    function sendUpdatedPresent(id, updatedPresent) {
        fetch(`/presents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPresent)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Presente atualizado com sucesso!');
                window.location.href = 'edit.html';
            })
            .catch(error => console.error('Error:', error));
    }
});
