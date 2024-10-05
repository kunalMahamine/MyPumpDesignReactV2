import React, { useState, useEffect } from 'react';

import FluidMeter from '../FluidMeter';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';

import ReactApexChart from "react-apexcharts";

import apiClient from '../utils/apiClient'; // Your Axios instance
import Notification from '../utils/notification'; // Your notification component

const Home = () => {
   const [selectedOption, setSelectedOption] = useState('MTD');
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [msClosingStock, setMsClosingStock] = useState(0);
   const [hsdClosingStock, setHsdClosingStock] = useState(0);
 
   const tankCapacity = 2500;
 
   useEffect(() => {
      if (!navigator.onLine) {
         setLoading(false);
         setError('You are currently offline. Please check your internet connection.');
      } else {
         fetchData('MTD'); // Fetch data on initial load
         fetchClosingStock(); // Fetch closing stock on initial load
      }
    }, []);
 
   const fetchData = async (option) => {
     setLoading(true);
     setError(null);
     const { from, to } = getDates(option);
     console.log("from: " + from + ", to: " + to);
     try {
      const response = await apiClient.get('ProfitReport/GetAggregatedProfitReport', {
        params: { fromDate: from, toDate: to }
      });
      setData(response.data);
     } catch (error) {
      console.error('Error fetching Aggregate Report:', error);
      setError('Failed to load data. Please try again later.');
     } finally {
       setLoading(false);
     }
   };
   const fetchClosingStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('FuelDaily/LatestClosingStock');
        console.log(response);
        console.log(response.data.MsClosingStock);
        setMsClosingStock(response.data.msClosingStock || 0);
        setHsdClosingStock(response.data.hsdClosingStock || 0);
      } catch (error) {
        console.error('Error fetching closing stock:', error);
        setError('Failed to load data. Please try again later.');
      }
      finally {
         setLoading(false);
       }
    };
  
   const getDates = (option) => {
     const today = new Date();
     let from, to;
     to = today.toISOString().split('T')[0];
 
     switch (option) {
       case 'MTD':
         from = new Date(today.getFullYear(), today.getMonth(), 1)
         from.setDate(from.getDate() + 1);           // Add one day to the from date
         from = from.toISOString().split('T')[0];
         break;
       case 'This Month':
         from = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
         break;
       case 'YTD':
         from = new Date(today.getFullYear(), 3, 1) // April 1st
         from.setDate(from.getDate() + 1);           // Add one day to the from date
         from = from.toISOString().split('T')[0];
         break;
       case 'This Year':
         from = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0];
         break;
       default:
         from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
     }
     console.log("inside getdates: from: " + from + ", to: " + to);
     return { from, to };
   };
 
   const handleSelect = (event) => {
     const newOption = event.target.textContent;
     setSelectedOption(newOption);
     fetchData(newOption); // Fetch data on option change
   };

   const formatIndianNumber = (number) => {
      return number.toLocaleString('en-IN');
    };
    const getSafeNumber = (value) => {
      return isNaN(value) || value === null ? 0 : value;
    };
    const calculatePercentage = (total, value) => {
      if (total === 0) return '0%';
      return ((value / total) * 100).toFixed(1) + '%';
    };

    const chartMsData = {
      series: data ? [getSafeNumber(data.totalMsCostAmount), getSafeNumber(data.totalMsProfitAmount)] : [0, 0],
      options: {
        chart: { type: "donut" },
        legend: { show: false },
        dataLabels: { enabled: false },
        tooltip: { enabled: false },
        fill: { colors: ["#9B9B9B", "#0362d6"] },
        states: {
          hover: { filter: { type: "lighten", value: 0.5 } },
          active: { filter: { type: "none", value: 0 } }
        },
        stroke: { width: 0 },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "90%",
              labels: {
                show: true,
                name: { show: false },
                total: {
                  show: true,
                  showAlways: true,
                  formatter: function (w) {
                    const totals = w.globals.seriesTotals;
                     const percentage = calculatePercentage(totals.reduce((a, b) => a + b, 0), totals[1]);
                     return percentage;
                  }
                }
              }
            }
          }
        }
      }
    };
  
    const chartHsdData = {
      series: data ? [getSafeNumber(data.totalHsdCostAmount), getSafeNumber(data.totalHsdProfitAmount)] : [0, 0],
      options: {
        chart: { type: "donut" },
        legend: { show: false },
        dataLabels: { enabled: false },
        tooltip: { enabled: false },
        fill: { colors: ["#9B9B9B", "orangered"] },
        states: {
          hover: { filter: { type: "lighten", value: 0.5 } },
          active: { filter: { type: "none", value: 0 } }
        },
        stroke: { width: 0 },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "90%",
              labels: {
                show: true,
                name: { show: false },
                total: {
                  show: true,
                  showAlways: true,
                  formatter: function (w) {
                    const totals = w.globals.seriesTotals;
                    const percentage = calculatePercentage(totals.reduce((a, b) => a + b, 0), totals[1]);
                    return percentage;
                  }
                }
              }
            }
          }
        }
      }
    };

  return (
      <div className="boxed-inner">
      {loading && <Loader />}
      {error && <Notification message={error} />}   
      <span className="screen-darken"></span>
      <main className="main-content">
         
         <NavBar />
        <div className="conatiner-fluid content-inner pb-0">          {/* conatiner-fluid spelling mistake in design tempalate itself */}
        <div className="d-flex">
            <div className="w-25 me-3">
               <div className="card text-center pb-1">
               <FluidMeter
                  id="fluid-meter-1"
                  fillPercentage={(msClosingStock / tankCapacity) * 100}
                  options={{
                    fontFamily: "Oxygen",
                    drawPercentageSign: true,
                    drawBubbles: true,
                    size: 250,
                    borderWidth: 10,
                    backgroundColor: '#d8ddfa',
                    foregroundColor: "#99a5b8",
                    foregroundFluidLayer: {
                      fillStyle: "blue",
                      angularSpeed: 25,
                      maxAmplitude: 10,
                      frequency: 30,
                      horizontalSpeed: -15
                    },
                    backgroundFluidLayer: {
                      fillStyle: "blue",
                      angularSpeed: 25,
                      maxAmplitude: 10,
                      frequency: 30,
                      horizontalSpeed: 15
                    },
                  }}
                />
               </div>
            </div>
            <div className="w-25 me-3">
               <div className="card text-center pb-1">
               <FluidMeter id="fluid-meter-2"
                   fillPercentage={(hsdClosingStock / tankCapacity) * 100}
                   options={{
                    fontFamily: "Oxygen",
                    drawPercentageSign: true,
                    drawBubbles: true,
                    size: 250,
                    borderWidth: 10,
                    backgroundColor: '#feeed7',
                    foregroundColor: "#99a5b8",
                    foregroundFluidLayer: {
                      fillStyle: "#fa7000",
                      angularSpeed: 20,
                      maxAmplitude: 7,
                      frequency: 35,
                      horizontalSpeed: -15
                    },
                    backgroundFluidLayer: {
                      fillStyle: "#feeed7",
                      angularSpeed: 20,
                      maxAmplitude: 7,
                      frequency: 35,
                      horizontalSpeed: 15
                    },
                  }}
                />
               </div>
            </div>
            <div className="w-25 me-3">
               <div className="card text-center profit-margin-chart mb-0">
                  {/* <div id="donut-chart-1"></div> */}
                  <ReactApexChart options={chartMsData.options} series={chartMsData.series} type="donut" />
               </div>
            </div>
            <div className="w-25">
               <div className="card text-center profit-margin-chart mb-0">
                  {/* <div id="donut-chart-2"></div> */}
                   <ReactApexChart options={chartHsdData.options} series={chartHsdData.series} type="donut" />
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-md-12">
               <div className="row">
                  <div className="col-md-12">
                     <div className="card" data-aos="fade-up" data-aos-delay="800">
                        <div className="flex-wrap card-header d-flex justify-content-between align-items-center">
                           <div className="header-title">
                              <h4 className="card-title" id='headingTotalSalesAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalSalesAmount))}` : '₹0'}</h4>
                              <p className="mb-0">Total Sales</p>          
                           </div>
                           {/* <div className="dropdown">
                              <a href="#" className="text-gray dropdown-toggle" id="dropdownMenuButton22" data-bs-toggle="dropdown" aria-expanded="false">{selectedOption}</a>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton22">
                                 <li><a className="dropdown-item" href="#" onClick={handleSelect}>MTD</a></li>
                                 <li><a className="dropdown-item" href="#" onClick={handleSelect}>This Month</a></li>
                                 <li><a className="dropdown-item" href="#" onClick={handleSelect}>YTD</a></li>
                                 <li><a className="dropdown-item" href="#" onClick={handleSelect}>This Year</a></li>
                              </ul>
                           </div> */}
                           <div className="dropdown custom-dropdown">
                              <button className="text-gray dropdown-toggle custom-dropdown-toggle" id="dropdownMenuButton22" data-bs-toggle="dropdown" aria-expanded="false">
                                 {selectedOption}
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton22">
                                 <li><button className="dropdown-item custom-dropdown-item" onClick={handleSelect}>MTD</button></li>
                                 <li><button className="dropdown-item custom-dropdown-item" onClick={handleSelect}>This Month</button></li>
                                 <li><button className="dropdown-item custom-dropdown-item" onClick={handleSelect}>YTD</button></li>
                                 <li><button className="dropdown-item custom-dropdown-item" onClick={handleSelect}>This Year</button></li>
                              </ul>
                              </div>
                           </div>
                        <div className="card-body">
                           {/* <div id="d-main" className="d-main"></div> */}
                                <div className="row">
                                 <div className="col-lg-3 col-md-6">
                                     <div className="card ms-dashboard-blue1">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="rounded p-3 ms-dashboard-blue2">
                                                 <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="darkblue">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                 </svg>
                                              </div>
                                              <div className="text-end">
                                                    <h4 className="counter" id='msTotalSalesAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalMsSoldAmount))}` : '₹0'}</h4>
                                                 Sales MS
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-warning">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-warning rounded p-3">
                                                 <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                  </svg>
                                              </div>
                                              <div className="text-end">
                                                   <h4 className="counter" id='hsdTotalSalesAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalHsdSoldAmount))}` : '₹0'}</h4>
                                                 Sales HSD
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-secondary">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-secondary rounded p-3">
                                                 <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                  </svg>
                                              </div>
                                              <div className="text-end">
                                                     <h4 className="counter" id='otherTotalSalesAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalOtherSalesAmount))}` : '₹0'}</h4>
                                                 Sales Lubricants
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-success">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-success rounded p-3">
                                                 <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                  </svg>
                                              </div>
                                              <div className="text-end">
                                                    <h4 className="counter" id='totalSalesAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalSalesAmount))}` : '₹0'}</h4>
                                                 Total Sales
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>  
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card ms-dashboard-blue1">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                                  <div className="rounded p-3 ms-dashboard-blue2">
                                                    <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="darkblue">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                 </div>
                                              <div className="text-end">
                                                    <h4 className="counter" id='msTotalCostAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalMsCostAmount))}` : '₹0'}</h4>
                                                 Cost MS
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-warning">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-warning rounded p-3">
                                                  <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                              </div>
                                              <div className="text-end">
                                                    <h4 className="counter" id='hsdTotalCostAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalHsdCostAmount))}` : '₹0'}</h4>
                                                 Cost HSD
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-secondary">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-secondary rounded p-3">
                                                <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              </div>
                                              <div className="text-end">
                                                     <h4 className="counter" id='otherTotalCostAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalOtherCostAmount))}` : '₹0'}</h4>
                                                 Cost Lubricants
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                     <div className="card bg-soft-success">
                                        <div className="card-body">
                                           <div className="d-flex justify-content-between align-items-center">
                                              <div className="bg-soft-success rounded p-3">
                                                <svg className="icon-30" xmlns="http://www.w3.org/2000/svg" width="30px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              </div>
                                              <div className="text-end">
                                                    <h4 className="counter" id='totalCostAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalCostAmount))}` : '₹0'}</h4>
                                                 Total Cost
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                    <div className="card ms-dashboard-blue1">
                                       <div className="card-body">
                                          <div className="d-flex justify-content-between align-itmes-center">
                                             <div>
                                                <div className="p-3 rounded ms-dashboard-blue2">
                                                   <svg className="icon-35" xmlns="http://www.w3.org/2000/svg" width="35px" fill="none" viewBox="0 0 24 24" stroke="darkblue">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                   </svg>
                                                </div>
                                             </div>
                                             <div className="text-end">
                                                <h2 className="counter" id='msTotalProfitAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalMsProfitAmount))}` : '₹0'}</h2>
                                                <p className="mb-0">Profit MS</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-lg-3 col-md-6">
                                    <div className="card bg-soft-warning">
                                       <div className="card-body">
                                          <div className="d-flex align-items-center justify-content-between">
                                             <div className="bg-soft-warning rounded p-3">
                                                <svg className="icon-35" xmlns="http://www.w3.org/2000/svg" width="35px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                             </div>
                                             <div className="text-end">
                                                <h2 className="counter" id='hsdTotalProfitAmount' >{data ? `₹${formatIndianNumber(Math.round(data.totalHsdProfitAmount))}` : '₹0'}</h2>
                                                <p className="mb-0">Profit HSD</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-lg-3 col-md-6">
                                    <div className="card bg-soft-secondary">
                                       <div className="card-body">
                                          <div className="d-flex justify-content-between align-items-center">
                                             <div className="bg-soft-secondary rounded p-3">
                                                <svg className="icon-35" xmlns="http://www.w3.org/2000/svg" width="35px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                             </div>
                                             <div className="text-end">
                                                    <h2 className="counter" id='otherTotalProfitAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalOtherProfitAmount))}` : '₹0'}</h2>
                                                Profit Lubricants
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-lg-3 col-md-6">
                                    <div className="card bg-soft-success">
                                       <div className="card-body">
                                          <div className="d-flex align-items-center justify-content-between">
                                             <div className=" bg-soft-success rounded p-3">
                                                <svg className="icon-35" xmlns="http://www.w3.org/2000/svg" width="35px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                             </div>
                                             <div className="text-end">
                                                <h2 className="counter" id='totalProfitAmount'>{data ? `₹${formatIndianNumber(Math.round(data.totalProfitAmount))}` : '₹0'}</h2>
                                                <p className="mb-0">Total Profit</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                        </div>
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

export default Home