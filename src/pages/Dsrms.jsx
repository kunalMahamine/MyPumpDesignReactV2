import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function Dsrms() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [pumpIds, setPumpIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = 'https://localhost:7157/api/';

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, []); //fromDate, toDate

  const fetchData = async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`fueldaily/dsr`, {
        params: {
          from: from,
          to: to,
          fuelId: 1 // Fuel ID for Petrol
        }
      });
      console.log("response: " + JSON.stringify(response));
      const fetchedData = response.data || [];
      console.log("fetchedData: " + JSON.stringify(fetchedData));
      setData(fetchedData);
      // Extract unique pumpIds from the data
      const uniquePumpIds = new Set();
      fetchedData.forEach(item => {
        item.pumpReadings.forEach(reading => {
          uniquePumpIds.add(reading.pumpId);
        });
      });
      setPumpIds([...uniquePumpIds]);
    } catch (error) {
      console.error('Error fetching DSRMS Report:', error);
      setError('Failed to load DSRMS Report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetchData(fromDate, toDate);
  };

  const calculateTotals = () => {
    const totals = {
      openingStock: 0,
      purchasedStock: 0,
      dispensedLiters: 0,
      testLiters: 0,
      soldLiters: 0,
      closingStock: 0,
      systemClosingLiters: 0
    };

    if (data.length > 0) {
      totals.openingStock = data[0]?.openingStock || 0;
      totals.closingStock = data[data.length - 1]?.closingStock || 0;
      totals.systemClosingLiters = data[data.length - 1]?.systemClosingLiters || 0;
    }

    data.forEach((item) => {
      totals.purchasedStock += item.purchasedStock || 0;
      totals.dispensedLiters += item.dispensedLiters || 0;
      totals.testLiters += item.testLiters || 0;
      totals.soldLiters += item.soldLiters || 0;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="boxed-inner">
    {loading && <Loader />}
    {error && <Notification message={error} />}
      <span className="screen-darken"></span>
      <main className="main-content">
        <NavBar />
        <div className="conatiner-fluid content-inner pb-0">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">DSR MS (Petrol)</h4>
                  </div>
                  <div className="float-end">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="dsrFromDate">From:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="dsrFromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="dsrToDate">To:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="dsrToDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {loading ? <Loader /> : (
                    <div className="table-responsive">
                      <p className="float-end m-0">All Quantities In Liters</p>
                      <table id="datatable" className="reports table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>OpStock</th>
                            <th>Receipt</th>
                            {pumpIds.map((pumpId, index) => (
                              <th key={pumpId}>Clo Reading P{index + 1}</th>
                            ))}
                            <th>Dispensed</th>
                            <th>Test</th>
                            <th>Sold</th>
                            <th>CloStock</th>
                            <th>SCloStock</th>
                            <th>Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{new Date(row.date).toLocaleDateString('en-GB')}</td>
                              <td>{Math.round(row.openingStock)}</td>
                              <td>{Math.round(row.purchasedStock)}</td>
                              {pumpIds.map((pumpId) => (
                                <td key={pumpId}>
                                  {parseFloat(row.pumpReadings.find(reading => reading.pumpId === pumpId)?.closingReading || 0).toFixed(3)}
                                </td>
                              ))}
                              <td>{Math.round(row.dispensedLiters)}</td>
                              <td>{Math.round(row.testLiters)}</td>
                              <td>{Math.round(row.soldLiters)}</td>
                              <td>{Math.round(row.closingStock)}</td>
                              <td>{Math.round(row.systemClosingLiters)}</td>
                              <td>{Math.round((row.closingStock || 0) - (row.systemClosingLiters || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <thead>
                          <tr>
                            <th colSpan="2" className="text-end">Total</th>
                            <th>{Math.round(totals.openingStock)}</th>
                            <th>{Math.round(totals.purchasedStock)}</th>
                            {pumpIds.map((pumpId) => (
                              <th key={pumpId}>
                                {data.length > 0 
                                  ? parseFloat(data[data.length - 1].pumpReadings.find(reading => reading.pumpId === pumpId)?.closingReading || 0).toFixed(3)
                                  : 0}
                              </th>
                            ))}
                            <th>{Math.round(totals.dispensedLiters)}</th>
                            <th>{Math.round(totals.testLiters)}</th>
                            <th>{Math.round(totals.soldLiters)}</th>
                            <th>{Math.round(totals.closingStock)}</th>
                            <th>{Math.round(totals.systemClosingLiters)}</th>
                            <th>{Math.round(totals.closingStock - totals.systemClosingLiters)}</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Dsrms;
