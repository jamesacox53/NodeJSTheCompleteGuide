const path = require('path');
const fs = require('fs');
const pdfkit = require('pdfkit');

const generateInvoicePDF = function(inputObj) {
    const response = inputObj.response;
    const orderID = inputObj.order._id.toString();
    
    const invoiceNameStr = 'invoice-' + orderID + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceNameStr);
    
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename="' + invoiceNameStr + '"');

    return _generateInvoicePDF(response, invoicePath);
}

const _generateInvoicePDF = function(response, invoicePath) {
    const pdfDoc = new pdfkit(); 
    
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(response);

    pdfDoc.text('Hello world!');
    return pdfDoc.end();
}

exports.generateInvoicePDF = generateInvoicePDF;