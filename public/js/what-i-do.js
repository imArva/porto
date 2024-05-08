const nameInput = document.getElementById('nameEdit');
const priceInput = document.getElementById('priceEdit');
const idInput = document.getElementById('idEdit');

const idDeleteInput = document.getElementById('idDelete');

document.addEventListener('click', (e) => {
    
    if (e.target.classList[0] == 'edit-btn') {
        nameInput.value = e.target.dataset.name;
        priceInput.value = e.target.dataset.price;
        idInput.value = e.target.dataset.id;
    }

    if (e.target.classList[0] == 'delete-btn') {
        idDeleteInput.value = e.target.dataset.id;
    }

});