import React, {Component} from 'react';
import {Label} from 'react-bootstrap/lib';


export default class Register extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            mobile: '',
            msg: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.logChange = this.logChange.bind(this);
    }

    handleSubmit(event) {
        console.log("submit");
        let self = this;
        event.preventDefault()
        var data = {
            username: self.state.username,
            email: self.state.email,
            mobile: self.state.mobile
        }
        console.log(data)
        fetch("/customer/add", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            console.log(data)    
            if(data.code === 200){
               self.setState({msg: "Thanks for registering"}); 
               self.props.history.push('/Admin',null);
            }
        }).catch(function(err) {
            console.log(err)
        });

    }

    logChange(e) {
        this.setState({[e.target.name]: e.target.value});  
    }

    render() {
        return (
            <div className="container register-form">
                <form onSubmit={this.handleSubmit} method="POST">
                <input name='userid' type="hidden" value={this.state.userid}/>
                    <Label>姓名</Label>
                    <input onChange={this.logChange} className="form-control"   name='username' />
                    <Label>邮箱</Label>
                    <input onChange={this.logChange} className="form-control"   name='email' />
                    <Label>手机</Label>
                    <input onChange={this.logChange} className="form-control"   name='mobile' />
                    <div className="submit-section">
                        <button className="btn btn-uth-submit">保存</button>
                    </div>
                </form>
            </div>
        );
    }
}