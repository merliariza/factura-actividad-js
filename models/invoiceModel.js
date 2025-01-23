//Modelo de almacenamiento para las facturas
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
//Exportación del modelo de almacenamiento
export default InvoiceModel;