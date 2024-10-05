import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

function RecordTable({ records, addRecord, deleteRecord, ledgers }) {
    const [ledgerTypes, setLedgerTypes] = useState([]);
    const [accountType, setAccountType] = useState('');
    const [accountName, setAccountName] = useState('');
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [isDebitOrCredit, setIsDebitOrCredit] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        const fetchLedgerTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('LedgerType');
                setLedgerTypes(response.data);
            } catch (error) {
                console.error('Error fetching ledger types:', error);
                setError('Failed to load ledger types. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchLedgerTypes();
    }, []);

    //console.log("ledgers: " + JSON.stringify(ledgers));

    //console.log("ledgerTypes: " + JSON.stringify(ledgerTypes));

    // Validation Function
    const validateRecordInputs = () => {
        // Check required fields
        if (!accountType || !accountName || !amount || !isDebitOrCredit) {
            setValidationError('All fields are required, including selecting Debit or Credit.');
            return false;
        }
        // Check valid decimal number and that it is greater than 0
        const isValidDecimal = (value) => /^\d*\.?\d+$/.test(value) && parseFloat(value) >= 0;
        if (!isValidDecimal(amount)) {
            setValidationError('Amount must be a valid positive decimal number.');
            return false;
        }
        // If all checks pass, clear any validation errors
        setValidationError(null);
        return true;
    };

    const handleAddRecord = () => {
        if (!validateRecordInputs()) {
            return; // Do not add record if validation fails
        }
        const newRecord = {
            accountType,
            accountName,
            note,
            amount,
            debitAmount: isDebitOrCredit === 'debitOption' ? amount : '',
            creditAmount: isDebitOrCredit === 'creditOption' ? amount : ''
        };
        addRecord(newRecord);
        setAccountType('');
        setAccountName('');
        setNote('');
        setAmount('');
        setIsDebitOrCredit('');
    };

    const calculateTotalDebit = () => {
        return records.reduce((total, record) => total + parseFloat(record.debitAmount || 0), 0);
    };
    const calculateTotalCredit = () => {
        return records.reduce((total, record) => total + parseFloat(record.creditAmount || 0), 0);
    };
    const filteredLedgers = ledgers.filter(ledger => ledger.ledgerTypeId === parseInt(accountType));
    console.log("filteredLedgers: " + JSON.stringify(filteredLedgers));

    return (
        <div>
            {loading && <p>Loading...</p>}
            <div className="form-card text-start" id="otherRecordForm" name="other-record-form">
                {error && <p className="error text-danger">{error}</p>}
                {validationError && <p className="error text-danger">{validationError}</p>} {/* Show validation errors */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card mb-0">
                            <div className="card-header d-flex justify-content-between flex-wrap">
                                    <div className="form-group d-flex align-items-center">
                                        <div className="header-title me-3" >
                                            <h4 className="card-title">Transactions</h4>
                                        </div>
                                            <select className="form-select me-2" value={accountType} onChange={(e) => setAccountType(e.target.value)} id="recordsAccountType" name="records-account-type"style={{ width: '18%' }} tabIndex="1">
                                                <option selected="" disabled="">Account Type</option>
                                                {ledgerTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </select>
                                            <select className="form-select me-2" value={accountName} onChange={(e) => setAccountName(e.target.value)} id="recordsAccountName" name="records-account-name" style={{ width: '33%' }} tabIndex="2">
                                                <option selected="" disabled="">Account Name</option>
                                                {filteredLedgers.map((ledger) => (
                                                    <option key={ledger.id} value={ledger.name}>{ledger.name}</option>
                                                ))}
                                            </select>
                                                {/* Facility to add new customer, we can work on this later 
                                                <a className="nav-link me-3 text-primary" title="Add new Customer Account" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewCustAct">
                                                    <i className="icon">
                                                        <svg className="icon-32" width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path opacity="0.4" d="M21.101 9.58786H19.8979V8.41162C19.8979 7.90945 19.4952 7.5 18.999 7.5C18.5038 7.5 18.1 7.90945 18.1 8.41162V9.58786H16.899C16.4027 9.58786 16 9.99731 16 10.4995C16 11.0016 16.4027 11.4111 16.899 11.4111H18.1V12.5884C18.1 13.0906 18.5038 13.5 18.999 13.5C19.4952 13.5 19.8979 13.0906 19.8979 12.5884V11.4111H21.101C21.5962 11.4111 22 11.0016 22 10.4995C22 9.99731 21.5962 9.58786 21.101 9.58786Z" fill="currentColor"></path>
                                                            <path d="M9.5 15.0156C5.45422 15.0156 2 15.6625 2 18.2467C2 20.83 5.4332 21.5001 9.5 21.5001C13.5448 21.5001 17 20.8533 17 18.269C17 15.6848 13.5668 15.0156 9.5 15.0156Z" fill="currentColor"></path>                                
                                                            <path opacity="0.4" d="M9.50023 12.5542C12.2548 12.5542 14.4629 10.3177 14.4629 7.52761C14.4629 4.73754 12.2548 2.5 9.50023 2.5C6.74566 2.5 4.5376 4.73754 4.5376 7.52761C4.5376 10.3177 6.74566 12.5542 9.50023 12.5542Z" fill="currentColor"></path>                                
                                                        </svg>
                                                    </i>
                                                </a>
                                                <div className="modal fade" id="staticBackdropAddNewCustAct" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelAddNewCustAct" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabelAddNewCustAct">Add New Customer</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="form-group">
                                                                    <input type="text" className="form-control" id="newCustomerName" placeholder="New Customer Name" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <input type="text" className="form-control" id="newCustomerAddress" placeholder="Address" />
                                                                </div>
                                                                <div className="row">
                                                                <div className="form-group col-9">
                                                                    <input type="text" className="form-control" id="newCustomerCity" placeholder="City/Village" />
                                                                </div>
                                                                <div className="form-group col-3">
                                                                    <input type="text" className="form-control" id="newCustomerPincode" placeholder="PinCode" />
                                                                </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <input type="text" className="form-control" id="newCustomerPhoneNumber" placeholder="Phone Number" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <input type="text" className="form-control" id="newCustomerEmailAddress" placeholder="Email Address" />
                                                                </div>
                                                                <div className="row">
                                                                <div className="form-group col">
                                                                    <input type="text" className="form-control" id="newCustomerLedgerNo" placeholder="Ledger No" />
                                                                </div>
                                                                <div className="form-group col">
                                                                    <input type="text" className="form-control" id="newCustomerOpeningBalance" placeholder="0.00" title="Opening Balance" />
                                                                </div>
                                                                <div className="form-group col">
                                                                    <input type="date" className="form-control" id="newCustomerOpeningBalanceDate" value="2019-12-18" />
                                                                </div>
                                                                </div>
                                                                <div className="row">
                                                                    <span className="col">Balance Type</span>
                                                                    <div className="form-check col">
                                                                        <input className="form-check-input" type="radio" name="new-customer-debit-credit" id="newCustomerDebit" value="newCustomerDebitBalance" />
                                                                        <label className="form-check-label" htmlFor="newCustomerDebit">
                                                                            Debit
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check col">
                                                                        <input className="form-check-input" type="radio" name="new-customer-debit-credit" id="newCustomerCredit" value="newCustomerCreditBalance" />
                                                                        <label className="form-check-label" htmlFor="newCustomerCredit">
                                                                            Credit
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="text-start mt-2 text-center">
                                                                    <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal">Save</button>
                                                                    <button type="button" className="btn btn-danger m-1">Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                        <div className="me-2" style={{ width: '30%' }}>
                                            <input type="text" className="form-control" value={note} onChange={(e) => setNote(e.target.value)} id="recordsNote" name="records-note" placeholder="Note" tabIndex="3" />
                                        </div>
                                        <div className="me-3" style={{ width: '9%' }} > 
                                            <input type="text" className="form-control px-1" value={amount} onChange={(e) => setAmount(e.target.value)} id="recordsAmt" name="records-amt" placeholder="Amount" tabIndex="4" />
                                        </div>
                                        <div className="me-1" style={{ width: '8%' }}>
                                            <input className="form-check-input me-1" type="radio" name="isDebitOrCredit" id="debitOption"
                                                checked={isDebitOrCredit === 'debitOption'}
                                                onChange={() => setIsDebitOrCredit('debitOption')} tabIndex="5" />
                                            <label className="form-check-label" htmlFor="recordsDebit">
                                                Debit
                                            </label>
                                        </div>
                                        <div className="me-2" style={{ width: '8%' }}>
                                            <input className="form-check-input me-1" type="radio" name="isDebitOrCredit" id="creditOption"
                                                checked={isDebitOrCredit === 'creditOption'}
                                                onChange={() => setIsDebitOrCredit('creditOption')} tabIndex="6" />
                                            <label className="form-check-label" htmlFor="recordsCredit">
                                                Credit
                                            </label>
                                        </div>
                                        <button type="button" className="text-center btn btn-primary" id="addRecordButton" name="add-record-button" value="Add" onClick={handleAddRecord} tabIndex="7">Add</button>
                                    </div>
                            </div>
                            <div className="card-body mt-0 mb-0">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped" id="recordTable" name="record-table">
                                        <thead >
                                            <tr className="custom-bg-blue-white">
                                                <th>#</th>
                                                <th className="">TYPE</th>
                                                <th className="">ACCOUNT NAME</th>
                                                <th className="">NOTES</th>
                                                <th className="text-center">DEBIT</th>
                                                <th className="text-center">CREDIT</th>
                                                    <th className="text-center p-4" style={{ width: '20px' }}></th> 
                                            </tr>
                                        </thead>
                                        <tbody id="recordTableBody">
                                            {records.map((record, index) => (
                                                <tr key={index}>
                                                    <td className="text-center px-1">{index+1}</td>
                                                    <td>{ledgerTypes.find(type => type.id === parseInt(record.accountType))?.name}</td>
                                                    <td>{record.accountName}</td>
                                                    <td>{record.note}</td>
                                                    <td className="text-center">{record.debitAmount}</td>
                                                    <td className="text-center">{record.creditAmount}</td>
                                                    <td className="text-center px-0">
                                                        <a className="btn btn-sm btn-icon text-danger" title="Delete Transaction" id={`recordDeleteIcon-${index+1}`} name="delete-record-row" onClick={() => deleteRecord(index)}>
                                                            <span className="btn-inner">
                                                                <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                                    <path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    <path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                </svg>
                                                            </span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                           
                                        </tbody>
                                        <thead>
                                            <tr className="heading3">
                                                <th colSpan="4" className="text-end">Total</th>
                                                <th className="text-center" id="totalDebitAmount">{calculateTotalDebit()}</th>
                                                <th className="text-center" id="totalCreditAmount">{calculateTotalCredit()}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordTable;