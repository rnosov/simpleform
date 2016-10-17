/*
 * SimpleForm React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { PropTypes, Component } from 'react';
import { List, Record } from 'immutable';
import Transition from 'react-overlays/lib/Transition';
import humanize from 'underscore.string/humanize';
import titleize from 'underscore.string/titleize';

const
  propTypes = {
    onSubmit: PropTypes.func,
    fields: PropTypes.oneOfType([PropTypes.object, PropTypes.array ]),
    className: PropTypes.string,
    leftClass: PropTypes.string,
    centralClass: PropTypes.string,
    rightClass: PropTypes.string,
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
    noscriptText: PropTypes.string,
    totalErrorsText: PropTypes.func,
    onParsingComplete: PropTypes.func,
    children: React.PropTypes.node,
  },
  defaultProps = {
    className: 'm-x-1 text-xs-left',
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
    onSubmit: form => { console.log(form); },
    totalErrorsText: c => `There ${c > 1 ?`are ${c} errors`:'is one error'} in the form`,
  };

class SimpleForm extends Component {

  constructor() {
    super();
    this.state = {};
    this.onSubmit = ::this.handleSubmit;
    this.onChange = ::this.handleChange;
    this.onBlur = ::this.handleBlur;
  }

  static animate( duration = 1000 ) {
    return {
      WebkitAnimationDuration: `${duration / 1000}s`,
      animationDuration: `${duration / 1000}s`,
      WebkitAnimationFillMode: 'both',
      animationFillMode: 'both',
    };
  }

  parseProps(props) {
    const fieldRecord = Record({
      id: '',
      key: '',
      name: '',
      required: false,
      type: 'text',
      placeholder: '',
      hint: '',
      label: '',
      options: false,
      autoComplete: false,
      onChange: false,
      validate: ::this.validate,
      value: '',
      message: false,
      error: false,
      warning: false,
      changed: false,
      touched: false,
    });
    let fields = [];
    if (props.fields) {
      if (Array.isArray(props.fields))
        fields = props.fields.map( field => typeof field === 'string' ? { typeStr: field } : field );
      else for (let prop in props.fields)
        if (props.fields.hasOwnProperty(prop))
          fields.push(  typeof props.fields[prop] === 'string'
                      ? { key: prop, typeStr: props.fields[prop] }
                      : { key: prop, ...props.fields[prop] }
          );
    }
    else for (let prop in props)
      if( !propTypes.hasOwnProperty(prop) && props.hasOwnProperty(prop) )
        fields.push(  typeof props[prop] === 'string'
                      ? { key: prop, typeStr: props[prop] }
                      : { key: prop, ...props[prop] }
        );
    fields = fields.map( (field, index) => new fieldRecord(
      { ...this.parseTypeStr(field.typeStr, field.key), ...field, id: index }
    ));
    fields = List(fields);
    if ( typeof this.props.onParsingComplete === 'function' )
      fields = this.props.onParsingComplete(fields);
    this.setState({ fields, showErrors: true });
  }

  parseTypeStr(typeStr, key = '') {
    let match = [], split = [];
    if ( typeStr && typeof typeStr === 'string' ) {
      split = typeStr.split('|');
      let split2 = split[0].split(/[:=]/, 2), matchkey = 0;
      if (split2.length > 1){
        key = split2[0];
        matchkey = 1;
      }
      match = split2[matchkey].match(/\s*([\*\?])?\s*(.*)/i);
    }
    let type = match[2] || 'text', options = false;
    if (type[0] == '[') {
      options = type.slice(1, -1).split(',');
      type = 'options';
    }
    else if (/^\d+$/.test(type)) {
      options = type;
      type = 'textarea';
    }
    //if (!label) label = name.toString().replace(/[-_]/g, ' ');
    return {
      name: key,
      required: match[1] === '*',
      type,
      options,
      placeholder: split[1] || '',
      hint: split[2],
      label: split[3] || titleize(humanize(key), false),
      value: split[4] || '',
    };
  }

  //componentWillReceiveProps(props) {
  //  this.parseProps(props);
  //}

  componentWillMount() {
    this.parseProps(this.props);
  }

  handleBlur({ target }) {
    const id = target.getAttribute('data-id'),
          { changed, touched } = this.state.fields.get(id);
    if (changed && !touched)
      this.setState({
        fields: this.state.fields.update(id, field => field.set('touched', true))
      });
  }

  handleChange({ target }) {
    const id = target.getAttribute('data-id');
    let { value, type } = target;
    if (type === 'number' && +value < 0) return;
    this.setState( ({ fields }) => ({
      fields: fields.update(id, field => {
        if (typeof field.onChange === 'function')
          value = field.onChange(value, field.value);
        if (field.type === 'options')
          value = field.value === value ? false : value;
        if (!field.changed)
          field = field.set('changed', true);
        return field.validate(field.set('value', value));
      })})
    );
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const fields = this.state.fields.map( field => this.validate(field.set('touched', true)) );
    if(!fields.reduce( (r, { error } ) => error ? r + 1 : r, 0)) //count errors
      this.props.onSubmit(fields.map( ({ name, value }) => [name, value] ).fromEntrySeq().toJS());
    this.setState({ showErrors: false }, () => // the idea here is to make the total error
      setTimeout( () =>                        // count jump when user press Submit
        this.setState({ ...this.state, fields, showErrors: true }),
        this.props.totalErrorsAnimationDuration
      )
    );
  }

  validate(field) {
    const
      { value, required, type } = field,
      error = !(!required || value) && this.props.requiredFieldText,
      warning = false
      || !value && !(field.type === 'options' && field.options.length === 1 ) && this.props.emptyFieldText
      || type === 'email' && !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) && this.props.dodgyEmailText;
    return field
    .set('error', !!error)
    .set('warning', !!warning)
    .set('message', error || warning || field.message);
  }

  renderOptions(field, props) {
    return field.options.map(option => (
      <label key={option} className="form-check-inline form-control-static">
        <input
          {...props}
          className="form-check-input"
          type="checkbox"
          checked={ this.state.fields.get(field.id).value === option }
          value={option}
        />
        {option}
      </label>
    ));
  }

  inputGroup(symbol, children) {
    return (
      <div className="input-group">
        <span className="input-group-addon">{symbol}</span>
          {children}
        <span className="input-group-addon">.00</span>
      </div>
    );
  }

  renderField(field, ctrlClass) {
    let props = {
      className: `form-control${ctrlClass}`,
      onChange: this.onChange,
      onBlur: this.onBlur,
      value: field.value,
      'data-id': field.id,
    };
    if (field.autoComplete)
      props.autoComplete = field.autoComplete;
    switch (field.type) {
      case '$':
      case '£': return this.inputGroup(field.type, <input {...props} type="number" placeholder={field.placeholder} />);
      case 'textarea': return <textarea {...props} rows={field.options} placeholder={field.placeholder} />;
      case 'date': return <input {...props} type="date" style={{ minHeight: '2.375rem' }} placeholder="dd/mm/yyyy" />;
      case 'options': return this.renderOptions(field, props);
      default: return <input {...props} type={field.type} placeholder={field.placeholder} />;
    }
  }

  formRow(field) {
    let { label, hint, type, error, warning, touched, name } = field;
    let hasClass = '', ctrlClass='', hasMessage = false;
    if (touched) {
      ctrlClass = error ? 'danger' : ( warning ? 'warning' : 'success' );
      hasClass += ' has-' + ctrlClass;
      ctrlClass = ' form-control-' + ctrlClass;
      hasMessage = error || warning;
    }
    return (
      <div className={ `form-group row${hasClass}` } key={field.id}>
        <label className={ `col-xs-12 text-sm-right col-form-label ${this.props.leftClass}` }>{(field.required?'*':'')+label}</label>
        <div className={ `col-xs-12 ${this.props.centralClass}${hasClass}${ field.type === 'options' ? ' checkbox' : '' }` }>
          {this.renderField(field, ctrlClass)}
          {do {
            if (hint)
              <small className="form-text text-muted">{hint}</small>;
            //else if ( type === 'date' )
            //  <small className="form-text text-muted">{placeholder}</small>;
          }}
        </div>
        <Transition
          style={SimpleForm.animate(this.props.animationDuration)}
          in={!!hasMessage}
          timeout={this.props.animationDuration}
          enteringClassName={this.props.enteringClass}
          exitingClassName={this.props.leavingClass}
          unmountOnExit
          transitionAppear
        >
          <div className={ `col-xs-12 ${this.props.rightClass}` }>
            <div className="form-control-static text-muted">
              {field.message}
            </div>
          </div>
        </Transition>
      </div>
    );
  }

  footer() {
    let atLeastOneMandatoryField = false;
    let errorCounter = this.state.fields.reduce( (r, { error, required, touched } ) => {
      if (required && !atLeastOneMandatoryField)
        atLeastOneMandatoryField = true;
      return error&&touched ? r + 1 : r
    }, 0);
    return(
      <div className={ 'form-group row'+(errorCounter?' has-danger':'') }>
        <div className={ `col-xs-12 ${this.props.leftClass}` }>
          {do{
            if (atLeastOneMandatoryField) {
              <small className="form-text text-muted text-sm-right form-control-static">
                *{this.props.mandatoryFieldText}
              </small>;
            }
          }}
        </div>
        <div className={ 'col-xs-12 form-inline col-sm-8' }>
          <div className="form-group has-danger">
            <button type="submit" className="btn btn-outline-primary">
              {this.props.submitText}
            </button>
            <div className="text-muted form-control-static">&nbsp;&nbsp; </div>
            <Transition
              style={SimpleForm.animate(this.props.totalErrorsAnimationDuration)}
              timeout={this.props.totalErrorsAnimationDuration}
              in={this.state.showErrors && (errorCounter>0)}
              enteringClassName={this.props.totalErrorsEnteringClass}
              exitingClassName={this.props.totalErrorsLeavingClass}
              unmountOnExit
              transitionAppear
            >
              <div className="text-muted form-control-static">
                {this.props.totalErrorsText(errorCounter)}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <form
        noValidate
        onSubmit={this.onSubmit}
        className={this.props.className}
        style={{overflow: 'hidden'}}
      >
        <noscript>{this.props.noscriptText}</noscript>
        {this.state.fields.map( field => this.formRow(field) )}
        {this.footer()}
      </form>
    );
  }

}

SimpleForm.propTypes = propTypes;
SimpleForm.defaultProps = defaultProps;
export default SimpleForm;
