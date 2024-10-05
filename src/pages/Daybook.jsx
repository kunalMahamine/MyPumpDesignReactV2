import React, { useEffect, useState  } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import OtherProductSalesTable from './OtherProductSalesTable';
import ReviewOtherProductSalesTable from './ReviewOtherProductSalesTable';
import RecordTable from './RecordTable';
import ReviewTransactionsTable from './ReviewTransactionsTable';

import apiClient from '../utils/apiClient'; // Your Axios instance
import Notification from '../utils/notification'; // Your notification component

function Daybook() {
    const [products, setProducts] = useState([]);
    const [records, setRecords] = useState([]);
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    const [latestDate, setLatestDate] = useState(null);
    const [currentTab, setCurrentTab] = useState(0); // State to keep track of the current tab

    useEffect(() => {
        if (!navigator.onLine) {
            setLoading(false);
            setError('You are currently offline. Please check your internet connection.');
        } else {
            const fetchLedgers = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await apiClient.get('Ledger');
                    setLedgers(response.data);
                } catch (error) {
                    console.error('Error fetching ledgers:', error);
                    setError('Failed to load ledgers. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            fetchLedgers();
        }
    }, []);
    // Fetch latest daybook date
    useEffect(() => {
        const fetchLatestDate = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('DayBooks/latest');
                console.log("database Date:" +JSON.stringify(response.data.date) );
                if (response.data) {
                    setLatestDate(new Date(response.data.date));
                }
            } catch (error) {
                console.error('Error fetching latest date:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchLatestDate();
    }, []);

    // Function to move to the next or previous tab
    const showTab = (index) => {
        const x = document.getElementsByTagName("fieldset");
        Array.from(x).forEach((fieldset, i) => {
            fieldset.style.display = i === index ? "block" : "none";
        });
        setCurrentTab(index);
        updateActiveTab(index);
    };
    // Update the active state of the tab
    const updateActiveTab = (index) => {
        const tabs = ["fuel", "other", "records", "stock", "review", "confirm"];
        tabs.forEach((tab, i) => {
            const element = document.getElementById(tab);
            if (i === index) {
                element.classList.add("active");
                element.classList.remove("done");
            } else if (i < index) {
                element.classList.remove("active");
                element.classList.add("done");
            } else {
                element.classList.remove("active", "done");
            }
        });
    };
    // Use state for controlling next and previous navigation
    const handleNext = () => {
        showTab(currentTab + 1);
    };
    const handlePrevious = () => {
        showTab(currentTab - 1);
    };
        // Validation Functions
    const isValidDecimalNumber = (value) => /^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0;
    
    const validateFuelInputs = () => {
        const dayBookDate = new Date(document.getElementById("dayBookDate").value);
        const priceMs = document.getElementById("priceMs").value;
        const priceHsd = document.getElementById("priceHsd").value;
        // Validate Date: Required and should be one day greater than the latest daybook date
        if (!dayBookDate || isNaN(dayBookDate.getTime())) {
            setValidationError('Please enter a valid date.');
            return false;
        }
        if (latestDate) {
            // Create a new date object for the day after the latestDate
            const nextDayAfterLatest = new Date(latestDate);
            nextDayAfterLatest.setDate(nextDayAfterLatest.getDate() + 1);
            console.log("latestDate:" + latestDate);
            console.log("daybookdate:" + dayBookDate.toDateString());
            console.log("new date:" + nextDayAfterLatest.toDateString());
            console.log("condition1: " + (dayBookDate.toDateString() !== nextDayAfterLatest.toDateString()));
            if (dayBookDate.toDateString() !== nextDayAfterLatest.toDateString()) {
                setValidationError('Date should be one day greater than the last record date.');
                return false;
            }
        }
        // Validate Prices and Readings
        const idsToCheck = [
            'priceMs', 'priceHsd', 'msOpeningReadingP1', 'msOpeningReadingP2', 'hsdOpeningReadingP3', 'hsdOpeningReadingP4',
            'msClosingReadingP1', 'msClosingReadingP2', 'hsdClosingReadingP3', 'hsdClosingReadingP4', 'msTestP1', 'msTestP2',
            'hsdTestP3', 'hsdTestP4', 'msSoldP1', 'msSoldP2', 'hsdSoldP3', 'hsdSoldP4', 'msDispensedP1', 'msDispensedP2',
            'hsdDispensedP3', 'hsdDispensedP4', 'msSoldAmtP1', 'msSoldAmtP2', 'hsdSoldAmtP3', 'hsdSoldAmtP4'
        ];
        for (let id of idsToCheck) {
            const element = document.getElementById(id);
            if (!isValidDecimalNumber(element.value)) {
                setValidationError(`Invalid input for ${element.name}. Only non-negative decimal numbers are allowed.`);
                return false;
            }
        }
        // Check additional conditions: Sold litres and Test litres constraints
        const dispensedLitres = [
            { dispensed: 'msDispensedP1', sold: 'msSoldP1', test: 'msTestP1' },
            { dispensed: 'msDispensedP2', sold: 'msSoldP2', test: 'msTestP2' },
            { dispensed: 'hsdDispensedP3', sold: 'hsdSoldP3', test: 'hsdTestP3' },
            { dispensed: 'hsdDispensedP4', sold: 'hsdSoldP4', test: 'hsdTestP4' }
        ];
        for (let litre of dispensedLitres) {
            const dispensed = parseFloat(document.getElementById(litre.dispensed).value) || 0;
            const sold = parseFloat(document.getElementById(litre.sold).value) || 0;
            const test = parseFloat(document.getElementById(litre.test).value) || 0;
            if (sold > dispensed) {
                setValidationError('Sold litres cannot be greater than dispensed litres.');
                return false;
            }
            if (test > dispensed) {
                setValidationError('Test litres cannot be greater than dispensed litres.');
                return false;
            }
        }
        setValidationError(null);
        return true;
    };
    
    const validateStockInputs = () => {
        // Validate Stock Inputs
        const idsToCheck = [
            'msSystemClosing', 'hsdSystemClosing', 'msOpeningStock', 'hsdOpeningStock', 'msClosingStock', 'hsdClosingStock',
            'msReceiptStock', 'hsdReceiptStock', 'msPurchaseCost', 'hsdPurchaseCost', 'msPurchaseAmount', 'hsdPurchaseAmount'
        ];
        for (let id of idsToCheck) {
            const element = document.getElementById(id);
            if (!isValidDecimalNumber(element.value)) {
                setValidationError(`Invalid input for ${element.name}. Only non-negative decimal numbers are allowed.`);
                return false;
            }
        }
        // Additional validation for closing stocks
        const msClosingStock = parseFloat(document.getElementById('msClosingStock').value) || 0;
        const msOpeningStock = parseFloat(document.getElementById('msOpeningStock').value) || 0;
        const msReceiptStock = parseFloat(document.getElementById('msReceiptStock').value) || 0;
        const hsdClosingStock = parseFloat(document.getElementById('hsdClosingStock').value) || 0;
        const hsdOpeningStock = parseFloat(document.getElementById('hsdOpeningStock').value) || 0;
        const hsdReceiptStock = parseFloat(document.getElementById('hsdReceiptStock').value) || 0;

        if (msClosingStock > (msOpeningStock + msReceiptStock)) {
            setValidationError('MS Closing Stock cannot be greater than MS Opening Stock + MS Receipt Stock.');
            return false;
        }
        if (hsdClosingStock > (hsdOpeningStock + hsdReceiptStock)) {
            setValidationError('HSD Closing Stock cannot be greater than HSD Opening Stock + HSD Receipt Stock.');
            return false;
        }
        setValidationError(null);
        return true;
    };
    
    const validateReviewInputs = () => {
        const countedCashInput = document.getElementById('reviewCountedCashInput').value;
        const calculatedCash = parseFloat(document.getElementById('reviewCalculatedCash').textContent);
        if (!isValidDecimalNumber(countedCashInput)) {
            setValidationError('Invalid input for Counted Cash. Only non-negative decimal numbers are allowed.');
            return false;
        }
        if (parseFloat(countedCashInput) !== calculatedCash) {
            setValidationError('Counted cash must match the calculated cash balance.');
            return false;
        }
        setValidationError(null);
        return true;
    };
        // Handle button clicks with validation checks
    const handleFuelSaleNext = () => {
        if (validateFuelInputs()) {
            handleNext();
        }
    };
    const handleStockNext = () => {
        if (validateStockInputs()) {
            updateValues({ target: document.getElementById('dayBookDate') }); // Pass the event-like object to update values
            handleNext();
        }
    };
    const handleReviewSubmit = async () => {
        if (validateReviewInputs()) {
            setLoading(true);
            await handleSubmit();
            setLoading(false);
        }
    };

    // Function to fetch data from backend based on the selected date
    const fetchDataForDate = async (formattedPreviousDayBookDateValue) => {
        const fetchData = async (endpoint, params) => {
            try {
                setLoading(true);
                const response = await apiClient.get(endpoint, { params });
                return response.data || [];
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
                setError('Failed to load data. Please try again.');
                return [];
            }finally {
                setLoading(false);
            }
        };

        const msResponseOpeningReadingP1 = await fetchData('PumpReadings', { pumpId: 1, date: formattedPreviousDayBookDateValue });
        const msResponseOpeningReadingP2 = await fetchData('PumpReadings', { pumpId: 2, date: formattedPreviousDayBookDateValue });
        const hsdResponseOpeningReadingP3 = await fetchData('PumpReadings', { pumpId: 3, date: formattedPreviousDayBookDateValue });
        const hsdResponseOpeningReadingP4 = await fetchData('PumpReadings', { pumpId: 4, date: formattedPreviousDayBookDateValue });

        const msOpeningReadingP1 = (msResponseOpeningReadingP1 && msResponseOpeningReadingP1.length > 0) ? msResponseOpeningReadingP1[0].closingReading : 0;
        const msOpeningReadingP2 = (msResponseOpeningReadingP2 && msResponseOpeningReadingP2.length > 0) ? msResponseOpeningReadingP2[0].closingReading : 0;
        const hsdOpeningReadingP3 = (hsdResponseOpeningReadingP3 && hsdResponseOpeningReadingP3.length > 0) ? hsdResponseOpeningReadingP3[0].closingReading : 0;
        const hsdOpeningReadingP4 = (hsdResponseOpeningReadingP4 && hsdResponseOpeningReadingP4.length > 0) ? hsdResponseOpeningReadingP4[0].closingReading : 0;

        document.getElementById("msOpeningReadingP1").value = msOpeningReadingP1;
        document.getElementById("msOpeningReadingP2").value = msOpeningReadingP2;
        document.getElementById("hsdOpeningReadingP3").value = hsdOpeningReadingP3;
        document.getElementById("hsdOpeningReadingP4").value = hsdOpeningReadingP4;

        const msResponseOpeningStock = await fetchData('FuelDaily', { fuelId: 1, date: formattedPreviousDayBookDateValue });
        const hsdResponseOpeningStock = await fetchData('FuelDaily', { fuelId: 2, date: formattedPreviousDayBookDateValue });

        const msOpeningStock = (msResponseOpeningStock && msResponseOpeningStock.length > 0) ? msResponseOpeningStock[0].closingStock : 0;
        const hsdOpeningStock = (hsdResponseOpeningStock && hsdResponseOpeningStock.length > 0) ? hsdResponseOpeningStock[0].closingStock : 0;

        document.getElementById("msOpeningStock").value = msOpeningStock;
        document.getElementById("hsdOpeningStock").value = hsdOpeningStock;

        return { msOpeningReadingP1, msOpeningReadingP2, hsdOpeningReadingP3, hsdOpeningReadingP4, msOpeningStock, hsdOpeningStock };
    };

    const updateValues = async(event) => {
        setValidationError(null);
        const target = event.target;
        let msOpeningReadingP1 = 0, msOpeningReadingP2 = 0, hsdOpeningReadingP3 = 0, hsdOpeningReadingP4 = 0;
        let msOpeningStock = 0, hsdOpeningStock = 0;
        let formattedDayBookDate = '';

        if (target.id === "dayBookDate") {
            // Only fetch data when the dayBookDate changes
            if (!target.value) {
                setValidationError('Please select a valid date.');
                return;
            }

            const dayBookDateValue = new Date(target.value);
            formattedDayBookDate = dayBookDateValue.toLocaleDateString('en-GB');

            const previousDayBookDateValue = new Date(dayBookDateValue);
            previousDayBookDateValue.setDate(previousDayBookDateValue.getDate() - 1);
            const formattedPreviousDayBookDateValue = previousDayBookDateValue.toLocaleDateString('en-US');

            console.log("dayBookDateValue: " + dayBookDateValue);
            console.log("formattedDayBookDate: " + formattedDayBookDate);
            console.log("formattedPreviousDayBookDateValue: " + formattedPreviousDayBookDateValue);

            const fetchedData = await fetchDataForDate(formattedPreviousDayBookDateValue);
            msOpeningReadingP1 = fetchedData.msOpeningReadingP1;
            msOpeningReadingP2 = fetchedData.msOpeningReadingP2;
            hsdOpeningReadingP3 = fetchedData.hsdOpeningReadingP3;
            hsdOpeningReadingP4 = fetchedData.hsdOpeningReadingP4;
            msOpeningStock = fetchedData.msOpeningStock;
            hsdOpeningStock = fetchedData.hsdOpeningStock;
        } else {
            // Get the previously fetched values from the document elements
            msOpeningReadingP1 = parseFloat(document.getElementById("msOpeningReadingP1").value) || 0;
            msOpeningReadingP2 = parseFloat(document.getElementById("msOpeningReadingP2").value) || 0;
            hsdOpeningReadingP3 = parseFloat(document.getElementById("hsdOpeningReadingP3").value) || 0;
            hsdOpeningReadingP4 = parseFloat(document.getElementById("hsdOpeningReadingP4").value) || 0;
            msOpeningStock = parseFloat(document.getElementById("msOpeningStock").value) || 0;
            hsdOpeningStock = parseFloat(document.getElementById("hsdOpeningStock").value) || 0;
        }
        
        var priceMs = parseFloat(document.getElementById("priceMs").value);
        var priceHsd = parseFloat(document.getElementById("priceHsd").value);
  
        var msClosingReadingP1 = parseFloat(document.getElementById("msClosingReadingP1").value);
        var msClosingReadingP2 = parseFloat(document.getElementById("msClosingReadingP2").value);
        var hsdClosingReadingP3 = parseFloat(document.getElementById("hsdClosingReadingP3").value);
        var hsdClosingReadingP4 = parseFloat(document.getElementById("hsdClosingReadingP4").value);

        var msTestP1 = parseFloat(document.getElementById("msTestP1").value);
        var msTestP2 = parseFloat(document.getElementById("msTestP2").value);
        var hsdTestP3 = parseFloat(document.getElementById("hsdTestP3").value);
        var hsdTestP4 = parseFloat(document.getElementById("hsdTestP4").value);

        var msSystemClosing = parseFloat(document.getElementById("msSystemClosing").value)
        var hsdSystemClosing = parseFloat(document.getElementById("hsdSystemClosing").value) 
        var msReceiptStock = parseFloat(document.getElementById("msReceiptStock").value);
        var hsdReceiptStock = parseFloat(document.getElementById("hsdReceiptStock").value);
        var msPurchaseCost = parseFloat(document.getElementById("msPurchaseCost").value);
        var hsdPurchaseCost = parseFloat(document.getElementById("hsdPurchaseCost").value);

        // Calculate the values
        var msDispensedP1 = msClosingReadingP1 - msOpeningReadingP1;
        var msDispensedP2 = msClosingReadingP2 - msOpeningReadingP2;
        var hsdDispensedP3 = hsdClosingReadingP3 - hsdOpeningReadingP3;
        var hsdDispensedP4 = hsdClosingReadingP4 - hsdOpeningReadingP4;
        var msSoldP1 = msDispensedP1 - msTestP1;
        var msSoldP2 = msDispensedP2 - msTestP2;
        var hsdSoldP3 = hsdDispensedP3 - hsdTestP3;
        var hsdSoldP4 = hsdDispensedP4 - hsdTestP4;
        var msSoldAmtP1 = msSoldP1 * priceMs;
        var msSoldAmtP2 = msSoldP2 * priceMs;
        var hsdSoldAmtP3 = hsdSoldP3 * priceHsd;
        var hsdSoldAmtP4 = hsdSoldP4 * priceHsd;

        var msClosingStock = msOpeningStock - msSoldP1 - msSoldP2 + msReceiptStock;
        var hsdClosingStock = hsdOpeningStock - hsdSoldP3 - hsdSoldP4 + hsdReceiptStock;
        var msPurchaseAmount = msPurchaseCost * msReceiptStock;
        var hsdPurchaseAmount = hsdPurchaseCost * hsdReceiptStock;

        // Update the DOM elements
        document.getElementById("msDispensedP1").value = parseFloat(msDispensedP1).toFixed(3);
        document.getElementById("msDispensedP2").value = parseFloat(msDispensedP2).toFixed(3);
        document.getElementById("hsdDispensedP3").value = parseFloat(hsdDispensedP3).toFixed(3);
        document.getElementById("hsdDispensedP4").value = parseFloat(hsdDispensedP4).toFixed(3);
        document.getElementById("msSoldP1").value = parseFloat(msSoldP1).toFixed(3);
        document.getElementById("msSoldP2").value = parseFloat(msSoldP2).toFixed(3);
        document.getElementById("hsdSoldP3").value = parseFloat(hsdSoldP3).toFixed(3);
        document.getElementById("hsdSoldP4").value = parseFloat(hsdSoldP4).toFixed(3);
        document.getElementById("msSoldAmtP1").value = parseFloat(msSoldAmtP1).toFixed(2);
        document.getElementById("msSoldAmtP2").value = parseFloat(msSoldAmtP2).toFixed(2);
        document.getElementById("hsdSoldAmtP3").value = parseFloat(hsdSoldAmtP3).toFixed(2);
        document.getElementById("hsdSoldAmtP4").value = parseFloat(hsdSoldAmtP4).toFixed(2);
        document.getElementById("msClosingStock").value =Math.round(msClosingStock);
        document.getElementById("hsdClosingStock").value = Math.round(hsdClosingStock);
        document.getElementById("msPurchaseAmount").value = parseFloat(msPurchaseAmount).toFixed(2);
        document.getElementById("hsdPurchaseAmount").value = parseFloat(hsdPurchaseAmount).toFixed(2);

        // Update the review tab tables cells with the calculated values
        //document.getElementById("reviewDate").textContent = formattedDayBookDate;
        if (formattedDayBookDate) {
            document.getElementById("reviewDate").textContent = formattedDayBookDate;
        }

        document.getElementById("reviewMSPrice").textContent = priceMs;
        document.getElementById("reviewHSDPrice").textContent = priceHsd;
        document.getElementById("reviewMsOpeningReadingsP1").textContent = parseFloat(msOpeningReadingP1).toFixed(3);
        document.getElementById("reviewMsClosingReadingsP1").textContent = parseFloat(msClosingReadingP1).toFixed(3);
        document.getElementById("reviewMsDispensedP1").textContent = parseFloat(msDispensedP1).toFixed(3);
        document.getElementById("reviewMsTestP1").textContent = msTestP1;
        document.getElementById("reviewMsSoldP1").textContent = parseFloat(msSoldP1).toFixed(3);
        document.getElementById("reviewMsSoldAmountP1").textContent = parseFloat(msSoldAmtP1).toFixed(2);

        document.getElementById("reviewMsOpeningReadingsP2").textContent = parseFloat(msOpeningReadingP2).toFixed(3);
        document.getElementById("reviewMsClosingReadingsP2").textContent = parseFloat(msClosingReadingP2).toFixed(3);
        document.getElementById("reviewMsDispensedP2").textContent = parseFloat(msDispensedP2).toFixed(3);
        document.getElementById("reviewMsTestP2").textContent = msTestP2;
        document.getElementById("reviewMsSoldP2").textContent = parseFloat(msSoldP2).toFixed(3);
        document.getElementById("reviewMsSoldAmountP2").textContent = parseFloat(msSoldAmtP2).toFixed(2);

        document.getElementById("reviewHsdOpeningReadingsP3").textContent = parseFloat(hsdOpeningReadingP3).toFixed(3);
        document.getElementById("reviewHsdClosingReadingsP3").textContent = parseFloat(hsdClosingReadingP3).toFixed(3);
        document.getElementById("reviewHsdDispensedP3").textContent = parseFloat(hsdDispensedP3).toFixed(3);
        document.getElementById("reviewHsdTestP3").textContent = hsdTestP3;
        document.getElementById("reviewHsdSoldP3").textContent = parseFloat(hsdSoldP3).toFixed(3);
        document.getElementById("reviewHsdSoldAmountP3").textContent = parseFloat(hsdSoldAmtP3).toFixed(2);

        document.getElementById("reviewHsdOpeningReadingsP4").textContent = parseFloat(hsdOpeningReadingP4).toFixed(3);
        document.getElementById("reviewHsdClosingReadingsP4").textContent = parseFloat(hsdClosingReadingP4).toFixed(3);
        document.getElementById("reviewHsdDispensedP4").textContent = parseFloat(hsdDispensedP4).toFixed(3);
        document.getElementById("reviewHsdTestP4").textContent = hsdTestP4;
        document.getElementById("reviewHsdSoldP4").textContent = parseFloat(hsdSoldP4).toFixed(3);
        document.getElementById("reviewHsdSoldAmountP4").textContent = parseFloat(hsdSoldAmtP4).toFixed(2);

        var reviewTotalFuelSale = msSoldAmtP1 + msSoldAmtP2 + hsdSoldAmtP3 + hsdSoldAmtP4;
        document.getElementById("reviewTotalFuelSale").textContent = parseFloat(reviewTotalFuelSale).toFixed(2);

        document.getElementById("reviewMsSystemClosingStock").textContent = msSystemClosing;
        document.getElementById("reviewMsOpeningStock").textContent = msOpeningStock;
        document.getElementById("reviewMsClosingStock").textContent = msClosingStock;
        document.getElementById("reviewMsPurchasedStock").textContent = msReceiptStock;
        document.getElementById("reviewMsPurchaseCost").textContent = msPurchaseCost;
        document.getElementById("reviewMsPurchaseAmount").textContent = parseFloat(msPurchaseAmount).toFixed(2);

        document.getElementById("reviewHsdSystemClosingStock").textContent = hsdSystemClosing;
        document.getElementById("reviewHsdOpeningStock").textContent = hsdOpeningStock;
        document.getElementById("reviewHsdClosingStock").textContent = hsdClosingStock;
        document.getElementById("reviewHsdPurchasedStock").textContent = hsdReceiptStock;
        document.getElementById("reviewHsdPurchaseCost").textContent = hsdPurchaseCost;
        document.getElementById("reviewHsdPurchaseAmount").textContent = parseFloat(hsdPurchaseAmount).toFixed(2);

        // Calculate the total sales revenue
        var totalOtherProductSaleAmount = parseFloat(document.getElementById("totalOtherProductsSaleAmount").textContent).toFixed(2);;
        var reviewTotalSalesRevenue = parseFloat(reviewTotalFuelSale) + parseFloat(totalOtherProductSaleAmount);
        document.getElementById("reviewTotalSalesRevenue").textContent = parseFloat(reviewTotalSalesRevenue).toFixed(2);
        // Get the total credits and total debits from the reviewTransactions table
        var reviewTotalCreditTransactions = parseFloat(document.getElementById("totalCreditAmount").textContent);
        var reviewTotalDebitTransactions = parseFloat(document.getElementById("totalDebitAmount").textContent);
        // Calculate the cash balance
        var cashBalance = parseFloat(reviewTotalSalesRevenue) + parseFloat(reviewTotalCreditTransactions) - parseFloat(reviewTotalDebitTransactions);
        document.getElementById("reviewTotalCredits").textContent = parseFloat(reviewTotalCreditTransactions).toFixed(2);
        document.getElementById("reviewTotalDebits").textContent = parseFloat(reviewTotalDebitTransactions).toFixed(2);
        document.getElementById("reviewCashBalance").textContent = parseFloat(cashBalance).toFixed(2);
        document.getElementById("reviewCalculatedCash").textContent = parseFloat(cashBalance).toFixed(2);
       
        console.log('updateValues called');
      };
    
    // useEffect(() => {
    //     // If there are any initializations or cleanups needed for updateValues
    //   }, []);

    //************************************************************For Date input ************************************************************//
    const todaysDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        showTab(currentTab); // Show the initial tab
    }, [currentTab]);


    //************************************************* For Form-Wizard Features *******************************************************************//
    // useEffect(() => {
    //     let currentTab = 0;
    //     const showTab = (n) => {
    //         const x = document.getElementsByTagName("fieldset");
    //         x[n].style.display = "block";
    //         ActiveTab(n);
    //     }
    //     const nextBtnFunction = (n) => {
    //         const x = document.getElementsByTagName("fieldset");
    //         x[currentTab].style.display = "none";
    //         currentTab = currentTab + n;
    //         showTab(currentTab);
    //     }
    //     const ActiveTab = (n) => {
    //         if (n === 0) {
    //             document.getElementById("fuel").classList.add("active");
    //             document.getElementById("fuel").classList.remove("done");
                
    //             document.getElementById("other").classList.remove("done");
    //             document.getElementById("other").classList.remove("active");
    //             document.getElementById("records").classList.remove("done");
    //             document.getElementById("records").classList.remove("active");
    //             document.getElementById("stock").classList.remove("done");
    //             document.getElementById("stock").classList.remove("active");
    //             document.getElementById("review").classList.remove("done");
    //             document.getElementById("review").classList.remove("active");
    //             document.getElementById("confirm").classList.remove("done");
    //             document.getElementById("confirm").classList.remove("active");
    //         }
    //         if (n === 1) {
    //             document.getElementById("fuel").classList.add("done");
    //             document.getElementById("other").classList.add("active");
    //             document.getElementById("other").classList.remove("done");
                
    //             document.getElementById("records").classList.remove("done");
    //             document.getElementById("records").classList.remove("active");
    //             document.getElementById("stock").classList.remove("done");
    //             document.getElementById("stock").classList.remove("active");
    //             document.getElementById("review").classList.remove("done");
    //             document.getElementById("review").classList.remove("active");
    //             document.getElementById("confirm").classList.remove("done");
    //             document.getElementById("confirm").classList.remove("active");
    //         }
    //         if (n === 2) {
    //             document.getElementById("fuel").classList.add("done");
    //             document.getElementById("other").classList.add("done");
    //             document.getElementById("records").classList.add("active");
    //             document.getElementById("records").classList.remove("done");
                
    //             document.getElementById("stock").classList.remove("done");
    //             document.getElementById("stock").classList.remove("active");
    //             document.getElementById("review").classList.remove("done");
    //             document.getElementById("review").classList.remove("active");
    //             document.getElementById("confirm").classList.remove("done");
    //             document.getElementById("confirm").classList.remove("active");
    //         }
    //         if (n === 3) {
    //             document.getElementById("fuel").classList.add("done");
    //             document.getElementById("other").classList.add("done");
    //             document.getElementById("records").classList.add("done");
    //             document.getElementById("stock").classList.add("active");
    //             document.getElementById("stock").classList.remove("done");
                
    //             document.getElementById("review").classList.remove("done");
    //             document.getElementById("review").classList.remove("active");
    //             document.getElementById("confirm").classList.remove("done");
    //             document.getElementById("confirm").classList.remove("active");
    //         }
    //         if(n===4){
    //             document.getElementById("fuel").classList.add("done");
    //             document.getElementById("other").classList.add("done");
    //             document.getElementById("records").classList.add("done");
    //             document.getElementById("stock").classList.add("done");
    //             document.getElementById("review").classList.add("active");
    //             document.getElementById("review").classList.remove("done");
                            
    //             document.getElementById("confirm").classList.remove("done");
    //             document.getElementById("confirm").classList.remove("active");
    //         }
    //         if(n===5){
    //             document.getElementById("fuel").classList.add("done");
    //             document.getElementById("other").classList.add("done");
    //             document.getElementById("records").classList.add("done");
    //             document.getElementById("stock").classList.add("done");
    //             document.getElementById("review").classList.add("done");
                
    //             document.getElementById("confirm").classList.add("active");                        
    //             document.getElementById("confirm").classList.remove("done");
    //         }
    //     }
    //     const nextbtn = document.querySelectorAll('.next');
    //     Array.from(nextbtn, (nbtn) => {
    //         nbtn.addEventListener('click', function () {
    //             nextBtnFunction(1);
    //         });
    //     });
    //     const prebtn = document.querySelectorAll('.previous');
    //     Array.from(prebtn, (pbtn) => {
    //         pbtn.addEventListener('click', function () {
    //             nextBtnFunction(-1);
    //         });
    //     });

    //     showTab(currentTab);
    // }, []);
//************************************************* For Form-Wizard Features *******************************************************************//

//************************************************* To update Record table and ReviewTransactionsTable ***************************************//
    const addRecord = (newRecord) => {
        setRecords([...records, newRecord]);
    };
    const deleteRecord = (index) => {
        const updatedRecords = records.filter((_, i) => i !== index);
        setRecords(updatedRecords);
    };
//************************************************* To update Record table and ReviewTransactionsTable ***************************************//

//************************************************* To update OtherProductSalesTable and reviewOtherProductSales Table ***************************************//
const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
};
const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
};
//************************************************* To update OtherProductSalesTable and reviewOtherProductSales Table ***************************************//

const calculateTotalQuantity = () => {
    return products.reduce((total, product) => total + parseFloat(product.quantity || 0), 0);
};
const calculateTotalAmount = () => {
    return products.reduce((total, product) => total + parseFloat(product.amount || 0), 0);
};

const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    const dayBookDateValue = document.getElementById("dayBookDate").value;
    const formattedDayBookDate = new Date(dayBookDateValue).toISOString().split('T')[0];
    const daybook = {
        date: formattedDayBookDate,
        createdBy: 1,
        totalFuelSale: parseFloat(document.getElementById("reviewTotalFuelSale").textContent),
        otherProductTotalSoldQuantity: parseFloat(document.getElementById("reviewTotalOtherProductSaleQuantity").textContent),
        otherProductTotalSoldAmount: parseFloat(document.getElementById("reviewTotalOtherProductSaleAmount").textContent),
        totalCredits: parseFloat(document.getElementById("reviewTransactionsTotalCredits").textContent),
        totalDebits: parseFloat(document.getElementById("reviewTransactionsTotalDebits").textContent),
        drawerCash: parseFloat(document.getElementById("reviewCashBalance").textContent),
        daybookNote: document.getElementById("reviewTabNote").value,
        };
    const pumpReadings = [
        {
            pumpId: 1,
            openingReading: parseFloat(document.getElementById("msOpeningReadingP1").value),
            closingReading: parseFloat(document.getElementById("msClosingReadingP1").value),
            date: formattedDayBookDate,
            createdBy: 1
        },
        {
            pumpId: 2,
            openingReading: parseFloat(document.getElementById("msOpeningReadingP2").value),
            closingReading: parseFloat(document.getElementById("msClosingReadingP2").value),
            date: formattedDayBookDate,
            createdBy: 1
        },
        {
            pumpId: 3,
            openingReading: parseFloat(document.getElementById("hsdOpeningReadingP3").value),
            closingReading: parseFloat(document.getElementById("hsdClosingReadingP3").value),
            date: formattedDayBookDate,
            createdBy: 1
        },
        {
            pumpId: 4,
            openingReading: parseFloat(document.getElementById("hsdOpeningReadingP4").value),
            closingReading: parseFloat(document.getElementById("hsdClosingReadingP4").value),
            date: formattedDayBookDate,
            createdBy: 1
        }
        ];
    const fuelDailies = [
        {
            fuelId: 1,
            openingStock: parseFloat(document.getElementById("msOpeningStock").value),
            purchasedStock: parseFloat(document.getElementById("msReceiptStock").value),
            purchasedprice: parseFloat(document.getElementById("msPurchaseCost").value),
            closingStock: parseFloat(document.getElementById("msClosingStock").value),
            dispensedLiters: parseFloat(document.getElementById("msDispensedP1").value) + parseFloat(document.getElementById("msDispensedP2").value),
            testLiters: parseFloat(document.getElementById("msTestP1").value) + parseFloat(document.getElementById("msTestP2").value),
            soldLiters: parseFloat(document.getElementById("msSoldP1").value) + parseFloat(document.getElementById("msSoldP2").value),
            price: parseFloat(document.getElementById("priceMs").value),
            soldAmount: parseFloat(document.getElementById("msSoldAmtP1").value) + parseFloat(document.getElementById("msSoldAmtP2").value),
            systemClosingLiters: parseFloat(document.getElementById("msSystemClosing").value),
            date: formattedDayBookDate,
            createdBy: 1
        },
        {
            fuelId: 2,
            openingStock: parseFloat(document.getElementById("hsdOpeningStock").value),
            purchasedStock: parseFloat(document.getElementById("hsdReceiptStock").value),
            purchasedprice: parseFloat(document.getElementById("hsdPurchaseCost").value),
            closingStock: parseFloat(document.getElementById("hsdClosingStock").value),
            dispensedLiters: parseFloat(document.getElementById("hsdDispensedP3").value) + parseFloat(document.getElementById("hsdDispensedP4").value),
            testLiters: parseFloat(document.getElementById("hsdTestP3").value) + parseFloat(document.getElementById("hsdTestP4").value),
            soldLiters: parseFloat(document.getElementById("hsdSoldP3").value) + parseFloat(document.getElementById("hsdSoldP4").value),
            price: parseFloat(document.getElementById("priceHsd").value),
            soldAmount: parseFloat(document.getElementById("hsdSoldAmtP3").value) + parseFloat(document.getElementById("hsdSoldAmtP4").value),
            systemClosingLiters: parseFloat(document.getElementById("hsdSystemClosing").value),
            date: formattedDayBookDate,
            createdBy: 1
        }
        ];

    try {
        const response = await apiClient.post('DailyData', { daybook, pumpReadings, fuelDailies });
        console.log("Daybook, MS & HSD data submitted successfully:", response.data);
        const daybookId = response.data;
        //console.log("response: " + JSON.stringify(response));
        //console.log("daybookid: " + JSON.stringify(daybookId));
        const salesTransaction = {
            DaybookId: daybookId,
            Customer: 'Default Customer',
            TotalQuantity: calculateTotalQuantity(),
            TotalAmount: calculateTotalAmount(),
            IsCancelled: false,
            Date:formattedDayBookDate,
            CreatedBy: 1, // Placeholder user ID
            CreatedDate: new Date().toISOString(),
            };

        try {
        const salesTransactionResponse = await apiClient.post('SalesTransaction', salesTransaction);
        const salesTransactionId = salesTransactionResponse.data.id;
        console.log('Sales transaction submitted successfully:', salesTransactionId);

        // Calculate total quantities sold per stock
        const stockQuantityMap = new Map();
        for (let product of products) {
            const stock = product.stockSelected;
            if (stockQuantityMap.has(stock.id)) 
                {stockQuantityMap.set(stock.id, stockQuantityMap.get(stock.id) + parseFloat(product.quantity));} 
            else {stockQuantityMap.set(stock.id, parseFloat(product.quantity));}
            const sale = {
                SalesTransactionId: salesTransactionId,
                ProductId: stock.productId,
                StockId: stock.id,
                ProductName: product.productName,
                SellingPrice: parseFloat(product.mrp),
                Quantity: parseFloat(product.quantity),
                PurchasePrice: stock.purchasePrice,
                WAC: product.wac, // need to work later
                Note: product.note,
                IsCancelled: false,
                CreatedBy: 1, // Placeholder user ID
                CreatedDate: new Date().toISOString(),
                };

            try {
                await apiClient.post('Sale', sale);
                console.log('Sales data submitted successfully:', sale);
                } catch (saleError) {console.error(`Error posting sale for product ${product.productName}:`, saleError);}

                // Update stock only once per stock id
            if (stockQuantityMap.has(stock.id)) {
                const totalQuantity = stockQuantityMap.get(stock.id);
                const updatedStock = {
                    ...stock,
                    availableStock: stock.availableStock - totalQuantity,
                };
                    //console.log("updatedStock: " + JSON.stringify(updatedStock))
                try {
                    await apiClient.put(`stocks/${stock.id}`, updatedStock);
                    console.log('Stock updated successfully:', updatedStock);
                } catch (stockUpdateError) {console.error(`Error updating stock for ${stock.id}:`, stockUpdateError); }
                stockQuantityMap.delete(stock.id);
                }

                const stockTransaction = {
                    StockId: stock.id,
                    Quantity: -parseFloat(product.quantity), // Negative for sales
                    Particulars: `Sales: ${product.note}`,
                    Date: formattedDayBookDate,
                };
                try {
                    await apiClient.post('StockTransaction', stockTransaction);
                    console.log('Stock Transaction submitted successfully:', stockTransaction);
                } catch (stockTransactionError) {console.error(`Error posting stock transaction for stock ${stock.id}:`, stockTransactionError); }
            }
        } catch (transactionError) {console.error('Error adding ledger transactions:', transactionError);}
        try {
            for (let record of records) {
                const ledgerTransaction = {
                    LedgerId: ledgers.find(l => l.name === record.accountName).id,
                    DaybookId: daybookId,
                    Note: `${record.note}`,
                    Amt: record.debitAmount ? parseFloat(record.debitAmount) : -parseFloat(record.creditAmount),
                    TransactionType: record.debitAmount ? 'Debit' : 'Credit',
                    //BalanceAfter: 0, // This will be updated by the backend
                    //BalanceBefore: 0, // This will be updated by the backend
                    Date: formattedDayBookDate, // Add the Date field here
                    CreatedBy: 1, // Placeholder user ID
                    CreatedDate: new Date().toISOString(),
                };
                try {
                    await apiClient.post('LedgerTransactions', ledgerTransaction);
                    console.log('Ledger transaction submitted successfully:', ledgerTransaction);
                } catch (ledgerError) {console.error(`Error posting ledger transaction for ${record.accountName}:`, ledgerError);}
            }
        } catch (transactionError) {console.error('Error adding ledger transactions:', error);}
        handleNext();
    } catch (error) {
        console.error('Error submitting daybook data:', error);
        setError('Failed to submit daybook data. Please try again later.');
        alert('Failed to submit daybook data. Please try again later.');
    } finally {setLoading(false);}
};

    return (
    <div className="boxed-inner">
    {loading && <Loader />}
      <span className="screen-darken"></span>
      <main className="main-content">
        <NavBar />
        
        <div className="conatiner-fluid content-inner pb-0">
        <div>
            <div className="row">                
                <div className="col-sm-12 col-lg-12">
                    <div className="card">
                        <div className="card-body">
                        {error && <Notification message={error} />}
                        <form id="form-wizard1" className="mt-3 text-center">
                            <ul id="top-tab-list" className="p-0 row list-inline mb-3">
                                <li className="mb-2 col-lg-2 col-md-4 text-start active" id="fuel">
                                    <a>
                                        <div className="iq-icon me-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" width="20" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="1" d="M22.682,3.975L18.854,.146c-.195-.195-.512-.195-.707,0s-.195,.512,0,.707l1.854,1.853v3.793c0,.827,.673,1.5,1.5,1.5h1.5v10.5c0,.827-.673,1.5-1.5,1.5s-1.5-.673-1.5-1.5v-1c0-1.379-1.122-2.5-2.5-2.5h-1.5V4.5c0-2.481-2.019-4.5-4.5-4.5H4.5C2.019,0,0,2.019,0,4.5v15c0,2.481,2.019,4.5,4.5,4.5h7c2.481,0,4.5-2.019,4.5-4.5v-3.5h1.5c.827,0,1.5,.673,1.5,1.5v1c0,1.379,1.122,2.5,2.5,2.5s2.5-1.121,2.5-2.5V7.157c0-1.202-.468-2.333-1.318-3.183ZM4.5,1h7c1.93,0,3.5,1.57,3.5,3.5v4.5H1V4.5c0-1.93,1.57-3.5,3.5-3.5ZM15,19.5c0,1.93-1.57,3.5-3.5,3.5H4.5c-1.93,0-3.5-1.57-3.5-3.5V10H15v9.5Zm6-13V3.707l.975,.975c.624,.624,.983,1.442,1.021,2.318h-1.496c-.276,0-.5-.225-.5-.5Z"/>
                                            </svg>
                                        </div>
                                        <span className="dark-wizard">Fuel Sale</span>
                                    </a>
                                </li>
                                <li id="other" className="mb-2 col-lg-2 col-md-4 text-start">
                                    <a>
                                        <div className="iq-icon me-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" width="20" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="1" d="M24,7.827l-7.005,2.115c-.524,.149-1.089,.003-1.418-.315l-.638-.895c-.473-.473-1.1-.732-1.768-.732h-3.172V4h3v-1H6v1h3v4H4.584l-2.413-.841c-.469-.233-1.015-.209-1.46,.066s-.711,.752-.711,1.275v3.146c0,.953,.529,1.811,1.433,2.259l2.567,.943v5.15H15.238l8.762-10.823v-1.35ZM1.829,12.989c-.512-.256-.829-.77-.829-1.342v-3.146c0-.251,.166-.381,.237-.425,.071-.045,.261-.134,.545,.002l2.218,.776v4.93l-2.171-.795Zm12.933,6.011H5V9H13.172c.395,0,.781,.16,1.005,.373l.638,.895c.642,.642,1.578,.885,2.462,.634l5.349-1.615-7.863,9.714Zm8.526-2.245l-1.788-2.021-1.768,1.999c-.975,.975-.975,2.561,0,3.535,.473,.473,1.1,.732,1.768,.732s1.295-.26,1.768-.732c.975-.975,.975-2.561,.021-3.513Zm-.728,2.806c-.566,.566-1.555,.566-2.121,0-.585-.585-.585-1.536,.021-2.144l1.04-1.175,1.061,1.197c.585,.585,.585,1.536,0,2.121Z"/>
                                            </svg>
                                        </div>
                                        <span className="dark-wizard">Oil Sale</span>
                                    </a>
                                </li>
                                <li id="records" className="mb-2 col-lg-2 col-md-4 text-start">
                                    <a>
                                        <div className="iq-icon me-1">
                                              <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.7161 16.2234H8.49609" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M15.7161 12.0369H8.49609" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>                                    
                                                <path d="M11.2521 7.86011H8.49707" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>                                    
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15.909 2.74976C15.909 2.74976 8.23198 2.75376 8.21998 2.75376C5.45998 2.77076 3.75098 4.58676 3.75098 7.35676V16.5528C3.75098 19.3368 5.47298 21.1598 8.25698 21.1598C8.25698 21.1598 15.933 21.1568 15.946 21.1568C18.706 21.1398 20.416 19.3228 20.416 16.5528V7.35676C20.416 4.57276 18.693 2.74976 15.909 2.74976Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>   
                                        </div>
                                        <span className="dark-wizard">Records</span>
                                    </a>
                                </li>
                                <li id="stock" className="mb-2 col-lg-2 col-md-4 text-start">
                                    <a>
                                        <div className="iq-icon me-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                                                <path stroke="currentColor" strokeWidth="1" d="M12,0C5.383,0,0,3.813,0,8.5v7.183c0,4.606,5.383,8.317,12,8.317s12-3.711,12-8.317v-7.183C24,3.813,18.617,0,12,0Zm0,1c6.065,0,11,3.364,11,7.5s-4.935,7.5-11,7.5S1,12.636,1,8.5,5.935,1,12,1Zm11,14.683c0,4.055-4.935,7.353-11,7.353S1,19.738,1,15.683v-3.788c1.854,3.002,6.086,5.105,11,5.105s9.146-2.103,11-5.105v3.788Z"/>
                                            </svg>
                                        </div>
                                        <span className="dark-wizard">Stock</span>
                                    </a>
                                </li>
                                <li id="review" className="mb-2 col-lg-2 col-md-4 text-start">
                                    <a>
                                        <div className="iq-icon me-1">
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                              </svg>
                                        </div>
                                        <span className="dark-wizard">Review</span>
                                    </a>
                                </li>
                                <li id="confirm" className="mb-2 col-lg-2 col-md-4 text-start">
                                    <a>
                                        <div className="iq-icon me-1">
                                            <svg className="svg-icon icon-20" xmlns="http://www.w3.org/2000/svg"  width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>

                                        </div>
                                        <span className="dark-wizard">Finish</span>
                                    </a>
                                </li>
                            </ul>
                            <fieldset>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <div className="header-title">
                                            <h4 className="card-title mb-3">Readings and Fuel Sale</h4>
                                        </div>
                                        </div>
                                        <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Date</label>
                                                <input type="date" className="form-control" name="day-book-date" defaultValue={todaysDate} id="dayBookDate" onChange={updateValues}/>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Price MS</label>
                                                <input type="text" className="form-control ms-textbox" name="price-ms" id="priceMs" placeholder="Price MS" onChange={updateValues} /> 
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Price HSD</label>
                                                <input type="text" className="form-control hsd-textbox" name="price-hsd" id="priceHsd" placeholder="Price HSD" onChange={updateValues}/>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="hr hr-horizontal border border-3 border-dark rounded-4 mb-4" />
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Opening Reading</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-opening-reading-p1" id="msOpeningReadingP1" placeholder="MS- Pump 1" disabled/>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-opening-reading-p2" id="msOpeningReadingP2" placeholder="MS- Pump 2" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-opening-reading-p3" id="hsdOpeningReadingP3" placeholder="HSD-Pump 3" disabled />
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-opening-reading-p4" id="hsdOpeningReadingP4" placeholder="HSD- Pump 4" disabled/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Closing Reading</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-closing-reading-p1" id="msClosingReadingP1" placeholder="MS- Pump 1" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-closing-reading-p2" id="msClosingReadingP2" placeholder="MS- Pump 2" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-closing-reading-p3" id="hsdClosingReadingP3" placeholder="HSD-Pump 3" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-closing-reading-p4" id="hsdClosingReadingP4" placeholder="HSD- Pump 4" onChange={updateValues} />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Dispensed (Litres)</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-dispensed-p1" id="msDispensedP1" placeholder="MS- Pump 1" disabled/>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-dispensed-p2" id="msDispensedP2" placeholder="MS- Pump 2" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-dispensed-p3" id="hsdDispensedP3" placeholder="HSD- Pump 3"  disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-dispensed-p4" id="hsdDispensedP4" placeholder="HSD- Pump 4" disabled/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Test (Litres)</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-test-p1" id="msTestP1"  placeholder="MS- Pump 1" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-test-p2" id="msTestP2" placeholder="MS- Pump 2" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-test-p3" id="hsdTestP3" placeholder="HSD- Pump 3" onChange={updateValues} />
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-test-p4" id="hsdTestP4" placeholder="HSD- Pump 4" onChange={updateValues} />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Sold (Litres)</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-sold-p1" id="msSoldP1" placeholder="MS- Pump 1" disabled/>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-sold-p2" id="msSoldP2" placeholder="MS- Pump 2" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-sold-p3" id="hsdSoldP3" placeholder="HSD- Pump 3" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-sold-p3" id="hsdSoldP4" placeholder="HSD- Pump 4" disabled />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Sale Amount</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-sold-amt-p1" id="msSoldAmtP1" placeholder="MS- Pump 1" disabled/>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-sold-amt-p2" id="msSoldAmtP2" placeholder="MS- Pump 2" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-sold-amt-p3" id="hsdSoldAmtP3" placeholder="HSD- Pump 3" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-sold-amt-p1" id="hsdSoldAmtP4" placeholder="HSD- Pump 4" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex">
                                <div className="float-start flex-grow-1 pe-4">{validationError && <Notification message={validationError} />}</div>
                                <div><button type="button" name="next" id="fuelSaleNextButton" className="btn btn-primary next action-button float-end" value="Next" onClick={handleFuelSaleNext}>Next</button></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                
                                <OtherProductSalesTable products={products} addProduct={addProduct} deleteProduct={deleteProduct} />

                                <button type="button" name="next" id="otherNextButton" className="btn btn-primary next action-button float-end" value="Next" onClick={handleNext} >Next</button>
                                <button type="button" name="previous" id="otherPreviousButton" className="btn btn-dark previous action-button-previous float-end me-1" value="Previous" onClick={handlePrevious} >Previous</button>

                            </fieldset>
                            <fieldset>
                            
                                <RecordTable records={records} addRecord={addRecord} deleteRecord={deleteRecord} ledgers={ledgers} />
                            
                                <button type="button" name="next" id="recordsNextButton" className="btn btn-primary next action-button float-end" value="Next" onClick={handleNext}>Next</button>
                                <button type="button" name="previous" id="recordsPreviousButton" className="btn btn-dark previous action-button-previous float-end me-1" value="Previous" onClick={handlePrevious}>Previous</button>
                            
                            </fieldset>
                            <fieldset>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <div className="header-title">
                                            <h4 className="card-title mb-3">Stock</h4>
                                        </div>
                                        </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">System Closing</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-system-closing" id="msSystemClosing" placeholder="MS-System-Closing" onChange={updateValues}/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-system-closing" id="hsdSystemClosing" placeholder="HSD-System-Closing" onChange={updateValues}/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Opening Stock</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-opening-stock" id="msOpeningStock" placeholder="MS-Opening-Stock" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-opening-stock" id="hsdOpeningStock" placeholder="HSD-Opening-Stock" disabled/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Closing Stock</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-closing-stock" id="msClosingStock" placeholder="MS-Closing-Stock" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-closing-stock" id="hsdClosingStock" placeholder="HSD-Closing-Stock" disabled/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Purchased Stock</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-receipt-stock" id="msReceiptStock" placeholder="MS-Receipt-Stock" defaultValue="0" onChange={updateValues}/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-receipt-stock" id="hsdReceiptStock" placeholder="HSD-Receipt-Stock" defaultValue="0" onChange={updateValues}/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Purchase Cost/Liter</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-purchase-cost" id="msPurchaseCost" placeholder="MS-Purchase-Cost" defaultValue="0" onChange={updateValues}/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-purchase-cost" id="hsdPurchaseCost" placeholder="HSD-Purchase-Cost" defaultValue="0" onChange={updateValues}/>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label className="form-label">Purchase Amount</label>
                                                <input type="text" className="form-control mb-2 ms-textbox" name="ms-purchase-amount" id="msPurchaseAmount" placeholder="MS-Purchase-Amount" disabled/>
                                                <input type="text" className="form-control mb-2 hsd-textbox" name="hsd-purchase-amount" id="hsdPurchaseAmount" placeholder="HSD-Purchase-Amount" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="float-start flex-grow-1 pe-4">{validationError && <Notification message={validationError} />}</div>
                                    <div>
                                        <button type="button" name="next" id="stockNextButton" className="btn btn-primary next action-button float-end" value="Next" onClick={handleStockNext} >Next</button>
                                        <button type="button" name="previous" id="stockPreviousButton" className="btn btn-dark previous action-button-previous float-end me-1" value="Previous" onClick={handlePrevious} >Previous</button>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <div className="header-title">
                                            <h4 className="card-title mb-3">Review Daybook Entries</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-lg-6">
                                            <div className="card m-0 p-0">
                                                <div className="table-responsive">
                                                    <table id="reviewDatePrices" className="table table-bordered daybook">
                                                        <thead>
                                                            <tr className="heading1">
                                                                <th className="text-center">Date</th>
                                                                <th colSpan="2" className="text-center">Prices</th>
                                                            </tr>
                                                            <tr className="">
                                                                <td className="text-center heading3" id="reviewDate"></td>
                                                                <td className="ms-tablecell text-center text-dark" id="reviewMSPrice"></td>
                                                                <td className="hsd-tablecell text-center text-dark" id="reviewHSDPrice"></td>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                                <div className="table-responsive">
                                                    <table id="reviewReadings" className="table table-bordered daybook">
                                                        <thead>
                                                            <tr className="heading1"> 
                                                                <th colSpan="2" className="text-center">Reading</th>
                                                                <th colSpan="3" className="text-center">Liters</th>
                                                                <th className="text-end">Sale</th>
                                                            </tr>
                                                            <tr className="heading2">
                                                                <th className="">Opening</th>
                                                                <th className="">Closing</th>
                                                                <th className="">Desp</th>
                                                                <th className="text-center">Test</th>
                                                                <th className="text-end">Sold</th>
                                                                <th className="text-end">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="ms-tablecell">
                                                                <td className="" id="reviewMsOpeningReadingsP1"></td>
                                                                <td className="" id="reviewMsClosingReadingsP1"></td>
                                                                <td className="" id="reviewMsDispensedP1"></td>
                                                                <td className="text-center" id="reviewMsTestP1"></td>
                                                                <td className="text-end" id="reviewMsSoldP1"></td>
                                                                <td className="text-end" id="reviewMsSoldAmountP1"></td>
                                                            </tr>
                                                            <tr className="ms-tablecell">
                                                                <td className="" id="reviewMsOpeningReadingsP2"></td>
                                                                <td className="" id="reviewMsClosingReadingsP2"></td>
                                                                <td className="" id="reviewMsDispensedP2"></td>
                                                                <td className="text-center" id="reviewMsTestP2"></td>
                                                                <td className="text-end" id="reviewMsSoldP2"></td>
                                                                <td className="text-end" id="reviewMsSoldAmountP2"></td>
                                                            </tr>
                                                            <tr className="hsd-tablecell">
                                                                <td className="" id="reviewHsdOpeningReadingsP3"></td>
                                                                <td className="" id="reviewHsdClosingReadingsP3"></td>
                                                                <td className="" id="reviewHsdDispensedP3"></td>
                                                                <td className="text-center" id="reviewHsdTestP3"></td>
                                                                <td className="text-end" id="reviewHsdSoldP3"></td>
                                                                <td className="text-end" id="reviewHsdSoldAmountP3"></td>
                                                            </tr>
                                                            <tr className="hsd-tablecell">
                                                                <td className="" id="reviewHsdOpeningReadingsP4"></td>
                                                                <td className="" id="reviewHsdClosingReadingsP4"></td>
                                                                <td className="" id="reviewHsdDispensedP4"></td>
                                                                <td className="text-center" id="reviewHsdTestP4"></td>
                                                                <td className="text-end" id="reviewHsdSoldP4"></td>
                                                                <td className="text-end" id="reviewHsdSoldAmountP4"></td>
                                                            </tr>
                                                        </tbody>
                                                        <thead>
                                                            <tr className="heading3">
                                                                <th colSpan="5" className="text-end">Total Fuel Sale</th>
                                                                <th className="text-end" id="reviewTotalFuelSale"></th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                                
                                                <ReviewOtherProductSalesTable products={products} />

                                                <div className="table-responsive">
                                                    <table id="reviewTotals" className="table table-bordered daybook">
                                                        <thead >
                                                            <tr className="heading3">
                                                                <th className="text-end">Total Sales Revenue</th>
                                                                <th className="text-center">=</th>
                                                                <th className="text-center" id="reviewTotalSalesRevenue"></th>
                                                            </tr>
                                                            <tr className="heading3">
                                                                <th className="text-end">Add: Receipts/Credit/Cust Repayments</th>
                                                                <th className="text-center">+</th>
                                                                <th className="text-center"  id="reviewTotalCredits"></th>
                                                            </tr>
                                                            <tr className="heading3">
                                                                <th className="text-end">Less: Udhar/Debit/Expenses/Payments</th>
                                                                <th className="text-center">-</th>
                                                                <th className="text-center" id="reviewTotalDebits"></th>
                                                            </tr>
                                                            <tr className="heading3">
                                                                <th className="text-end">Cash/Drawer Cash Balance</th>
                                                                <th className="text-center">=</th>
                                                                <th className="text-center" id="reviewCashBalance"></th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                                <div className="table-responsive">
                                                    <table id="reviewStock" className="table table-bordered daybook">
                                                        <thead>
                                                            <tr className="heading1">
                                                                <th colSpan="6" className="text-center">Stock</th>
                                                            </tr>
                                                            <tr className="heading2">
                                                                <th className="">SysClosing</th>
                                                                <th className="">Opening</th>
                                                                <th className="">Closing</th>
                                                                <th className="text-end">Purchase(l)</th>
                                                                <th className="text-center">Cost</th>
                                                                <th className="text-end">Purchase Amt</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="ms-tablecell">
                                                                <td className="" id="reviewMsSystemClosingStock"></td>
                                                                <td className="" id="reviewMsOpeningStock"></td>
                                                                <td className="" id="reviewMsClosingStock"></td>
                                                                <td className="text-end" id="reviewMsPurchasedStock"></td>
                                                                <td className="text-center" id="reviewMsPurchaseCost"></td>
                                                                <td className="text-end" id="reviewMsPurchaseAmount"></td>
                                                            </tr>
                                                            <tr className="hsd-tablecell">
                                                                <td className="" id="reviewHsdSystemClosingStock"></td>
                                                                <td className="" id="reviewHsdOpeningStock"></td>
                                                                <td className="" id="reviewHsdClosingStock"></td>
                                                                <td className="text-end" id="reviewHsdPurchasedStock"></td>
                                                                <td className="text-center" id="reviewHsdPurchaseCost"></td>
                                                                <td className="text-end" id="reviewHsdPurchaseAmount"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-lg-6">
                                            <div className="card m-0 p-0">
                                                                                                
                                                <ReviewTransactionsTable records={records} />

                                            </div>
                                            <div className="form-group">
                                                <label className="mb-2 p-1 custom-bg-blue-white w-100" htmlFor="reviewTabNote" style={{ fontWeight: '500' }}>DayBook Notes</label>
                                                <textarea className="form-control" id="reviewTabNote" rows="3"></textarea>
                                                <table id="reviewCash" className="table table-bordered daybook mt-4">
                                                    <thead>
                                                        <tr className="heading1">
                                                            <th colSpan="2" className="text-center">Check Cash Balance</th>
                                                        </tr>
                                                        <tr className="heading2">
                                                            <th className="text-center">Calculated Cash Balance</th>
                                                            <th className="text-center">Counted Cash Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <thead>
                                                        <tr className="heading3">
                                                            <th className="text-center align-middle" id="reviewCalculatedCash"></th>
                                                            <th className="text-center" id="reviewCountedCash">
                                                                <input type="text" className="form-control px-1" id="reviewCountedCashInput" name="review-counted-cash-input" />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="float-start flex-grow-1 pe-4">{validationError && <Notification message={validationError} />}</div>
                                    <div>
                                        <button type="button" name="next" className="btn btn-primary next action-button float-end" id="submitDaybook" value="Submit" onClick={handleReviewSubmit} disabled={loading}>Submit</button>
                                        <button type="button" name="previous" className="btn btn-dark previous action-button-previous float-end me-1" value="Previous" onClick={handlePrevious} disabled={loading}>Previous</button>
                                    </div>
                                </div>
                                
                            </fieldset>
                            <fieldset>
                                <div className="form-card">
                                    <div className="row">
                                    </div>
                                    <h2 className="text-center text-primary"><strong>SUCCESS!</strong></h2>
                                    <div className="row justify-content-center">
                                    <div className="col-3"> <img src="assets/images/pages/sub_success.png" className="img-fluid" alt="fit-image" /> </div>
                                    </div>
                                    <div className="row justify-content-center">
                                    <div className="text-center col-7">
                                        <h5 className="text-center purple-text">You Have Successfully Submitted Your Daybook Entries. </h5>
                                    </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
  
        <Footer />
       
       </main>
    </div>
    )
   };

export default Daybook