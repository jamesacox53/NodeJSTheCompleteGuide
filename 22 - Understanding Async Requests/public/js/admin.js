const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrf = btn.parentNode.querySelector('[name=CSRFToken]').value;

    const routeStr = '/admin/delete-product/' + productID;
    const fetchOpts = {
        method: 'DELETE',
        headers: {
            'x-csrf-token': csrf
        }
    };

    fetch(routeStr, fetchOpts)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}