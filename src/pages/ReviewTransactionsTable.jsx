import React from 'react';

function ReviewTransactionsTable({ records }) {
    const calculateTotalDebit = () => {
        return records.reduce((total, record) => total + parseFloat(record.debitAmount || 0), 0);
    };

    const calculateTotalCredit = () => {
        return records.reduce((total, record) => total + parseFloat(record.creditAmount || 0), 0);
    };

    return (
        <div className="table-responsive">
            <table id="reviewTransactions" className="table table-bordered daybook">
                <thead>
                    <tr className="heading1">
                        <th className="">Type</th>
                        <th className="">Account Name</th>
                        <th className="">Notes</th>
                        <th className="text-center">Debits</th>
                        <th className="text-center">Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.accountType}</td>
                            <td>{record.accountName}</td>
                            <td>{record.note}</td>
                            <td className="text-center">{record.debitAmount}</td>
                            <td className="text-center">{record.creditAmount}</td>
                        </tr>
                    ))}
                </tbody>
                <thead>
                    <tr className="heading3">
                        <th colSpan="3" className="text-end">Total</th>
                        <th className="text-center" id="reviewTransactionsTotalDebits">{calculateTotalDebit()}</th>
                        <th className="text-center" id="reviewTransactionsTotalCredits">{calculateTotalCredit()}</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}

export default ReviewTransactionsTable;
