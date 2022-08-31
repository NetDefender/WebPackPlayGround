console.log("Hello world");
const btoEffect = document.getElementById('btoEffect');
const lbProductTypes = document.getElementById('lbProductTypes');

btoEffect.addEventListener('click', (e) => 
{
    e.preventDefault();
    removeChildNodes(lbProductTypes);
    addProductTypes(lbProductTypes);
});

function removeChildNodes(element) 
{
    console.log(`Removing childs of ${element.id}`)
    while(element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
}

function addProductTypes(select) 
{
    for(let i = 0; i < 10; i++)
    {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = `Item - ${i}`;
        select.appendChild(option);
    }
}