const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrf = btn.parentNode.querySelector('[name=CSRFToken]').value;

    console.log(productID);
    console.log(csrf);
}