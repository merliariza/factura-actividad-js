//Importación del modelo de almacenamiento de facturas
import '../models/invoiceModel.js';
//Exportación del componente web para productos
export class ProductComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.updateProductCode();
    }

    updateProductCode() {
        const productCode = this.generateProductCode();
        const codProductElement = this.shadowRoot.getElementById('codProduct');

        if (codProductElement) {
            codProductElement.textContent = productCode;
        }
    }

    generateProductCode() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `PROD-${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

    render() {
        this.shadowRoot.innerHTML = /* html */ `
        <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <div class="row g-3">
            <div class="col-md-6">
                <label for="codProduct" class="form-label">Cod Producto</label>
                <div id="codProduct"></div>
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
        `;
    }
}

customElements.define("product-component", ProductComponent);
