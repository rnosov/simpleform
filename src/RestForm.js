/*
 * RestForm React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { Component, PropTypes } from 'react';
import SimpleForm from './SimpleForm';
import scroller from 'react-scroll/lib/mixins/scroller';

const
  propTypes = {
    endpoint: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    onFormWillFetch: PropTypes.func,
    setStatus: PropTypes.func.isRequired,
    onResponseReceived: PropTypes.func.isRequired,
    waitText: PropTypes.string,
    errorText: PropTypes.string,
    successText: PropTypes.string,
    welcomeText: PropTypes.string,
    scrollOrigin: PropTypes.string,
  },
  defaultProps = {
    scrollOrigin: 'content',
  };

class RestForm extends Component {

  state = {
    msg: false,
    status: 'info',
    spinner: false,
  };
  isProcessing = false;

  jsonFetch(body) {
    return fetch(this.props.endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(body),
    });
  }

  async handleApiCall(form) {
    if (this.props.onFormWillFetch)
      form = await this.props.onFormWillFetch(form);
    const response = await this.jsonFetch(form);
    if (response.status < 200 && response.status >= 300)
      throw new Error(response.statusText);
    return await this.props.onResponseReceived(response);
  }

  async handleSubmit(form) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.props.setStatus('info', this.props.waitText, true);
    setTimeout( () => scroller.scrollTo(this.props.scrollOrigin, {
      duration: 500,
      delay: 0,
      smooth: true,
    }), 200);
    try {
      this.props.setStatus('success', await this.handleApiCall(form));
    }
    catch (err) {
      this.props.setStatus('danger', err.message || err);
    }
    finally {
      this.isProcessing = false;
    }
  }

  render() {
    if (typeof this.props.msg === 'string') {
      const goBack = <button onClick={ () => this.props.setStatus() } className="btn btn-outline-primary">Go back to the form</button>;
      return (
        <div className={`alert alert-` + this.props.status} role="alert">
          {this.props.status === 'danger' ?<h4 className="alert-heading">{this.props.errorText}</h4>:void 0}
          <p>{this.props.msg}</p>
          {goBack}
        </div>
      );
    }
    return(
      <div>
        <p>{this.props.welcomeText}</p>
        <SimpleForm
          schema={ this.props.schema }
          onSubmit={ ::this.handleSubmit }
          submitText={ this.props.submitText }
        />
      </div>
    );
  }

}

RestForm.propTypes = propTypes;
RestForm.defaultProps = defaultProps;

export default RestForm;
