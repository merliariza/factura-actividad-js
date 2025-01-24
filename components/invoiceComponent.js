//Importación del modelo de almacenamiento de facturas
import '../models/invoiceModel.js';
//Exportación del componente web para factura
export class InvoiceComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        // Generate invoice number when component is added to DOM
        this.updateInvoiceNumber();
    }

    updateInvoiceNumber() {
        const invoiceNumber = this.generateInvoiceNumber();
        this.shadowRoot.getElementById('invoiceNumber').textContent = invoiceNumber;
    }

    generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `FAC-${year}${month}${day}-${hours}${minutes}${seconds}-${milliseconds}`;
    }
    render() {
        this.shadowRoot.innerHTML = /* html */ `
        <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <div class="row g-3">
            <div class="col-12">
                <label for="numInvoice" class="form-label">Nro Factura</label>
                <div id="invoiceNumber"></div>
            </div>
            <div class="col-12">
                <label for="idInvoice" class="form-label">Nro Id</label>
                <input type="text" class="form-control" name="idInvoice" id="idInvoice">
            </div>
            <div class="col-md-6">
                <label for="name" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="name" id="name">
            </div>
            <div class="col-md-6">
                <label for="lastName" class="form-label">Apellido</label>
                <input type="text" class="form-control" name="lastName" id="lastName">
            </div>
            <div class="col-12">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" class="form-control" name="address" id="address">
            </div>
            <div class="col-12">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email">
            </div>
        </div>
        `;
    }
}

customElements.define("invoice-component", InvoiceComponent);