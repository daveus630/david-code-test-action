import React, { Component } from 'react';
import axios from 'axios';
import 'react-daypicker/lib/DayPicker.css';
import DayPicker from 'react-daypicker';


class Payform extends Component {
    constructor(props) {
        super(props)

        this.state = {
            date: '',
            user_id: '',
            user_type: '',
            type: '',
            amount: '',
            currency: 'EUR'
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    
    submitHandler = (e) => {
        e.preventDefault();
        console.log(this.state)
        axios.post('http://localhost:4000/api/payment', this.state)
        .then(res => {
            console.log(res)
            this.refreshPage()
        })
        .catch(err => {
            console.log(err);
        })
        
    }
    refreshPage() {
        alert("Data submitted successfully!");
        window.location.reload(false);
      }
    
    render() {
        const { date, user_id, user_type, type, amount, currency, resetForm } = this.state
        
        return (
            <div className="mainForm">
                
                <form onSubmit={this.submitHandler}><div>
                <h1>Payment Form</h1>
                    <DayPicker name="date" value={date} onDayClick={(date) => this.setState({ date })} />
                    </div>
                    <div>
                        User ID: 
                        <input className="tb" 
                            type="text" 
                            name="user_id" 
                            value={user_id} 
                            placeholder="User ID"
                            required
                            onChange={this.changeHandler}
                        />
                    </div>
                    <br/>
                    <div>
                        User Type: 
                        <br />
                        <select className="tbox" 
                            name="user_type"   
                            required
                            value={user_type} 
                            onChange={this.changeHandler}>
                            <option></option>
                            <option value="natural">natural</option>
                            <option value="juridical">juridical</option>
                        </select>
                    </div>
                    
                    <div>
                        Payment Type:
                        <br />
                        <select className="tbox" 
                            name="type"   
                            required 
                            value={type}    
                            onChange={this.changeHandler}>
                            <option></option>
                            <option value="cash_in">cash_in</option>
                            <option value="cash_out">cash_out</option>
                        </select>
                    </div>
                    
                    <h3>Operation:</h3>
                    <div>
                        Amount: 
                        <input className="tbox" 
                            type="text" 
                            name="amount" 
                            value={amount} 
                            placeholder="Amount"
                            required
                            onChange={this.changeHandler}
                        />
                    </div>
                    <div><br/>
                        Currency: &#8364; EUR
                        <label 
                            type="text" 
                            name="currency" 
                            value={currency}
                        /><label/>
                    </div>
                    <br/>
                    <button type='submit' className="button">Submit</button>
                </form>
            </div>
        )
    }
}

export default Payform