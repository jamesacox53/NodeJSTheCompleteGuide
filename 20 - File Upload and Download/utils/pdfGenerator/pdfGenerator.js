const path = require('path');
const fs = require('fs');
const pdfkit = require('pdfkit');

function generateInvoicePDF(inputObj) {
    const response = inputObj.response;
    const orderID = inputObj.order._id.toString();
    
    const invoiceNameStr = 'invoice-' + orderID + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceNameStr);
    
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename="' + invoiceNameStr + '"');

    return _generateInvoicePDF(inputObj, response, invoicePath);
}

function _generateInvoicePDF(inputObj, response, invoicePath) {
    const pdfDoc = new pdfkit(); 
    
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(response);

    _addContentToPDF(inputObj, pdfDoc);

    return pdfDoc.end();
}

function _addContentToPDF(inputObj, pdfDoc) {
    const order = inputObj.order;
    const productsArr = order.products;
    
    pdfDoc.fontSize(26).text('Invoice');
    pdfDoc.fontSize(16).text(' ');
    
    _addOrderLines(pdfDoc, productsArr);
}

function _addOrderLines(pdfDoc, productsArr) {
    let sum = 0;

    for (let i = 0; i < productsArr.length; i++) {
        const product = productsArr[i];
        const title = product.productID.title;
        const price = product.productID.price;
        const quantity = product.quantity;
        const totalPrice = price *  quantity;

        const orderText = `${title} - ${quantity} x $${price} = ${totalPrice}`; 

        pdfDoc.fontSize(16).text(orderText);
        sum += totalPrice;
    }

    pdfDoc.fontSize(16).text(`Sum: ${sum}`);
}

exports.generateInvoicePDF = generateInvoicePDF;