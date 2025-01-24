const productTableManager = {
    init() {
        this.addProductButton = document.querySelector('#addProduct');
        this.tableBody = document.querySelector('table tbody');
        this.summaryTable = {
            subtotal: document.getElementById('subtotal'),
            iva: document.getElementById('iva'),
            total: document.getElementById('total'),
        };

        if (this.addProductButton) {
            this.addProductButton.addEventListener('click', () => this.addProductRow());
        }
    },

    addProductRow() {
        const productComponent = document.querySelector('product-component');
        const shadowRoot = productComponent.shadowRoot;
        if (!shadowRoot) {
            alert('El componente no tiene un shadowRoot.');
            return;
        }

        // Extraer datos del componente
        const codProduct = shadowRoot.getElementById('codProduct').textContent.trim();
        const nameProduct = shadowRoot.getElementById('nameProduct').value.trim();
        const unitPrice = shadowRoot.getElementById('unitPrice').value.trim();
        const quantity = shadowRoot.getElementById('quantity').value.trim();

        const productData = { codProduct, nameProduct, unitPrice, quantity };

        // Validar los datos antes de procesarlos
        if (this.validateProductData(productData)) {
            // Verificar si el producto ya existe
            const existingRow = this.findExistingProductRow(nameProduct);
            
            if (existingRow) {
                // Actualizar fila existente
                this.updateExistingProductRow(existingRow, productData);
            } else {
                // Agregar nueva fila
                const subtotal = (parseFloat(unitPrice) * parseInt(quantity)).toFixed(2);
                
                const rowHTML = `
                    <tr>
                        <td>${codProduct}</td>
                        <td>${nameProduct}</td>
                        <td>${unitPrice}</td>
                        <td>${quantity}</td>
                        <td>${subtotal}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-dark remove-btn">X</button>
                        </td>
                    </tr>
                `;

                this.tableBody.innerHTML += rowHTML;
            }

            this.updateTotalSummary();

            // Limpiar los campos del componente
            shadowRoot.getElementById('nameProduct').value = '';
            shadowRoot.getElementById('unitPrice').value = '';
            shadowRoot.getElementById('quantity').value = '';

            // Generar un nuevo código de producto para el siguiente registro
            productComponent.updateProductCode();
        }
    },

    findExistingProductRow(productName) {
        const rows = this.tableBody.querySelectorAll('tr');
        return Array.from(rows).find(row => 
            row.cells[1].textContent.trim() === productName
        );
    },

    updateExistingProductRow(row, newProductData) {
        const quantityCell = row.cells[3];
        const subtotalCell = row.cells[4];
        
        const currentQuantity = parseInt(quantityCell.textContent);
        const newQuantity = currentQuantity + parseInt(newProductData.quantity);
        const unitPrice = parseFloat(row.cells[2].textContent);
        
        const newSubtotal = (unitPrice * newQuantity).toFixed(2);
        
        quantityCell.textContent = newQuantity;
        subtotalCell.textContent = newSubtotal;
    },

    removeProductRow(event) {
        const row = event.target.closest('tr');
        if (row) {
            row.remove();
            this.updateTotalSummary();
        }
    },

    validateProductData(productData) {
        const isValid = Object.values(productData).every(value => value.trim() !== '');
        const isNumericPrice = !isNaN(parseFloat(productData.unitPrice));
        const isNumericQuantity = !isNaN(parseInt(productData.quantity));

        if (!isValid) {
            alert('Por favor complete todo el formulario del producto');
            return false;
        }

        if (!isNumericPrice || !isNumericQuantity) {
            alert('El precio y la cantidad deben ser numéricos');
            return false;
        }

        return true;
    },

    updateTotalSummary() {
        const rows = this.tableBody.querySelectorAll('tr');
        let totalSubtotal = 0;

        rows.forEach(row => {
            const subtotalCell = row.querySelector('td:nth-child(5)');
            if (subtotalCell) {
                totalSubtotal += parseFloat(subtotalCell.textContent) || 0;
            }
        });

        const iva = (totalSubtotal * 0.19).toFixed(2);
        const total = (totalSubtotal * 1.19).toFixed(2);

        // Actualizar la tabla de resumen
        this.summaryTable.subtotal.textContent = totalSubtotal.toFixed(2);
        this.summaryTable.iva.textContent = iva;
        this.summaryTable.total.textContent = total;
    }
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    productTableManager.init();

    // Evento para eliminar productos
    document.querySelector('table tbody').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            productTableManager.removeProductRow(event);
        }
    });
});