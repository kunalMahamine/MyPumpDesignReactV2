import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
const NavBar = () => {
  return (        
   // <nav class="nav navbar navbar-expand-xl navbar-light iq-navbar">
   //        <div className="container-fluid navbar-inner">
   //          <button data-trigger="navbar_main" className="d-lg-none btn btn-primary rounded-pill p-1 pt-0" type="button">
   //            <svg aria-hidden="true"className="icon-20" width="20px"  viewBox="0 0 24 24">
   //              <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
   //          </svg>
   //          </button>
   //          {/* <div class="col-lg-2 col-lg-3 navbar-brand"> */}
   //          <Link to="/" className="navbar-brand">
   //              {/*Logo start*/}
   //             <svg aria-hidden="true"className="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
   //                <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
   //             </svg>
   //              {/*logo End*/}        
   //              <h4 className="logo-title">MyPump</h4>
   //          </Link>
   //          {/* Horizontal Menu Start */}
   //          <nav id="navbar_main" className="mobile-offcanvas nav navbar navbar-expand-xl hover-nav horizontal-nav mx-md-auto">
   //          <div className="container-fluid">
   //             <div className="offcanvas-header px-0">
   //                <div className="navbar-brand ms-3">
   //                   {/*Logo start*/}
   //                   <div className="logo-main">
   //                       <div className="logo-normal">
   //                           <svg aria-hidden="true"className="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
   //                            <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
   //                         </svg>
   //                       </div>
   //                       <div className="logo-mini">
   //                           <svg aria-hidden="true"className="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
   //                            <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
   //                         </svg>
   //                       </div>
   //                   </div>
   //                   {/*logo End*/}
   //                   <h4 className="logo-title">MyPump</h4>
   //                </div>
   //                <button className="btn-close float-end"></button>
   //             </div>
   //             <ul className="navbar-nav">
   //                <li className="nav-item">
   //                  <Link className="nav-link active" aria-current="page" to="/">
   //                       <i className="icon pe-1">
   //                           <svg aria-hidden="true"width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-20">
   //                               <path opacity="0.4" d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z" fill="currentColor"></path>
   //                               <path fillRule="evenodd" clipRule="evenodd" d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z" fill="currentColor"></path>
   //                           </svg>
   //                       </i>
   //                       <span className="item-name">Dashboard</span>
   //                   </Link>
   //               </li>
   //                <li className="nav-item">
   //                   <Link className="nav-link" to="/daybook">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
   //                            <path d="M10,4h-2c-1.1,0-2-.9-2-2s.9-2,2-2h2c1.1,0,2,.9,2,2s-.9,2-2,2Zm10,5h-4c-2.21,0-4,1.79-4,4v7c0,2.21,1.79,4,4,4h4c2.21,0,4-1.79,4-4v-7c0-2.21-1.79-4-4-4Zm0,10h-4c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Zm0-4h-4c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Zm-4-8h2c0-2.42-1.73-4.42-4.01-4.88-.07,2.15-1.82,3.88-3.99,3.88h-2c-2.17,0-3.94-1.74-3.99-3.9C1.73,2.56,0,4.58,0,7v12c0,2.76,2.24,5,5,5h6.53c-.95-1.06-1.53-2.46-1.53-4v-7c0-3.31,2.69-6,6-6Z" fill="currentColor"></path>
   //                         </svg>
   //                      </i>
   //                      <span className="item-name">DayBook</span>
   //                   </Link>
   //                </li>
   //                <li className="nav-item">
   //                   <Link className="nav-link" to="/lubricants">
   //                      <i className="icon pe-1">
   //                       <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
   //                           <path d="M8.5,7.997c-.935,0-1.814-.364-2.475-1.025-1.364-1.364-1.364-3.586,0-4.95L7.801,.285c.389-.381,1.01-.381,1.398,0l1.768,1.729c1.373,1.372,1.373,3.593,.008,4.958h0c-.661,.661-1.54,1.025-2.475,1.025Zm14.652,.684c-.515-.469-1.186-.712-1.878-.678-.697,.032-1.339,.334-1.794,.835l-3.541,3.737c.032,.21,.065,.42,.065,.638,0,2.083-1.555,3.876-3.617,4.17l-4.252,.596c-.547,.078-1.053-.302-1.131-.848-.078-.547,.302-1.053,.848-1.131l4.162-.583c.936-.134,1.748-.806,1.94-1.732,.296-1.425-.79-2.685-2.164-2.685H4.003C1.794,11,.003,12.791,.003,15v5C.003,22.209,1.794,24,4.003,24h4.262c2.805,0,5.48-1.178,7.374-3.246l7.702-8.409c.948-1.062,.862-2.707-.189-3.665Z" fill="currentColor"></path>
   //                       </svg>
   //                    </i>
   //                      <span className="item-name">Lubricants</span>
   //                   </Link>
   //                 </li>
   //                <li className="nav-item">
   //                   <Link className="nav-link" to="/customers">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   //                             <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z" fill="currentColor"></path>
   //                             <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z" fill="currentColor"></path>
   //                             <path opacity="0.4" d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z" fill="currentColor"></path>
   //                             <path d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z" fill="currentColor"></path>
   //                             <path opacity="0.4" d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z" fill="currentColor"></path>
   //                             <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor"></path>
   //                         </svg>
   //                     </i>
   //                      <span className="item-name">Customers</span>
   //                   </Link>
   //                </li>
   //                <li className="nav-item">
   //                   <Link className="nav-link" to="/expenses">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"className="icon-20" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
   //                            <path d="M21,6.5c0,.83-.67,1.5-1.5,1.5h-1.52c-.26,3.9-3.52,7-7.48,7h-1.8l7.75,6.34c.64,.52,.74,1.47,.21,2.11-.3,.36-.73,.55-1.16,.55-.33,0-.67-.11-.95-.34L3.55,14.66c-.49-.4-.68-1.07-.46-1.67,.21-.6,.78-1,1.41-1h6c2.31,0,4.22-1.75,4.47-4H4.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5H14.24c-.81-1.21-2.18-2-3.74-2H4.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h15c.83,0,1.5,.67,1.5,1.5s-.67,1.5-1.5,1.5h-3c.45,.6,.82,1.28,1.08,2h1.93c.83,0,1.5,.67,1.5,1.5Z" fill="currentColor"></path>
   //                         </svg>
   //                     </i>
   //                      <span className="item-name">Expenses</span>
   //                   </Link>
   //                </li>
   //                <li className="nav-item">
   //                  <Link className="nav-link" to="/dsrms">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
   //                            <path fillRule="evenodd" clipRule="evenodd" d="m16,9.5c0,1.378-1.121,2.5-2.5,2.5h-5.5v-3c0-1.103.897-2,2-2h3.5c1.379,0,2.5,1.122,2.5,2.5Zm8-4.5v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-6,4.5c0-2.481-2.019-4.5-4.5-4.5h-3.5c-2.206,0-4,1.794-4,4v9c0,.553.447,1,1,1s1-.447,1-1v-4h5.5c2.481,0,4.5-2.019,4.5-4.5Z" fill="currentColor"></path>
   //                         </svg>
   //                     </i>
   //                      <span className="item-name">DSR MS</span>
   //                   </Link>
   //                </li>
   //                <li className="nav-item">
   //                  <Link className="nav-link" to="/dsrhsd">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
   //                            <path fillRule="evenodd" clipRule="evenodd" d="m16,11.455v1.091c0,2.456-1.998,4.455-4.454,4.455h-2.046c-.827,0-1.5-.673-1.5-1.5v-7c0-.827.673-1.5,1.5-1.5h2.046c2.456,0,4.454,1.999,4.454,4.455Zm8-6.455v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-6,6.455c0-3.559-2.896-6.455-6.454-6.455h-2.046c-1.93,0-3.5,1.57-3.5,3.5v7c0,1.93,1.57,3.5,3.5,3.5h2.046c3.559,0,6.454-2.896,6.454-6.455v-1.091Z" fill="currentColor"></path>
   //                         </svg>
   //                     </i>
   //                      <span className="item-name">DSR HSD</span>
   //                   </Link>
   //                </li>                  
   //                <li className="nav-item">
   //                  <Link className="nav-link" to="/profit">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   //                            <path fillRule="evenodd" clipRule="evenodd" d="M15.2428 4.73756C15.2428 6.95855 17.0459 8.75902 19.2702 8.75902C19.5151 8.75782 19.7594 8.73431 20 8.68878V16.6615C20 20.0156 18.0215 22 14.6624 22H7.34636C3.97851 22 2 20.0156 2 16.6615V9.3561C2 6.00195 3.97851 4 7.34636 4H15.3131C15.2659 4.243 15.2423 4.49001 15.2428 4.73756ZM13.15 14.8966L16.0078 11.2088V11.1912C16.2525 10.8625 16.1901 10.3989 15.8671 10.1463C15.7108 10.0257 15.5122 9.97345 15.3167 10.0016C15.1211 10.0297 14.9453 10.1358 14.8295 10.2956L12.4201 13.3951L9.6766 11.2351C9.51997 11.1131 9.32071 11.0592 9.12381 11.0856C8.92691 11.1121 8.74898 11.2166 8.63019 11.3756L5.67562 15.1863C5.57177 15.3158 5.51586 15.4771 5.51734 15.6429C5.5002 15.9781 5.71187 16.2826 6.03238 16.3838C6.35288 16.485 6.70138 16.3573 6.88031 16.0732L9.35125 12.8771L12.0948 15.0283C12.2508 15.1541 12.4514 15.2111 12.6504 15.1863C12.8494 15.1615 13.0297 15.0569 13.15 14.8966Z" fill="currentColor"></path>
   //                            <circle opacity="0.4" cx="19.5" cy="4.5" r="2.5" fill="currentColor"></circle>
   //                         </svg>
   //                     </i>
   //                      <span className="item-name">Profit</span>
   //                   </Link>
   //                </li>
   //                <li className="nav-item">
   //                   <Link className="nav-link" to="/daily">
   //                      <i className="icon pe-1">
   //                         <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   //                            <path fillRule="evenodd" clipRule="evenodd" d="M3 16.8701V9.25708H21V16.9311C21 20.0701 19.0241 22.0001 15.8628 22.0001H8.12733C4.99561 22.0001 3 20.0301 3 16.8701ZM7.95938 14.4101C7.50494 14.4311 7.12953 14.0701 7.10977 13.6111C7.10977 13.1511 7.46542 12.7711 7.91987 12.7501C8.36443 12.7501 8.72997 13.1011 8.73985 13.5501C8.7596 14.0111 8.40395 14.3911 7.95938 14.4101ZM12.0198 14.4101C11.5653 14.4311 11.1899 14.0701 11.1701 13.6111C11.1701 13.1511 11.5258 12.7711 11.9802 12.7501C12.4248 12.7501 12.7903 13.1011 12.8002 13.5501C12.82 14.0111 12.4643 14.3911 12.0198 14.4101ZM16.0505 18.0901C15.596 18.0801 15.2305 17.7001 15.2305 17.2401C15.2206 16.7801 15.5862 16.4011 16.0406 16.3911H16.0505C16.5148 16.3911 16.8902 16.7711 16.8902 17.2401C16.8902 17.7101 16.5148 18.0901 16.0505 18.0901ZM11.1701 17.2401C11.1899 17.7001 11.5653 18.0611 12.0198 18.0401C12.4643 18.0211 12.82 17.6411 12.8002 17.1811C12.7903 16.7311 12.4248 16.3801 11.9802 16.3801C11.5258 16.4011 11.1701 16.7801 11.1701 17.2401ZM7.09989 17.2401C7.11965 17.7001 7.49506 18.0611 7.94951 18.0401C8.39407 18.0211 8.74973 17.6411 8.72997 17.1811C8.72009 16.7311 8.35456 16.3801 7.90999 16.3801C7.45554 16.4011 7.09989 16.7801 7.09989 17.2401ZM15.2404 13.6011C15.2404 13.1411 15.596 12.7711 16.0505 12.7611C16.4951 12.7611 16.8507 13.1201 16.8705 13.5611C16.8804 14.0211 16.5247 14.4011 16.0801 14.4101C15.6257 14.4201 15.2503 14.0701 15.2404 13.6111V13.6011Z" fill="currentColor"></path>                                <path opacity="0.4" d="M3.00293 9.25699C3.01577 8.66999 3.06517 7.50499 3.15803 7.12999C3.63224 5.02099 5.24256 3.68099 7.54442 3.48999H16.4555C18.7376 3.69099 20.3677 5.03999 20.8419 7.12999C20.9338 7.49499 20.9832 8.66899 20.996 9.25699H3.00293Z" fill="currentColor"></path>                                <path d="M8.30465 6.59C8.73934 6.59 9.06535 6.261 9.06535 5.82V2.771C9.06535 2.33 8.73934 2 8.30465 2C7.86996 2 7.54395 2.33 7.54395 2.771V5.82C7.54395 6.261 7.86996 6.59 8.30465 6.59Z" fill="currentColor"></path>                                <path d="M15.6953 6.59C16.1201 6.59 16.456 6.261 16.456 5.82V2.771C16.456 2.33 16.1201 2 15.6953 2C15.2606 2 14.9346 2.33 14.9346 2.771V5.82C14.9346 6.261 15.2606 6.59 15.6953 6.59Z" fill="currentColor"></path>
   //                          </svg>
   //                     </i>
   //                      <span className="item-name">Daily</span>
   //                   </Link>
   //                </li>
   //             </ul>
   //          </div> {/* container-fluid.// */}
   //          </nav>
   //          {/* Sidebar Menu End */}    
   //          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
   //             <span className="navbar-toggler-icon">
   //                <span className="navbar-toggler-bar bar1 mt-2"></span>
   //                <span className="navbar-toggler-bar bar2"></span>
   //                <span className="navbar-toggler-bar bar3"></span>
   //              </span>
   //          </button>
   //          <div className="collapse navbar-collapse" id="navbarSupportedContent">
   //            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
   //              <li className="nav-item dropdown">
   //                <a className="nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
   //                   <img src="assets/images/avatars/avtar_5.png" alt="User-Profile" className="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded" />
   //                  <div className="caption ms-3 d-none d-md-block">
   //                      <h6 className="mb-0 caption-title">Vikramjit Singh</h6>
   //                      <p className="mb-0 caption-sub-title">Administrator</p>
   //                  </div>
   //                </a>
   //                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
   //                  <li><Link className="dropdown-item" to="/changepassword">Change Password</Link></li>
   //                  <li><hr className="dropdown-divider" /></li>
   //                  <li><Link className="dropdown-item" href="/signin">Logout</Link></li>
   //                </ul>
   //              </li>
   //            </ul>
   //          </div>
   //        </div>
   //      </nav>
   <nav className="nav navbar navbar-expand-xl-md navbar-light iq-navbar">
  <div className="container-fluid navbar-inner">
  <button className="d-xl-none btn btn-primary rounded-pill p-1 pt-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbar_main">
    <svg aria-hidden="true" width="20px" className="icon-20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
    </svg>
  </button>

  <div className="col-lg-2 col-lg-3 navbar-brand">
    <a href="../dashboard/index.html" className="navbar-brand">
      {/* Logo start */}
      <svg aria-hidden="true" className="icon-30 text-primary" width={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="-0.757324" y="19.2427" width={28} height={4} rx={2} transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
        <rect x="7.72803" y="27.728" width={28} height={4} rx={2} transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
        <rect x="10.5366" y="16.3945" width={16} height={4} rx={2} transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
        <rect x="10.5562" y="-0.556152" width={28} height={4} rx={2} transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
      </svg>
      {/* Logo End */}
      <h4 className="logo-title">Hope UI</h4>
    </a>
  </div>

  {/* Offcanvas Navbar */}
  <nav id="navbar_main" className="offcanvas offcanvas-start navbar navbar-expand-xl hover-nav horizontal-nav mx-md-auto">
  <div class="container-fluid">
    <div className="offcanvas-header px-0">
      <div className="navbar-brand ms-3">
        {/* Logo start */}
        <div className="logo-main">
          <div className="logo-normal">
            <svg aria-hidden="true" className="text-primary icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width={28} height={4} rx={2} transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
              <rect x="7.72803" y="27.728" width={28} height={4} rx={2} transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
              <rect x="10.5366" y="16.3945" width={16} height={4} rx={2} transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width={28} height={4} rx={2} transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
            </svg>
          </div>
          <div className="logo-mini">
            <svg aria-hidden="true" className="text-primary icon-30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.757324" y="19.2427" width={28} height={4} rx={2} transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
              <rect x="7.72803" y="27.728" width={28} height={4} rx={2} transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
              <rect x="10.5366" y="16.3945" width={16} height={4} rx={2} transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
              <rect x="10.5562" y="-0.556152" width={28} height={4} rx={2} transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
            </svg>
          </div>
        </div>
        {/* Logo End */}
        <h4 className="logo-title">Hope UI</h4>
      </div>
      <button className="btn-close float-end" data-bs-dismiss="offcanvas"></button>
    </div>
         <ul className="navbar-nav">
                  <li className="nav-item">
                     <Link className="nav-link active" aria-current="page" to="/">
                       <i className="icon pe-1">
                              <svg aria-hidden="true"width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-20">
                                  <path opacity="0.4" d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z" fill="currentColor"></path>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z" fill="currentColor"></path>
                              </svg>
                          </i>
                          <span className="item-name">Dashboard</span>
                      </Link>
                  </li>
                   <li className="nav-item">
                      <Link className="nav-link" to="/daybook">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                               <path d="M10,4h-2c-1.1,0-2-.9-2-2s.9-2,2-2h2c1.1,0,2,.9,2,2s-.9,2-2,2Zm10,5h-4c-2.21,0-4,1.79-4,4v7c0,2.21,1.79,4,4,4h4c2.21,0,4-1.79,4-4v-7c0-2.21-1.79-4-4-4Zm0,10h-4c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Zm0-4h-4c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Zm-4-8h2c0-2.42-1.73-4.42-4.01-4.88-.07,2.15-1.82,3.88-3.99,3.88h-2c-2.17,0-3.94-1.74-3.99-3.9C1.73,2.56,0,4.58,0,7v12c0,2.76,2.24,5,5,5h6.53c-.95-1.06-1.53-2.46-1.53-4v-7c0-3.31,2.69-6,6-6Z" fill="currentColor"></path>
                            </svg>
                         </i>
                         <span className="item-name">DayBook</span>
                      </Link>
                   </li>
                   <li className="nav-item">
                     <Link className="nav-link" to="/lubricants">
                         <i className="icon pe-1">
                          <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                             <path d="M8.5,7.997c-.935,0-1.814-.364-2.475-1.025-1.364-1.364-1.364-3.586,0-4.95L7.801,.285c.389-.381,1.01-.381,1.398,0l1.768,1.729c1.373,1.372,1.373,3.593,.008,4.958h0c-.661,.661-1.54,1.025-2.475,1.025Zm14.652,.684c-.515-.469-1.186-.712-1.878-.678-.697,.032-1.339,.334-1.794,.835l-3.541,3.737c.032,.21,.065,.42,.065,.638,0,2.083-1.555,3.876-3.617,4.17l-4.252,.596c-.547,.078-1.053-.302-1.131-.848-.078-.547,.302-1.053,.848-1.131l4.162-.583c.936-.134,1.748-.806,1.94-1.732,.296-1.425-.79-2.685-2.164-2.685H4.003C1.794,11,.003,12.791,.003,15v5C.003,22.209,1.794,24,4.003,24h4.262c2.805,0,5.48-1.178,7.374-3.246l7.702-8.409c.948-1.062,.862-2.707-.189-3.665Z" fill="currentColor"></path>
                         </svg>
                       </i>
                        <span className="item-name">Lubricants</span>
                     </Link>
                   </li>
                  <li className="nav-item">
                      <Link className="nav-link" to="/customers">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z" fill="currentColor"></path>
                               <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z" fill="currentColor"></path>
                                <path d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z" fill="currentColor"></path>
                                <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor"></path>
                            </svg>
                        </i>
                         <span className="item-name">Customers</span>
                      </Link>
                   </li>
                   <li className="nav-item">
                      <Link className="nav-link" to="/expenses">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"className="icon-20" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                               <path d="M21,6.5c0,.83-.67,1.5-1.5,1.5h-1.52c-.26,3.9-3.52,7-7.48,7h-1.8l7.75,6.34c.64,.52,.74,1.47,.21,2.11-.3,.36-.73,.55-1.16,.55-.33,0-.67-.11-.95-.34L3.55,14.66c-.49-.4-.68-1.07-.46-1.67,.21-.6,.78-1,1.41-1h6c2.31,0,4.22-1.75,4.47-4H4.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5H14.24c-.81-1.21-2.18-2-3.74-2H4.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h15c.83,0,1.5,.67,1.5,1.5s-.67,1.5-1.5,1.5h-3c.45,.6,.82,1.28,1.08,2h1.93c.83,0,1.5,.67,1.5,1.5Z" fill="currentColor"></path>
                            </svg>
                       </i>
                         <span className="item-name">Expenses</span>
                      </Link>
                   </li>
                   <li className="nav-item">
                     <Link className="nav-link" to="/dsrms">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                               <path fillRule="evenodd" clipRule="evenodd" d="m16,9.5c0,1.378-1.121,2.5-2.5,2.5h-5.5v-3c0-1.103.897-2,2-2h3.5c1.379,0,2.5,1.122,2.5,2.5Zm8-4.5v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-6,4.5c0-2.481-2.019-4.5-4.5-4.5h-3.5c-2.206,0-4,1.794-4,4v9c0,.553.447,1,1,1s1-.447,1-1v-4h5.5c2.481,0,4.5-2.019,4.5-4.5Z" fill="currentColor"></path>
                            </svg>
                        </i>
                         <span className="item-name">DSR MS</span>
                     </Link>
                   </li>
                   <li className="nav-item">
                     <Link className="nav-link" to="/dsrhsd">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20">
                               <path fillRule="evenodd" clipRule="evenodd" d="m16,11.455v1.091c0,2.456-1.998,4.455-4.454,4.455h-2.046c-.827,0-1.5-.673-1.5-1.5v-7c0-.827.673-1.5,1.5-1.5h2.046c2.456,0,4.454,1.999,4.454,4.455Zm8-6.455v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-6,6.455c0-3.559-2.896-6.455-6.454-6.455h-2.046c-1.93,0-3.5,1.57-3.5,3.5v7c0,1.93,1.57,3.5,3.5,3.5h2.046c3.559,0,6.454-2.896,6.454-6.455v-1.091Z" fill="currentColor"></path>
                            </svg>
                        </i>
                         <span className="item-name">DSR HSD</span>
                      </Link>
                  </li>                  
                   <li className="nav-item">
                     <Link className="nav-link" to="/profit">
                         <i className="icon pe-1">
                           <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path fillRule="evenodd" clipRule="evenodd" d="M15.2428 4.73756C15.2428 6.95855 17.0459 8.75902 19.2702 8.75902C19.5151 8.75782 19.7594 8.73431 20 8.68878V16.6615C20 20.0156 18.0215 22 14.6624 22H7.34636C3.97851 22 2 20.0156 2 16.6615V9.3561C2 6.00195 3.97851 4 7.34636 4H15.3131C15.2659 4.243 15.2423 4.49001 15.2428 4.73756ZM13.15 14.8966L16.0078 11.2088V11.1912C16.2525 10.8625 16.1901 10.3989 15.8671 10.1463C15.7108 10.0257 15.5122 9.97345 15.3167 10.0016C15.1211 10.0297 14.9453 10.1358 14.8295 10.2956L12.4201 13.3951L9.6766 11.2351C9.51997 11.1131 9.32071 11.0592 9.12381 11.0856C8.92691 11.1121 8.74898 11.2166 8.63019 11.3756L5.67562 15.1863C5.57177 15.3158 5.51586 15.4771 5.51734 15.6429C5.5002 15.9781 5.71187 16.2826 6.03238 16.3838C6.35288 16.485 6.70138 16.3573 6.88031 16.0732L9.35125 12.8771L12.0948 15.0283C12.2508 15.1541 12.4514 15.2111 12.6504 15.1863C12.8494 15.1615 13.0297 15.0569 13.15 14.8966Z" fill="currentColor"></path>
                               <circle opacity="0.4" cx="19.5" cy="4.5" r="2.5" fill="currentColor"></circle>
                            </svg>
                        </i>
                         <span className="item-name">Profit</span>
                      </Link>
                   </li>
                   <li className="nav-item">
                      <Link className="nav-link" to="/daily">
                         <i className="icon pe-1">
                            <svg aria-hidden="true"className="icon-24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path fillRule="evenodd" clipRule="evenodd" d="M3 16.8701V9.25708H21V16.9311C21 20.0701 19.0241 22.0001 15.8628 22.0001H8.12733C4.99561 22.0001 3 20.0301 3 16.8701ZM7.95938 14.4101C7.50494 14.4311 7.12953 14.0701 7.10977 13.6111C7.10977 13.1511 7.46542 12.7711 7.91987 12.7501C8.36443 12.7501 8.72997 13.1011 8.73985 13.5501C8.7596 14.0111 8.40395 14.3911 7.95938 14.4101ZM12.0198 14.4101C11.5653 14.4311 11.1899 14.0701 11.1701 13.6111C11.1701 13.1511 11.5258 12.7711 11.9802 12.7501C12.4248 12.7501 12.7903 13.1011 12.8002 13.5501C12.82 14.0111 12.4643 14.3911 12.0198 14.4101ZM16.0505 18.0901C15.596 18.0801 15.2305 17.7001 15.2305 17.2401C15.2206 16.7801 15.5862 16.4011 16.0406 16.3911H16.0505C16.5148 16.3911 16.8902 16.7711 16.8902 17.2401C16.8902 17.7101 16.5148 18.0901 16.0505 18.0901ZM11.1701 17.2401C11.1899 17.7001 11.5653 18.0611 12.0198 18.0401C12.4643 18.0211 12.82 17.6411 12.8002 17.1811C12.7903 16.7311 12.4248 16.3801 11.9802 16.3801C11.5258 16.4011 11.1701 16.7801 11.1701 17.2401ZM7.09989 17.2401C7.11965 17.7001 7.49506 18.0611 7.94951 18.0401C8.39407 18.0211 8.74973 17.6411 8.72997 17.1811C8.72009 16.7311 8.35456 16.3801 7.90999 16.3801C7.45554 16.4011 7.09989 16.7801 7.09989 17.2401ZM15.2404 13.6011C15.2404 13.1411 15.596 12.7711 16.0505 12.7611C16.4951 12.7611 16.8507 13.1201 16.8705 13.5611C16.8804 14.0211 16.5247 14.4011 16.0801 14.4101C15.6257 14.4201 15.2503 14.0701 15.2404 13.6111V13.6011Z" fill="currentColor"></path>                                <path opacity="0.4" d="M3.00293 9.25699C3.01577 8.66999 3.06517 7.50499 3.15803 7.12999C3.63224 5.02099 5.24256 3.68099 7.54442 3.48999H16.4555C18.7376 3.69099 20.3677 5.03999 20.8419 7.12999C20.9338 7.49499 20.9832 8.66899 20.996 9.25699H3.00293Z" fill="currentColor"></path>                                <path d="M8.30465 6.59C8.73934 6.59 9.06535 6.261 9.06535 5.82V2.771C9.06535 2.33 8.73934 2 8.30465 2C7.86996 2 7.54395 2.33 7.54395 2.771V5.82C7.54395 6.261 7.86996 6.59 8.30465 6.59Z" fill="currentColor"></path>                                <path d="M15.6953 6.59C16.1201 6.59 16.456 6.261 16.456 5.82V2.771C16.456 2.33 16.1201 2 15.6953 2C15.2606 2 14.9346 2.33 14.9346 2.771V5.82C14.9346 6.261 15.2606 6.59 15.6953 6.59Z" fill="currentColor"></path>
                             </svg>
                        </i>
                       <span className="item-name">Daily</span>
                      </Link>
                  </li>
                </ul>
            </div>
     </nav>
     {/* Sidebar Menu End */}
     <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon">
          <span className="navbar-toggler-bar bar1 mt-2"></span>
          <span className="navbar-toggler-bar bar2"></span>
          <span className="navbar-toggler-bar bar3"></span>
        </span>
      </button>

      <div className="collapse navbar-collapse col-md-2" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link py-0 d-flex align-items-center"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="assets/images/avatars/avtar_5.png"
                alt="User-Profile"
                className="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded"
              />
              <div className="caption ms-3 d-none d-md-block">
                <h6 className="mb-0 caption-title">Vikramjit Singh</h6>
                <p className="mb-0 caption-sub-title">Administrator</p>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/changepassword">Change Password</Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/signin">Logout</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
   </div>
 </nav>
 );
};

export default NavBar;