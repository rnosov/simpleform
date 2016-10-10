/*
 * SimpleForm React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { PropTypes, Component } from 'react';
import update from 'react-addons-update';
import Transition from 'react-overlays/lib/Transition';

const
  propTypes = {
    schema: PropTypes.object,
    leftClass: PropTypes.string,
    centralClass: PropTypes.string,
    rightClass: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    requiredFieldText: PropTypes.string,
    emptyFieldText: PropTypes.string,
    dodgyEmailText: PropTypes.string,
    mandatoryFieldText: PropTypes.string,
    animationDuration: PropTypes.number,
    enteringClass: PropTypes.string,
    leavingClass: PropTypes.string,
    totalErrorsAnimationDuration: PropTypes.number,
    totalErrorsEnteringClass: PropTypes.string,
    totalErrorsLeavingClass: PropTypes.string,
    totalErrorsText: PropTypes.func,
    noscriptText: PropTypes.string,
    children: React.PropTypes.node,
  },
  defaultProps = {
    leftClass: 'col-sm-2',
    centralClass: 'col-sm-5',
    rightClass: 'col-sm-4',
    submitText: 'Submit',
    requiredFieldText: 'Required field',
    emptyFieldText: 'Empty field',
    dodgyEmailText: 'It doesn\'t look like an email',
    mandatoryFieldText: 'Mandatory fields',

    animationDuration: 1000,
    totalErrorsAnimationDuration: 400,
    enteringClass: 'simpleform-rotateInDownRight',
    leavingClass: 'simpleform-bounceOutDown',
    totalErrorsEnteringClass: 'simpleform-bounce',
    totalErrorsLeavingClass: 'simpleform-fadeOut',

    noscriptText: 'Please enable javascript in order to use this form.',
    totalErrorsText: c => `There ${c > 1 ?`are ${c} errors`:'is one error'} in the form`,
  };

function animate( duration = 1000 ) {
  return {
    WebkitAnimationDuration: `${duration / 1000}s`,
    animationDuration: `${duration / 1000}s`,
    WebkitAnimationFillMode: 'both',
    animationFillMode: 'both',
  };
}

class SimpleForm extends Component {

  state = {
    values: {},
    errors: {},
    messages: {},
    warnings: {},
    touched: {},
    showErrors: true,
  };

  handleBlur({ target: { id } }) {
    if (this.state.errors[id] === true || this.state.errors[id] === false)
      this.setState(update(this.state, this.touch({}, id)));
  }

  handleChange({ target }) {
    let { id, value, type } = target;
    if (type === 'number' && +value < 0) return;
    const field = this.getField(id);
    if (typeof field.onChange === 'function'){
      value = field.onChange(value, this.state.values[id]);
    }
    this.setState(update(this.state, this.validate(field, value)));
  }

  handleSubmit(ev) {
    ev.preventDefault();
    let ids = this.filterProps(), errorCount = 0;
    const validateAll = () => {
      if (ids.length === 0) {
        this.setState({ showErrors: true });
        if (errorCount) {
        }
        else
          this.props.onSubmit(this.state.values);
        return;
      }
      const id = ids.pop();
      const newState = this.touch(this.validate(this.getField(id), this.state.values[id]), id);
      if (newState.errors[id].$set) errorCount++;
      this.setState(update(this.state, newState), validateAll);
    };
    this.setState({ showErrors: false }, validateAll);
  }

  touch(state, field) {
    state.touched = { [field]: { $set: true } };
    return state;
  }

  parseVal(val) {
    const found = val.match(/(\*)?([^\|\\]+)?(?:\|([^\|]*)\|?)?(.*)/i);
    return {
      required: found[1] || false,
      type: found[2] || false,
      placeholder: found[3] || '',
      regex: found[4] || false,
    };
  }

  filterProps() {
    return this.props.schema
      ? Object.keys(this.props.schema)
      : Object.keys(this.props).filter(field => !propTypes.hasOwnProperty(field));
  }

  getField(id) {
    let val = this.props.schema?this.props.schema[id]:this.props[id];
    return (typeof val === 'string') ? { id, ...this.parseVal(val) } : { id, ...val };
  }

  validate(field, value) {
    const { id, required, type, validate: validateFunc, error: errorMsg } = field;
    let error = (required && !value) ? this.props.requiredFieldText : false;
    let warning = !value /*&& type[0]!='['*/? this.props.emptyFieldText : false;
    if (type === 'email' && !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value))
      warning = this.props.dodgyEmailText;
    if (typeof validateFunc === 'function' && !validateFunc(value))
      error = errorMsg || 'This field is invalid';
    return {
      values: { [id]: { $set: value } },
      errors: { [id]: { $set: !!error } },
      warnings: { [id]: { $set: !!warning } },
      messages: { [id]: { $set: error || warning || this.state.messages[id] } },
    };
  }

  renderInput({ id, type, placeholder, autoComplete }, ctrlClass) {
    if (type === 'date')
      return (
        <input
          onChange={ ::this.handleChange }
          onBlur={ ::this.handleBlur }
          value={ this.state.values[id]||'' }
          type="date"
          className={ `form-control${ctrlClass}` }
          id={ id }
          style={ { minHeight: '2.375rem' } }
          placeholder="dd/mm/yyyy"
          autoComplete={ autoComplete }
        />
    );
    return (
      <input
        onChange={ ::this.handleChange }
        onBlur={ ::this.handleBlur }
        value={ this.state.values[id]||'' }
        type={ type || 'text' }
        className={ `form-control${ctrlClass}` }
        id={ id }
        placeholder={ placeholder }
        autoComplete={ autoComplete }
      />
    );
  }

  handleOptionChange(id, option) {
    return () => {
      const value = (this.state.values[id] === option) ? false : option;
      this.setState(update(this.state, this.touch(this.validate(this.getField(id), value), id)));
    };
  }

  renderOptions(id, options) {
    options = options.slice(1, -1).split(',');
    return options.map(option => (
      <label key={ option } className="form-check-inline form-control-static">
        <input
          className="form-check-input"
          type="checkbox"
          checked={ this.state.values[id] === option }
          onChange={ this.handleOptionChange(id, option) }
          name={ id }
          value={ option }
        /> {option}
      </label>
    ));
  }

  renderField(field, ctrlClass)
  {
    if (/^\d+$/.test(field.type)) return (
      <textarea
        onChange={ ::this.handleChange }
        onBlur={ ::this.handleBlur }
        value={ this.state.values[field.id]||'' }
        rows={ field.type }
        className={ `form-control${ctrlClass}` }
        id={ field.id }
        placeholder={ field.placeholder }
      />
    );
    switch (field.type) {
      case '$':
      case '£': return (
                  <div className="input-group">
                    <span className="input-group-addon">{field.type}</span>
                    {this.renderInput({ ...field, type: 'number' }, ctrlClass)}
                    <span className="input-group-addon">.00</span>
                  </div>
                );
      default: return this.renderInput(field, ctrlClass);
    }
  }

  render() {
    const { state: { errors, warnings, touched, messages } } = this;
    const fieldIds = this.filterProps();
    let atLeastOneMandatoryField = false, errorCounter = 0;
    return (
    <form onSubmit={ ::this.handleSubmit } className="m-x-1 text-xs-left" style={{overflow: 'hidden'}}>
      <noscript>{this.props.noscriptText}</noscript>
      {fieldIds.map(fieldId => {
        let field = this.getField(fieldId);
        let { required, type, hint, placeholder, label } = field;
        if ( typeof label === 'undefined') label = fieldId.replace(/\-/g, ' ');
        if (required) atLeastOneMandatoryField = true;
        let hasClass = '', ctrlClass='', msg = false;
        if (touched[fieldId]) {
          if (errors[fieldId]) errorCounter++;
          ctrlClass = errors[fieldId]?'danger':(warnings[fieldId]?'warning':'success');
          hasClass += ' has-' + ctrlClass;
          ctrlClass = ' form-control-' + ctrlClass;
          msg = errors[fieldId] || warnings[fieldId] || false;
        }
        const isCheck = (type && type[0] == '[');
        return (
          <div className={ `form-group row${hasClass}` } key={ fieldId }>
            <label htmlFor={ isCheck ? void 0 : fieldId } className={ `col-xs-12 text-sm-right col-form-label ${this.props.leftClass}` }>{(required?'*':'')+label}</label>
            <div className={ `col-xs-12 ${this.props.centralClass}${hasClass}${isCheck?' checkbox':''}` }>
              {isCheck ? this.renderOptions(fieldId, type) : this.renderField(field, ctrlClass)}
              {do {
                if (hint)
                  <small className="form-text text-muted">{hint}</small>;
                else if (type==='date')
                  <small className="form-text text-muted">{placeholder}</small>;
              }}
            </div>
            <Transition
              style={ animate(this.props.animationDuration) }
              in={ !!msg }
              timeout={ this.props.animationDuration }
              enteringClassName={ this.props.enteringClass }
              exitingClassName={ this.props.leavingClass }
              unmountOnExit
              transitionAppear
            >
              <div className={ `col-xs-12 ${this.props.rightClass}` }>
                <div className="form-control-static text-muted">
                  {messages[fieldId]}
                </div>
              </div>
            </Transition>
          </div>
        );
      })}
      <div className={ 'form-group row'+(errorCounter?' has-danger':'') }>
        <div className={ `col-xs-12 ${this.props.leftClass}` }>
          {do{
            if (atLeastOneMandatoryField) {
              <small className="form-text text-muted text-sm-right form-control-static">*{this.props.mandatoryFieldText}</small>;
            }
          }}
        </div>
        <div className={ 'col-xs-12 form-inline col-sm-8' }>
          <div className="form-group has-danger">
          <button type="submit" className="btn btn-outline-primary">{this.props.submitText}</button>
          <div className="text-muted form-control-static">&nbsp;&nbsp; </div>
          <Transition
            style={ animate(this.props.totalErrorsAnimationDuration) }
            timeout={ this.props.totalErrorsAnimationDuration }
            in={ this.state.showErrors && (errorCounter>0) }
            enteringClassName={ this.props.totalErrorsEnteringClass }
            exitingClassName={ this.props.totalErrorsLeavingClass }
            unmountOnExit
            transitionAppear
          >
            <div className="text-muted form-control-static">{this.props.totalErrorsText(errorCounter)}</div>
          </Transition>
        </div>
        </div>
      </div>
    </form>
  );
  }
}

SimpleForm.propTypes = propTypes;
SimpleForm.defaultProps = defaultProps;
export default SimpleForm;
