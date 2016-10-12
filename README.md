# SimpleForm React Component

Quickly create simple React forms styled with Bootstrap 4.

## Live Examples 

Two examples are available: 

1. [Contact Form](https://www.solarleague.org/about/contact/)
2. [Volunteer Form](https://www.solarleague.org/about/volunteering/)

## Introduction

`SimpleForm` is intended to be a basic building block of reasonably simple React forms. Currently it is styled for Bootstrap 4 but in theory it can be used with any CSS framework. The idea is to be able to create and process (via RESTful APIs) simple React forms very quickly and efficiently. Having said that, you might want to use more higher level components such as [React Checkout](https://www.npmjs.com/package/react-checkout) instead of using `SimpleForm` directly.

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
  Some-Field
  Name
  Phone
  onSubmit={ form => { console.log(form); } }  
/>
```

They should magically turn into corresponding fields in the form. If you press submit the contents of the form should be dumped to the browser console. As you can see each field name corresponds to the equivalent prop (dashes are removed in field names). Not bad for a single tag, eh?

What if you want to make some fields required? You can do so in several ways. For example, using the shorthand notation:

```javascript
<SimpleForm 
  Some-Field
  Name="*"
  Phone
  onSubmit={ form => { console.log(form); } }  
/>
```

Now the `Name` field is required. You can also do it using object notation:

```javascript
<SimpleForm 
  Some-Field
  Name={{ required: true }}
  Phone
  onSubmit={ form => { console.log(form); } }  
/>
```

There are many some other attributes we can set for a field:

```javascript
<SimpleForm 
  Some-Field
  Name={{ required: true }}
  Phone= {{
    required: true,
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+44 207 123 4567',
  }}
  onSubmit={ form => { console.log(form); } }  
/>
```

Although, it's very simple to use props to generate fields it's not something we always want. There is another way of specifying form fields:

```javascript
<SimpleForm 
  schema={{    
    Name: { required: true },
    Phone: {
      required: true,
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+44 207 123 4567',
    },
  }}
  onSubmit={ form => { console.log(form); } }  
/>
```

If the `schema` prop is set `SimpleForm` will use it instead  of magically turning props into form fields.

## Form Processing

`SimpleForm` exports React component called `RestForm` to help you feed form data into REST endpoints. `RestForm` is meant to be used inside Redux containers and doesn't maintain its internal state. On the other hand, `SimpleForm` is maintaining its internal state all by itself. However, higher level components such as `RestForm` should keep their state in the Redux store. This package exposes a single Redux reducer called `formReducer` to facilitate that. `Restform` is dependent upon the `fetch` function being available. Therefore, for older browsers you might want to polyfill it with the [whatwg-fetch](https://github.com/github/fetch).

```javascript
import { createStore, combineReducers } from 'redux';
import reducers from '<project-path>/reducers';
import { formReducer } from 'simpleform'; // <= you need this reducer if you're using redux
// Add the reducer to your store on the `simpleform` key
const store = createStore(
  combineReducers({
    ...reducers,
    simpleform: formReducer
  })
);
```

## Documentation

### SimpleForm Properties

- `onSubmit` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** onSubmit event handler. Upon callback it receives object containg all form data. **Required**.
- `submitText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed on the submit button. Defaults to "Submit". **Optional**.
- `schema` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** SimpleForm Schema. See examples above. **Optional**.
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

### SimpleForm Children

Children are **ignored**.

### RestForm Properties

- `endpoint` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** RESTful API endpoint that is responsible for processing the form data. **Required**.
- `schema` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** SimpleForm Schema. See examples above. **Required**.
- `setStatus` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** Function that should preserve the the component state (for example by keeping in Redux store). **Required**.
- `onResponseReceived` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** Async function that is responsible for processing server response. **Required**.
- `onFormWillFetch` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** Function that is called just before form will be uploaded. It gets one argument (form data object) and must return transformed form data object. **Optional**.
- `waitText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is being uploaded . Defaults to "Uploading form. Please wait ...". **Optional**.
- `errorText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form has encountered errors on upload. Defaults to "Houston, we have a problem!". **Optional**.
- `successText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is uploaded without any issues. Defaults to "Your form has been submitted successfully". **Optional**.
- `welcomeText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is initially displayed. Defaults to "Welcome, please fill in the form below:". **Optional**.
- `scrollOrigin` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** [react-scroll](https://github.com/fisshy/react-scroll) element name that should be somewhere near the form. Once the submission is in progress viewport will be scrolled there. Defaults to "content". **Optional**.

### RestForm Children

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
          schema={{    
            Name: { required: true },
            Phone: {
              required: true,
              label: 'Phone Number',
              type: 'tel',
              placeholder: '+44 207 123 4567',
            },
          }}
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
