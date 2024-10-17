
import './style.scss'
import { Formik, Form, Field } from 'formik';
import Schemas from '../../utils/validation-schemas';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import OverlayComponent from '../../components/OverLay'

const ContactUs = (props) => {
    const handleSubmit = async (e) => {

    }
    return (<>
        <div className="container mx-auto px-4 py-8 
        home page-template-default page page-id-14980 theme-hotale gdlr-core-body tourmaster-body woocommerce-no-js hotale-body hotale-body-front hotale-full hotale-with-sticky-navigation hotale-blockquote-style-3 gdlr-core-link-to-lightbox">
            <div className="hotale-body-outer-wrapper mm-page mm-slideout" id="mm-0">

                <div className="hotale-body-wrapper clearfix hotale-with-transparent-header hotale-with-frame">
                    <div className="hotale-page-wrapper" id="hotale-page-wrapper">
                        <div className="gdlr-core-page-builder-body">
                            <div className="gdlr-core-pbf-wrapper" data-skin="White Text">
                                <div className="gdlr-core-pbf-background-wrap bg-brand" >
                                    <div className="gdlr-core-pbf-background gdlr-core-parallax gdlr-core-js" data-parallax-speed="0.2"></div>
                                </div>
                                <div className="gdlr-core-pbf-wrapper-content gdlr-core-js">
                                    <div className="gdlr-core-pbf-wrapper-container clearfix gdlr-core-container">
                                        <div className="gdlr-core-pbf-column gdlr-core-column-20 gdlr-core-column-first" id="gdlr-core-column-1">
                                            <div className="gdlr-core-pbf-column-content-margin gdlr-core-js" >
                                                <div className="gdlr-core-pbf-background-wrap"></div>
                                                <div className="gdlr-core-pbf-column-content clearfix gdlr-core-js fadeInUp"
                                                >
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-icon-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div
                                                                className="gdlr-core-icon-item-wrap gdlr-core-skin-e-background gdlr-core-icon-item-type-round"
                                                                style={{
                                                                    backgroundColor: "#ffffff",
                                                                    borderRadius: "40px",
                                                                    padding: "20px 20px 20px 20px"

                                                                }}
                                                            >
                                                                <i className="gdlr-core-icon-item-icon fa fa-phone gdlr-core-skin-e-content"
                                                                    style={{
                                                                        color: "#0a0a0a",
                                                                        fontSize: "40px",
                                                                        minWidth: "40px",
                                                                        minHeight: "40px",
                                                                    }}
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-title-item gdlr-core-item-pdb clearfix gdlr-core-left-align gdlr-core-title-item-caption-top gdlr-core-item-pdlr" >
                                                            <div className="gdlr-core-title-item-title-wrap">
                                                                <h3 className="gdlr-core-title-item-title gdlr-core-skin-title class-test" >
                                                                    Phone<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div className="gdlr-core-text-box-item-content" ><p>Hãy liên hệ với chúng tôi qua số điện thoại.</p></div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align">
                                                            <div className="gdlr-core-text-box-item-content" >
                                                                <p><a href="#">+84-2345-2345</a></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gdlr-core-pbf-column gdlr-core-column-20" id="gdlr-core-column-2">
                                            <div className="gdlr-core-pbf-column-content-margin gdlr-core-js" >
                                                <div className="gdlr-core-pbf-background-wrap"></div>
                                                <div className="gdlr-core-pbf-column-content clearfix gdlr-core-js fadeInUp"
                                                >
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-icon-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div
                                                                className="gdlr-core-icon-item-wrap gdlr-core-skin-e-background gdlr-core-icon-item-type-round"
                                                                style={{
                                                                    backgroundColor: "#ffffff",
                                                                    borderRadius: "40px",
                                                                    padding: "20px 20px 20px 20px"

                                                                }}
                                                            >
                                                                <i
                                                                    style={{
                                                                        color: "#0a0a0a",
                                                                        fontSize: "40px",
                                                                        minWidth: "40px",
                                                                        minHeight: "40px",
                                                                    }}
                                                                    className="gdlr-core-icon-item-icon fa fa-envelope-o gdlr-core-skin-e-content" ></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-title-item gdlr-core-item-pdb clearfix gdlr-core-left-align gdlr-core-title-item-caption-top gdlr-core-item-pdlr" >
                                                            <div className="gdlr-core-title-item-title-wrap">
                                                                <h3 className="gdlr-core-title-item-title gdlr-core-skin-title class-test" >
                                                                    Email<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div className="gdlr-core-text-box-item-content" ><p>Hãy liên hệ với chúng tôi qua Email.</p></div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align">
                                                            <div className="gdlr-core-text-box-item-content" >
                                                                <p>
                                                                    <a href="#">
                                                                        <span  >proxywindert11@gmail.com</span>
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gdlr-core-pbf-column gdlr-core-column-20" id="gdlr-core-column-3">
                                            <div className="gdlr-core-pbf-column-content-margin gdlr-core-js" >
                                                <div className="gdlr-core-pbf-background-wrap"></div>
                                                <div className="gdlr-core-pbf-column-content clearfix gdlr-core-js fadeInUp"
                                                >
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-icon-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div
                                                                className="gdlr-core-icon-item-wrap gdlr-core-skin-e-background gdlr-core-icon-item-type-round"
                                                                style={{
                                                                    backgroundColor: "#ffffff",
                                                                    borderRadius: "40px",
                                                                    padding: "20px 20px 20px 20px"

                                                                }}
                                                            >
                                                                <i
                                                                    style={{
                                                                        color: "#0a0a0a",
                                                                        fontSize: "40px",
                                                                        minWidth: "40px",
                                                                        minHeight: "40px",
                                                                    }}
                                                                    className="gdlr-core-icon-item-icon fa fa-location-arrow gdlr-core-skin-e-content" ></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-title-item gdlr-core-item-pdb clearfix gdlr-core-left-align gdlr-core-title-item-caption-top gdlr-core-item-pdlr" >
                                                            <div className="gdlr-core-title-item-title-wrap">
                                                                <h3 className="gdlr-core-title-item-title gdlr-core-skin-title class-test" >
                                                                    Location<span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align" >
                                                            <div className="gdlr-core-text-box-item-content" >
                                                                <p>
                                                                   Địa chỉ của chúng tôi
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-text-box-item gdlr-core-item-pdlr gdlr-core-item-pdb gdlr-core-left-align">
                                                            <div className="gdlr-core-text-box-item-content" >
                                                            <p>
                                                                    Số 10 Vũ Ngọc Phan.<br />
                                                                    Đà Nẵng, Việt Nam 33342
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="gdlr-core-pbf-wrapper" >
                                <div className="gdlr-core-pbf-background-wrap" ></div>
                                <div className="gdlr-core-pbf-wrapper-content gdlr-core-js">
                                    <div className="gdlr-core-pbf-wrapper-container clearfix gdlr-core-container">
                                        <div className="gdlr-core-pbf-column gdlr-core-column-60 gdlr-core-column-first" data-skin="Contact Field" id="gdlr-core-column-4">
                                            <div className="gdlr-core-pbf-column-content-margin gdlr-core-js">
                                                <div className="gdlr-core-pbf-background-wrap"></div>
                                                <div className="gdlr-core-pbf-column-content clearfix gdlr-core-js" >
                                                    <div className="gdlr-core-pbf-element">
                                                        <div className="gdlr-core-title-item gdlr-core-item-pdb clearfix gdlr-core-center-align gdlr-core-title-item-caption-bottom gdlr-core-item-pdlr" >
                                                            <div className="gdlr-core-title-item-title-wrap">
                                                                <h3 className="gdlr-core-title-item-title gdlr-core-skin-title class-test" >
                                                                    Hãy liên hệ với chúng tôi <span className="gdlr-core-title-item-title-divider gdlr-core-skin-divider"></span>
                                                                </h3>
                                                            </div>
                                                            <span className="gdlr-core-title-item-caption gdlr-core-info-font gdlr-core-skin-caption" >
                                                                chúng tôi sẽ phản hồi sớm nhất có thể.
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="gdlr-core-pbf-element flex flex-col justify-center items-center">
                                                        <div className="gdlr-core-contact-form-7-item gdlr-core-item-pdlr gdlr-core-item-pdb 
                                                        md:w-[50%] lg:w-[50%] w-[100%]">
                                                            <div role="form" className="wpcf7" id="wpcf7-f1979-p1964-o1" lang="en-US" dir="ltr">
                                                                <div className="screen-reader-response">
                                                                    <p role="status" aria-live="polite" aria-atomic="true"></p>
                                                                    <ul></ul>
                                                                </div>
                                                                <Formik
                                                                    initialValues={{
                                                                        name: '',
                                                                        email: '',
                                                                        message: ''
                                                                    }}
                                                                    validationSchema={Schemas.contactSchema}
                                                                    onSubmit={(values) => handleSubmit(values)}

                                                                >

                                                                    {({ errors, touched }) => (
                                                                        <Form >
                                                                            <div className="mb-6">
                                                                                <span style={{ color: "red" }} class="wpforms-required-label">*</span>
                                                                                <Field

                                                                                    type="name"
                                                                                    name="name"
                                                                                    placeholder="name"

                                                                                    autoComplete="name"
                                                                                    className={`${errors.name && touched.name ? 'border-red-500' : ''} appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                                                                />
                                                                                {errors.name && touched.name ? (
                                                                                    <div className='text-red-400 text-sm m-y-2'>{errors.name}</div>
                                                                                ) : null}
                                                                            </div>
                                                                            <div className="mb-6">
                                                                                <span style={{ color: "red" }} class="wpforms-required-label">*</span>
                                                                                <Field
                                                                                    type="email"
                                                                                    name="email"
                                                                                    placeholder="Email"

                                                                                    autoComplete="Email"
                                                                                    className={`${errors.email && touched.email ? 'border-red-500' : ''} appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}

                                                                                />
                                                                                {errors.email && touched.email ? (
                                                                                    <div className='text-red-400 text-sm m-y-2'>{errors.email}</div>
                                                                                ) : null}
                                                                            </div>
                                                                            <div className="mb-6">
                                                                                <span style={{ color: "red" }} class="wpforms-required-label">*</span>
                                                                                <Field
                                                                                    type="text"
                                                                                    name="message"
                                                                                    placeholder="message"

                                                                                    autoComplete="message"
                                                                                    className={`${errors.message && touched.message ? 'border-red-500' : ''} appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}

                                                                                />
                                                                                {errors.message && touched.message ? (
                                                                                    <div className='text-red-400 text-sm m-y-2'>{errors.message}</div>
                                                                                ) : null}
                                                                            </div>
                                                                            <div className="items-center">
                                                                                <div>
                                                                                    <button
                                                                                        type="submit"
                                                                                        className="bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                                                                                        focus:outline-none focus:shadow-outline w-full"
                                                                                    >
                                                                                        Gửi
                                                                                    </button>
                                                                                </div>

                                                                            </div>

                                                                        </Form>
                                                                    )}


                                                                </Formik>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="gdlr-core-pbf-wrapper" >
                                <div className="gdlr-core-pbf-background-wrap"></div>
                                <div className="gdlr-core-pbf-wrapper-content gdlr-core-js">
                                    <div className="gdlr-core-pbf-wrapper-container clearfix gdlr-core-pbf-wrapper-full-no-space">
                                        <div className="gdlr-core-pbf-element">
                                            <div className="gdlr-core-wp-google-map-plugin-item gdlr-core-item-pdlr gdlr-core-item-pdb" >
                                                <div className="wpgmp_map_container wpgmp-map-1" rel="map1">
                                                    <iframe style={{ width: "100%" }} src="https://maps.google.com/maps?q=Vũ+Ngọc+Phan,+Hòa+Khánh+Bắc,+Liên+Chiểu,+Đà+Nẵng+550000,+Việt+Nam&t=&z=13&ie=UTF8&iwloc=&output=embed" width="600" height="450" ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="gdlr-core-pbf-wrapper" style={{ margin: "0", padding: "0" }}>
                                <div className="gdlr-core-pbf-background-wrap" ></div>
                                <div className="gdlr-core-pbf-wrapper-content gdlr-core-js">
                                    <div className="gdlr-core-pbf-wrapper-container clearfix gdlr-core-container">
                                        <div className="gdlr-core-pbf-element">
                                            <div className="gdlr-core-social-network-item gdlr-core-item-pdb gdlr-core-center-align gdlr-core-item-pdlr gdlr-direction-horizontal">
                                                <a href="/cdn-cgi/l/email-protection#5172" target="_blank" className="gdlr-core-social-network-icon" title="email" >
                                                    <i className="fa fa-envelope"></i>
                                                </a>
                                                <a href="#" target="_blank" className="gdlr-core-social-network-icon" title="facebook" ><i className="fa fa-facebook"></i></a>
                                                <a href="#" target="_blank" className="gdlr-core-social-network-icon" title="skype" ><i className="fa fa-skype"></i></a>
                                                <a href="#" target="_blank" className="gdlr-core-social-network-icon" title="twitter" ><i className="fa fa-twitter"></i></a>
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
    </>)
}

export default ContactUs