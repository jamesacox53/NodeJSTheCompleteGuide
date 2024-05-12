const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrf = btn.parentNode.querySelector('[name=CSRFToken]').value;
    if (!(_checkArgs(productID, csrf))) return;

    _sendDelRequest(productID, csrf)
    .then(response => _getDataFromResponse(response))
    .then(data => _removeProductFromDOM(data))
    .catch(err => console.log(err));

    function _checkArgs(productID, csrf) {
        if (!productID || !csrf) return false;

        return true;
    }

    function _sendDelRequest(productID, csrf) {
        const routeStr = '/admin/delete-product/' + productID;
        const fetchOpts = {
            method: 'DELETE',
            headers: {
                'x-csrf-token': csrf
            }
        };

        return fetch(routeStr, fetchOpts);
    }

    function _getDataFromResponse(response) {
        return response.json();
    }

    function _removeProductFromDOM(data) {
        const productElem = btn.closest('article');

        productElem.parentNode.removeChild(productElem);
    }
}