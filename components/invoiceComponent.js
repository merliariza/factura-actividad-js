import '../models/invoiceModel.js';
export class InvoiceComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    
    render(){
        this.shadowRoot.innerHTML = /* html */ `
        <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <div class="row g-3">
            <div class="col-12">
                <label for="numInvoice" class="form-label">Nro Factura</label>
                <input type="text" class="form-control" name="numInvoice" id="numInvoice">
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