const InvoiceModel = {
    factura: { numInvoice: '' },
    header: {
        idInvoice: '',
        name: '',
        lastName: '',
        address: '',
        email: ''
    },
    detailInvoice: {
        codProduct: '',
        nameProduct: '',
        unitPrice: '',
        quantity: '',
    },
    summary: {
        subtotal: '',
        iva: '',
        total: '',
    }
};

export default InvoiceModel;