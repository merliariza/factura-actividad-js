import '../models/invoiceModel.js';
export class ProductComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    render(){
        
        this.shadowRoot.innerHTML =  /* html */ `
        <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <div class="row g-3">
            <div class="col-md-6">
                <label for="codProduct" class="form-label">Cod Producto</label>
                <input type="text" class="form-control" name="codProduct" id="codProduct">
            </div>
            <div class="col-12">
                <label for="nameProduct" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nameProduct" id="nameProduct">
            </div>
            <div class="col-md-6">
                <label for="unitPrice" class="form-label">Valor Unitario</label>
                <input type="text" class="form-control" name="unitPrice" id="unitPrice">
            </div>
            <div class="col-md-6">
                <label for="quantity" class="form-label">Cantidad</label>
                <input type="text" class="form-control" name="quantity" id="quantity">
            </div>
        </div>
        `
    }
}
customElements.define("product-component",ProductComponent);