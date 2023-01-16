const searchList = document.querySelector('.list');
const storedSearches = JSON.parse(localStorage.getItem('Location Search'));
if (storedSearches) {
    storedSearches.forEach(search => {
        const li = document.createElement('li');
        li.innerText = search;
        searchList.appendChild(li);
    });
}