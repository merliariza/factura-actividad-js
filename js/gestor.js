class InvoiceManager {
    constructor() {
        // Carga facturas de localStorage y verifica si están correctamente cargadas
        this.invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        console.log('Facturas cargadas desde localStorage:', this.invoices); 

        this.tableBody = document.querySelector('table tbody');
        this.summaryTable = {
            subtotal: document.querySelector('#subtotal'),
            iva: document.querySelector('#iva'),
            total: document.querySelector('#total')
        };

        // Llama al método para asociar eventos
        this.bindEvents();
    }

    bindEvents() {
        const payButton = document.querySelector('button[type="submit"]');
        if (payButton) {
            payButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.saveInvoice();
            });
        }

        const addProductButton = document.querySelector('#addProduct');
        if (addProductButton) {
            addProductButton.addEventListener('click', () => this.addProductRow());
        }

        // Event listener para el botón de eliminar producto
        this.tableBody.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('remove-btn')) {
                this.removeProductRow(event.target);
            }
        });

        // Event listener para el botón de borrar facturas
        const clearInvoicesBtn = document.querySelector('#clearInvoicesBtn');
        if (clearInvoicesBtn) {
            clearInvoicesBtn.addEventListener('click', () => {
                this.clearAllInvoices();
            });
        } else {
            console.warn('Botón de "Borrar Facturas" no encontrado.');
        }
    }

    saveInvoice() {
        const invoiceComponent = document.querySelector('invoice-component');
        if (!invoiceComponent || !invoiceComponent.shadowRoot) {
            alert('No se pudo acceder al componente de factura.');
            return;
        }

        const shadowRootInvoice = invoiceComponent.shadowRoot;

        // Genera el número de factura antes de guardarla
        invoiceComponent.updateInvoiceNumber();

        // Obtiene el número de factura actualizado
        const invoiceNumber = shadowRootInvoice.getElementById('invoiceNumber').textContent.trim();
        
        // Valida todos los campos de la factura
        const header = {
            numInvoice: invoiceNumber,
            idInvoice: shadowRootInvoice.getElementById('idInvoice').value.trim() || '',
            name: shadowRootInvoice.getElementById('name').value.trim() || '',
            lastName: shadowRootInvoice.getElementById('lastName').value.trim() || '',
            address: shadowRootInvoice.getElementById('address').value.trim() || '',
            email: shadowRootInvoice.getElementById('email').value.trim() || ''
        };

        // Verifica si todos los campos de encabezado están completos
        const isHeaderComplete = Object.values(header).every(value => value !== '');
        const isProductsAdded = this.tableBody.querySelectorAll('tr').length > 0;

        if (!isHeaderComplete) {
            alert('Por favor complete todos los campos de la factura');
            return;
        }

        if (!isProductsAdded) {
            alert('Debe agregar al menos un producto');
            return;
        }

        // Recopila los detalles del producto
        const productRows = this.tableBody.querySelectorAll('tr');
        const detailInvoice = Array.from(productRows).map(row => ({
            codProduct: row.cells[0].textContent.trim(),
            nameProduct: row.cells[1].textContent.trim(),
            unitPrice: row.cells[2].textContent.trim(),
            quantity: row.cells[3].textContent.trim(),
            subtotal: row.cells[4].textContent.trim()
        }));

        // Recopila la información del resumen
        const summary = {
            subtotal: this.summaryTable.subtotal.textContent.trim(),
            iva: this.summaryTable.iva.textContent.trim(),
            total: this.summaryTable.total.textContent.trim()
        };

        // Crea el objeto de la factura
        const invoice = { header, detailInvoice, summary };

        // Agrega la nueva factura a la lista
        this.invoices.push(invoice);
        
        // Guarda las facturas en localStorage
        localStorage.setItem('invoices', JSON.stringify(this.invoices));

        // Verifica que la factura fue guardada
        console.log('Factura guardada:', invoice);
        console.log('Todas las facturas después de guardar:', this.invoices);

        // Restablece formularios y tabla
        this.resetForms(invoiceComponent);
    }

    resetForms(invoiceComponent) {
        // Limpia los campos del formulario de factura
        const shadowRootInvoice = invoiceComponent.shadowRoot;
        shadowRootInvoice.getElementById('idInvoice').value = '';
        shadowRootInvoice.getElementById('name').value = '';
        shadowRootInvoice.getElementById('lastName').value = '';
        shadowRootInvoice.getElementById('address').value = '';
        shadowRootInvoice.getElementById('email').value = '';

        // Limpia la tabla de productos
        this.tableBody.innerHTML = '';

        // Restablece la tabla de resumen
        this.summaryTable.subtotal.textContent = '0.00';
        this.summaryTable.iva.textContent = '0.00';
        this.summaryTable.total.textContent = '0.00';

        alert('Factura guardada con éxito.');
    }

    addProductRow() {
        const productComponent = document.querySelector('product-component');
        const shadowRoot = productComponent.shadowRoot;
        if (!shadowRoot) {
            alert('El componente no tiene un shadowRoot.');
            return;
        }

        // Extrae datos del componente
        const codProduct = shadowRoot.getElementById('codProduct').textContent.trim();
        const nameProduct = shadowRoot.getElementById('nameProduct').value.trim();
        const unitPrice = shadowRoot.getElementById('unitPrice').value.trim();
        const quantity = shadowRoot.getElementById('quantity').value.trim();

        const productData = { codProduct, nameProduct, unitPrice, quantity };

        // Valida los datos antes de procesarlos
        if (this.validateProductData(productData)) {
            // Verifica si el producto ya existe
            const existingRow = this.findExistingProductRow(nameProduct);

            if (existingRow) {
                // Actualiza la fila existente
                this.updateExistingProductRow(existingRow, productData);
            } else {
                // Agrega una nueva fila
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

            // Limpia los campos del componente
            shadowRoot.getElementById('nameProduct').value = '';
            shadowRoot.getElementById('unitPrice').value = '';
            shadowRoot.getElementById('quantity').value = '';

            // Genera un nuevo código de producto para el siguiente registro
            productComponent.updateProductCode();
        }
    }

    findExistingProductRow(productName) {
        const rows = this.tableBody.querySelectorAll('tr');
        return Array.from(rows).find(row => row.cells[1].textContent.trim() === productName);
    }

    updateExistingProductRow(row, newProductData) {
        const quantityCell = row.cells[3];
        const subtotalCell = row.cells[4];

        const currentQuantity = parseInt(quantityCell.textContent);
        const newQuantity = currentQuantity + parseInt(newProductData.quantity);
        const unitPrice = parseFloat(row.cells[2].textContent);

        const newSubtotal = (unitPrice * newQuantity).toFixed(2);

        quantityCell.textContent = newQuantity;
        subtotalCell.textContent = newSubtotal;

        this.updateTotalSummary();
    }

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
    }

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

        // Actualiza la tabla de resumen
        this.summaryTable.subtotal.textContent = totalSubtotal.toFixed(2);
        this.summaryTable.iva.textContent = iva;
        this.summaryTable.total.textContent = total;
    }

    removeProductRow(button) {
        button.closest('tr').remove();
        this.updateTotalSummary();
    }

    // Método para borrar todas las facturas
    clearAllInvoices() {
        if (confirm('¿Estás seguro de que deseas borrar todas las facturas?')) {
            this.invoices = []; 
            localStorage.removeItem('invoices'); 

            console.log('Todas las facturas han sido borradas.');
            alert('Todas las facturas han sido borradas.');
        }
    }
}

// Inicializa el gestor cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    new InvoiceManager();
});