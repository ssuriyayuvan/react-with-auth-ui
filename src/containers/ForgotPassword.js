import React, { Component } from "react";
import { Button, Form, Input } from "antd";

import { connect } from "react-redux";
import {
    hideMessage,
    showAuthLoader,
    forgotPasswordUser,
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";

const FormItem = Form.Item;


class ForgotPassword extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.forgotPasswordUser(values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { status } = this.props;

        if (status)
            return <p><IntlMessages id="app.userAuth.confirmText" /> </p>;

        return (
            <div className="gx-login-container">
                <div className="gx-login-content">

                    <div className="gx-login-header">
                        <img style={{width: '120px'}} src={require("assets/images/logo-white.png")} alt="Atskill" title="Atskill" />
                    </div>
                    <div className="gx-mb-4">
                        <h2>Forgot Your Password ?</h2>
                        <p><IntlMessages id="app.userAuth.forgot" /></p>
                    </div>

                    <Form layout="vertical" onSubmit={this.handleSubmit} className="gx-login-form gx-form-row0">

                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input type="email" placeholder="E-Mail Address" />
                            )}
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit">
                                <IntlMessages id="app.userAuth.send" />
                            </Button>
                        </FormItem>
                    </Form>

                </div>
            </div>
        );
    }
}

const WrappedForgotPasswordForm = Form.create()(ForgotPassword);

const mapStateToProps = ({ auth }) => {
    const { loader, alertMessage, showMessage, status } = auth;
    return { loader, alertMessage, showMessage, status }
};

export default connect(mapStateToProps, {
    forgotPasswordUser
})(WrappedForgotPasswordForm);
