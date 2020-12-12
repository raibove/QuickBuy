import React,{useState} from 'react';
import {useFormik} from 'formik';
import './PlaceOrder.css';
import Axios from 'axios';
import { withRouter,Redirect } from 'react-router-dom';

const validate= values =>{
    const errors = {};
    if(!values.rice){
        errors.rice = 'Required';
    }
    if(!values.wheat){
        errors.wheat = 'Required';
    }
    if(!values.sugar){
        errors.sugar = 'Required';
    }
    return errors;
}
const PlaceOrder = (props)=>{

    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const isScanned = localStorage.getItem('isScanned');
    const cardNo = localStorage.getItem('cardNo');

    const formik = useFormik({
        initialValues:{
            rice:'',
            wheat:'',
            sugar:''
        },
        validate,
        onSubmit: values=>{
            if(isSubmitClicked === 'true'){
                
                Axios.post('/placeOrder',{
                    Rice: values.rice,
                    Wheat: values.wheat,
                    Sugar: values.sugar,
                    cardNo: cardNo
                })
                .then(response=>{
                    console.log(response);
                    if(response.status===205){
                        console.log(response.data);
                        alert("Out of stock");
                    }
                    else{
                    //alert('Order placed');
                    //console.log("/order"+response.data.orderId);
                    props.history.push({pathname:"/order/"+response.data.orderId,state:{ordr:response.data}});
                    }
                }).catch(error=>{
                    console.log('Order place error: ');
                    console.log(error.response);
                    console.log(error.response.data);
                })
            }
        }
    });
    console.log("isScanned "+isScanned);

    return isScanned ? (<div className="container-order">
        <form onSubmit={formik.handleSubmit} autoComplete="off">
            <label>Rice</label>
            <input 
                id="rice"
                name="rice"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rice}
                className={
                formik.errors.rice && formik.touched.rice
                  ? 'text-input error'
                  : 'text-input'
                }
                autoComplete="off"
            />
            {formik.touched.rice && formik.errors.rice ? <div className="input-feedback">{formik.errors.rice}</div>:null}

            <label>Wheat</label>
            <input
                id="wheat"
                name="wheat"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.wheat}
                className={
                    formik.errors.wheat && formik.touched.wheat
                    ? 'text-input error'
                    : 'text-input'
                }
                autoComplete="off"
            />
            {formik.touched.wheat && formik.errors.wheat ? <div className="input-feedback">{formik.errors.wheat}</div>:null}

            <label>Sugar</label>
            <input
                id="sugar"
                name="sugar"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sugar}
                className={
                    formik.touched.sugar && formik.errors.sugar
                    ? 'text-input error'
                    : 'text-input'
                }
                autoComplete="off"
            />
            {formik.touched.sugar && formik.errors.sugar ? <div className='input-feedback'>{formik.errors.sugar}</div>:null}
            <br />
            <button type="submit" className="submit" onClick={()=>setIsSubmitClicked('true')}>Submit</button>
        </form>
    </div>
    ) : (
        <Redirect to="/agent" />
    )}

export default withRouter(PlaceOrder);