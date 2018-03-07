import React, {Component} from 'react';
import Modal from 'react-modal/lib/components/Modal.js';
import {Label} from 'react-bootstrap/lib';
export default class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            modalIsOpen: false,
            username: '',
            email: '',
            mobile: '',
            msg: '',
            userid: 0
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.logChange = this.logChange.bind(this); // We capture the value and change state as user changes the value here.
        this.handleEdit = this.handleEdit.bind(this); // Function where we submit data
        this.toAdd = this.toAdd.bind(this);
    }

    toAdd(){
        this.props.history.push('/Register',null);
    }

    openModal(member) {
        this.setState({
            modalIsOpen: true,
            username: member.username,
            email: member.email,
            mobile: member.mobile,
            userid: member.userid
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    logChange(e) {
        this.setState({
            [e.target.name]: e.target.value //setting value edited by the admin in state.
        });
    }

    handleEdit(event) {
        //Edit functionality
        let self = this;
        event.preventDefault()
        var data = {
            username: self.state.username,
            email: self.state.email,
            mobile: self.state.mobile,
            userid: self.state.userid
        }
        fetch("/customer/edit/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            console.log(data)
            if (data.code === 200) {
                self.setState({
                    msg: "User has been edited.",
                    modalIsOpen: false
                });
                console.log("User has been edited.");
            }
        }).catch(function(err) {
            console.log(err)
        });
        self.queryMember();
    }

    componentDidMount() {
        this.queryMember();
        console.log('componentDidMount');
    }
    queryMember(){
        let self = this;
        fetch('/customer/query', {
            method: 'GET'
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.setState({
                users: data
            });
        }).catch(err => {
            console.log('caught it!', err);
        });
    }
    //解决react-modal: App element is not defined的问题
    componentWillMount() {
        Modal.setAppElement('#root');
    }

    deleteMember(member){
        let self = this;
        var data = {
            userid: member.userid
        }
        fetch("/customer/delete", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            if(data.code === 200){
                console.log("User has been deleted.");
               self.setState({msg: "User has been deleted."});
               console.log(self.state);  
            }
        }).catch(function(err) {
            console.log(err)
        });
        self.queryMember();
    }

    render() {
        return ( 
        <div className="container"> 
            <div className="panel panel-default p50 uth-panel">
            <button onClick={() => this.toAdd()}>新增</button>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>邮箱</th>
                            <th>手机</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map(member =>
                            <tr key={member.userid}>
                                <td>{member.username} </td>
                                <td>{member.email}</td>
                                <td>{member.mobile}</td>
                                <td><a onClick={() => this.openModal(member)}>编辑</a>|<a onClick={() => this.deleteMember(member)}>删除</a></td>
                            </tr>
                        )}
                        
                    </tbody>
                </table>
            </div>
       
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel="Example Modal" >
                        <form onSubmit={this.handleEdit} method="POST">
                            <input name='userid' type="hidden" value={this.state.userid}/>
                            <Label>Name</Label>
                            <input onChange={this.logChange} className="form-control" value={this.state.username} placeholder='John' name='username' />
                            <Label>Email</Label>
                            <input onChange={this.logChange} className="form-control" value={this.state.email} placeholder='email@email.com' name='email' />
                            <Label>Mobile</Label>
                            <input onChange={this.logChange} className="form-control" value={this.state.mobile} placeholder='13366035900' name='mobile' />
                            <div className="submit-section">
                            <button className="btn btn-uth-submit">保存</button>
                            </div>
                        </form>
                        </Modal>
        </div>
        );
    }
}