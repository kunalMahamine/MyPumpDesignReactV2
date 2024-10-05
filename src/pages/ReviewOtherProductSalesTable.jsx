import React from 'react';

function ReviewOtherProductSalesTable({ products }) {
    const calculateTotalQuantity = () => {
        return products.reduce((total, product) => total + parseFloat(product.quantity || 0), 0);
    };

    const calculateTotalAmount = () => {
        return products.reduce((total, product) => total + parseFloat(product.amount || 0), 0);
    };

    return (
        <div className="table-responsive">
            <table id="reviewOtherProductSale" className="table table-bordered daybook">
                <thead>
                    <tr className="heading1">
                        <th colSpan="5" className="text-center">Other Product Sale</th>
                    </tr>
                    <tr className="heading2">
                        <th className="text-left">Product Name</th>
                        <th className="text-left">Note</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Amount</th>
                    </tr>
                </thead>
                <tbody>
                {products.map((product, index) => (
                    <tr key={index}>
                        <td className="text-left">{product.productName}</td>
                        <td className="text-left">{product.note}</td>
                        <td className="text-center">{product.mrp}</td>
                        <td className="text-center">{product.quantity}</td>
                        <td className="text-end">{parseFloat(product.amount).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
                <thead>
                    <tr className="heading3">
                        <th colSpan="3" className="text-end">Total Other Product Sale</th>
                        <th className="text-center" id="reviewTotalOtherProductSaleQuantity">{calculateTotalQuantity()}</th>
                        <th className="text-end" id="reviewTotalOtherProductSaleAmount">{parseFloat(calculateTotalAmount()).toFixed(2)}</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}

export default ReviewOtherProductSalesTable;
