# SimpleForm React Component

Quickly create simple React forms styled for Bootstrap 4.

## Live Examples 

Two examples are available: 

1. [Contact Form](https://www.solarleague.org/about/contact/)
2. [Volunteer Form](https://www.solarleague.org/about/volunteering/)

## Introduction

`SimpleForm` is intended to be a basic building block of reasonably simple React forms. Currently it is styled for Bootstrap 4. The idea is to be able to create simple React forms very quickly and efficiently. Having said that, you might want to use higher level components such as [React Checkout](https://www.npmjs.com/package/react-checkout) instead of using `SimpleForm` directly.

To install the package run the following command in the command prompt:

```sh
npm install simpleform bootstrap@4.0.0-alpha.4 --save

```

Import `SimpleForm` in the component where you want to use it like so:

```javascript
import 'bootstrap/dist/css/bootstrap.css'; //import Bootstrap if you haven't done it already
import SimpleForm from 'simpleform'; 
```

Now you're ready to use it inside your render method. SimpleForm at its core has only one required prop called `onSubmit`:

```javascript
<SimpleForm onSubmit={ form => { console.log(form); } }  />
```

You should see a Submit button. Now let's try something more complicated. Add any props you like to the `SimpleForm`:

```javascript
<SimpleForm 
  Some_Field
  Name
  Phone
  onSubmit={ form => { console.log(form); } }  
/>
```

They should magically turn into corresponding fields in the form. If you press submit the contents of the form should be dumped to the browser console. As you can see each field name corresponds to the equivalent prop (dashes are removed in field names). 

What if you want to make some fields required? You can do so in several ways. For example, using the shorthand notation:

```javascript
<SimpleForm 
  Some_Field
  Name="*"
  Phone
  onSubmit={ form => { console.log(form); } }  
/>
```


There are many some other attributes we can set for a field:

```javascript
<SimpleForm 
  Name
  Phone="*tel|+44 207 123 4567|Enter your phone number|Phone Number"
  onSubmit={ form => { console.log(form); } }  
/>
```

Although, it's very simple to use props to generate fields it's not something we always want. There is another way of specifying form fields:

```javascript
<SimpleForm 
  fields={{    
    Name: '',
    Phone: "*tel|+44 207 123 4567|Enter your phone number|Phone Number",
  }}
  onSubmit={ form => { console.log(form); } }  
/>
```

If the `fields` prop is set `SimpleForm` will use it instead  of magically turning props into form fields.

## Documentation

### Type Strings

This is a key `SimpleForm` concept. Type String is a shorthand notation to describe form field that can fit into a regular string. For example:

```javascript
  "Name: *type|Placeholder|Hint|Label|Value"
```

It would create a form field which is named `Name`, because of `*` it will be required, its HTML5 type will be set to `type` the field placeholder will be set to `Placeholder`, hint text set to `Hint`, field label set to `Label` and the default value will be `Value`.

All parts are optional. Empty string or boolean values are therefore valid type string. If the name is not set then the associated prop or object key would be used instead. You must set the name if you're using array to set the type strings.

### SimpleForm Properties

- `onSubmit` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** onSubmit event handler. Upon callback it receives object containg all form data. **Required**.
- `fields` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** `SimpleForm` fields. It could be either Array containing `Type Strings` or object with keys corresponding to `Type Strings`. See examples above. **Optional**.
- `className` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** `Simpleform` outer CSS class. Defaults to "m-x-1 text-xs-left". **Optional**.
- `submitText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed on the submit button. Defaults to "Submit". **Optional**.
- `leftClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Left column CSS class. Defaults to "col-sm-2". **Optional**.
- `centralClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Central column CSS class. Defaults to "col-sm-5". **Optional**.
- `rightClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Right column CSS class. Defaults to "col-sm-4". **Optional**.
- `requiredFieldText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when field is required. Defaults to "Required field". **Optional**.
- `emptyFieldText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when the field is empty. Defaults to "Empty field". **Optional**.
- `dodgyEmailText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when the email looks dodgy. Defaults to "It doesn't look like an email". **Optional**.
- `mandatoryFieldText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when there is at least one required field. Defaults to "Mandatory fields". **Optional**.
- `enteringClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Animation class used when the field error or warning message is being shown. Defaults to "simpleform-rotateInDownRight". **Optional**.
- `leavingClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Animation class used when the field error or warning message is being hidden. Defaults to "simpleform-bounceOutDown". **Optional**.
- `totalErrorsEnteringClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Animation class used when the total error count is being shown. Defaults to "simpleform-bounce". **Optional**.
- `totalErrorsLeavingClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Animation class used when the total error count is being hidden. Defaults to "simpleform-fadeOut". **Optional**.
- `noscriptText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when javascript is disabled. Defaults to "Please enable javascript in order to use this form.". **Optional**.
- `animationDuration` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Field error or warning animation duration. **Optional**.
- `totalErrorsAnimationDuration` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Total error count animation duration. **Optional**.
- `totalErrorsText` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** Function returning total error count. **Optional**.
- `onParsingComplete` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** Callback called with the list of all parsed fields. Must return list of fields. Useful if you want to modify default parsing output. **Optional**.

### SimpleForm Children

Children are **ignored**.
### Universal Rendering

This package is compatible with universal or server side rendering (SSR).

## Step by Step Instructions

In order to start from scratch we'll use Facebook react starter kit called [Create React App](https://github.com/facebookincubator/create-react-app). In the command prompt type:


```sh
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm install simpleform bootstrap@4.0.0-alpha.4 --save
subl src/App.js #open with Sublime Text. Or use any other text editor.
npm start

```

Copy and paste the following code into app.js:

```javascript
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; 
import SimpleForm from 'simpleform'; 
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">    
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <SimpleForm 
          Name
          Phone="*tel|+44 207 123 4567|Enter your phone number|Phone Number"             
          onSubmit={ form => { console.log(form); } }  
        />
      </div>
    );
  }
}

export default App;
```

Save it, then open [http://localhost:3000/](http://localhost:3000/) to see the result.

## Forking This Package

Clone the this repository using the following command:

```sh
git clone https://github.com/rnosov/simpleform.git
```

In the cloned directory, you can run following commands:

### `npm install`

Installs required node modules

### `npm run build`

Builds the package for production to the `dist` folder

### `npm test`

Runs tests

## License

Copyright © 2016 Roman Nosov. This source code is licensed under the MIT license.
