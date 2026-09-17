---
title: Accessible Labels and Hints
description: Guidelines and examples for using default and custom accessible labels and hints with DLS components, ensuring best practices for screen reader compatibility and user experience.
---

# Accessible Labels for DLS Components

## Using Default vs Custom Labels in DLS Components

DLS components provide built-in accessible labels for many interactive elements. These defaults follow accessibility best practices and are recommended for standard use cases. You can also override them with custom labels for specific needs.

## Default Labels

- Most DLS components take a `label` prop, which will handle using the visible text as the accessible label.
- The `label` will come with DLS styles out of the box.
- If omitted, the label is hidden visually and from screen readers, which is not recommended. Users must provide a custom label for accessibility.

**Example (default label):**

```tsx
<Input id="name" label="Name" />
<Checkbox id="accept" label="Accept Terms" />
<Slider id="volume" label="Volume" />
```

## Custom Labels

### `aria-label`

- Use `aria-label` when you need to provide a label that is not visible on the screen, such as for icon-only buttons or when the visible text does not convey enough context.
- Not recommended for standard components where a visible label is available.

### `aria-labelledby`

- Use `aria-labelledby` to reference an existing element that contains the label text. This is useful when you have a separate heading or label element that should be associated with the component.
- This is often used for more complex components where the label is not directly part of the component's markup.
- Used when user doesn't want to use the built in DLS label provided via the `label` prop.
- Used when user wants to use a custom label in addition to the built-in DLS label.

### `labelOverrides` prop

- Use the `labelOverrides` prop to customize visible and screen reader label for components that support it, such as `Button`, `Pagination`, and `Accordion`.

**Example (custom label):**

```tsx
<Button
  isLoading={true}
  labelOverrides={{ loadingScreenReaderLabel: 'Submitting request' }}
>
  Submit
</Button>
```

```tsx
<ContinuousLinearTracker
  completionText="You've successfully earned back your miles!"
  labelOverrides={{
    getScreenReaderValueText: (currentValue) => `${currentValue} miles`,
    getScreenReaderLabel: (min, max) => `Miles from ${min} to ${max}`,
    getTrackerStartText: (min) => `${min} miles`,
    getTrackerEndText: (_, currentValue, max) =>
      `${currentValue} of ${max} miles`,
  }}
  max={1000}
  min={0}
  value={500}
/>
```

## Best Practices

- Prefer default labels for standard cases—they are tested and follow DLS accessibility guidelines.
- Use custom labels for unique scenarios or when more descriptive text is needed.
- Always test with screen readers to ensure the correct label is announced.

# Accessible Hint Text for DLS Components

DLS components provide built-in support for accessible hint text. By default, you can use the `hint` prop to supply helper or instructional text, which is automatically associated with the component for screen readers using `aria-describedby`.

## Default Hint Text

- Add a `hint` prop to your component to display helper text below the field.
- The hint is automatically linked for accessibility, so screen readers will announce it when the field is focused.
- No need to manually set `aria-describedby` if you use the default `hint` prop.
- The `hint` will come with DLS styles out of the box.
- The `isHintVisuallyHidden` prop can be used to visually hide the hint while keeping it accessible to screen readers. This is helpful for instances where we want to provide additional information to screen reader users.

**Example (default hint):**

```tsx
<Input id="email" label="Email Address" hint="Enter your email address" />
```

## Custom Hint Text

- If you need to provide custom hint text, you can use `aria-describedby` to associate additional elements.
- For advanced scenarios, combine the default hint with custom descriptions for more context.
- Use `aria-describedby` to link to multiple elements if needed.

**Example (custom hint):**

```tsx
<Input id="username" label="Username" hint="Choose a unique username" aria-describedby="username-hint custom-desc" />
<span id="custom-desc">Usernames must be at least 6 characters.</span>
```

## Best Practices

- Prefer the default `hint` prop for standard helper text—it is styled and accessible by default.
- Use custom hint text only when you need to provide extra context or multiple descriptions.
- Always check with screen readers to ensure hint text is announced as expected.
## Accessible Form

```tsx
import React from 'react';
import {
  FieldControl,
  Input,
  Button,
  ComponentLevelNotification,
  DatePicker,
  type FieldControlStatus,
} from '@americanexpress/dls-react';

export default function AccessibleForm() {
  const [status, setStatus] = React.useState<FieldControlStatus>('default');
  const [message, setMessage] = React.useState({
    name: '',
    email: '',
    birthday: '',
    form: '',
  });

  function validate(form: HTMLFormElement) {
    const formData = new FormData(form);
    console.log(formData.values());

    for (const [key, val] of formData) {
      console.log(key, val);
    }

    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const birthday = formData.get('birthday-date')?.toString().trim();
    let newMessage = { name: '', email: '', birthday: '', form: '' };
    if (!name) {
      setStatus('error');
      newMessage.name = 'Name is required.';
      newMessage.form = 'Name is required.';
      setMessage(newMessage);
      return false;
    }
    if (!email) {
      setStatus('error');
      newMessage.email = 'Email is required.';
      newMessage.form = 'Email is required.';
      setMessage(newMessage);
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      newMessage.email = 'Please enter a valid email address.';
      newMessage.form = 'Please enter a valid email address.';
      setMessage(newMessage);
      return false;
    }
    if (!birthday) {
      setStatus('error');
      newMessage.birthday = 'Birthday is required.';
      newMessage.form = 'Birthday is required.';
      setMessage(newMessage);
      return false;
    }
    setStatus('success');
    newMessage = {
      name: 'Looks good!',
      email: 'Looks good!',
      birthday: 'Looks good!',
      form: 'Form submitted successfully!',
    };
    setMessage(newMessage);
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    validate(e.currentTarget);
  }

  return (
    <form
      className="flex flex-column pad-responsive margin-responsive"
      style={{ maxWidth: 400 }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Input
        id="name"
        name="name"
        label="Name"
        hint="Enter your full name"
        required
        status={
          status === 'error' && !!message.name
            ? 'error'
            : status === 'success'
            ? 'success'
            : 'default'
        }
        statusMessage={message.name}
        className="margin-responsive-b"
      />
      <Input
        id="email"
        name="email"
        label="Email"
        hint="Enter a valid email address"
        type="email"
        required
        status={
          status === 'error' && !!message.email
            ? 'error'
            : status === 'success'
            ? 'success'
            : 'default'
        }
        statusMessage={message.email}
        className="margin-responsive-b"
      />
      <DatePicker
        id="birthday"
        name="birthday"
        label="Birthday"
        hint="Select your date of birth"
        required
        status={status === 'error' && !!message.birthday ? 'error' : 'default'}
        className="margin-responsive-b"
      />
      <ComponentLevelNotification
        status={status}
        show={!!message.form}
        showIcon
      >
        {message.form}
      </ComponentLevelNotification>
      <Button variant="primary" type="submit" className="margin-responsive-t">
        Submit
      </Button>
    </form>
  );
}
```

## Accessible Login Form (with validation)

```tsx
import React from 'react';
import { Input, Button, ComponentLevelNotification } from '@americanexpress/dls-react';

export function AccessibleLoginForm() {
  const [status, setStatus] = React.useState<'default' | 'error' | 'success'>('default');
  const [message, setMessage] = React.useState({ username: '', password: '', form: '' });

  function validate(form: HTMLFormElement) {
    const formData = new FormData(form);
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password')?.toString().trim();
    let newMessage = { username: '', password: '', form: '' };
    if (!username) {
      setStatus('error');
      newMessage.username = 'Username is required.';
      newMessage.form = 'Username is required.';
      setMessage(newMessage);
      return false;
    }
    if (!password) {
      setStatus('error');
      newMessage.password = 'Password is required.';
      newMessage.form = 'Password is required.';
      setMessage(newMessage);
      return false;
    }
    setStatus('success');
    newMessage = {
      username: 'Looks good!',
      password: 'Looks good!',
      form: 'Login successful!',
    };
    setMessage(newMessage);
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    validate(e.currentTarget);
  }

  return (
    <form className="flex flex-column pad-responsive margin-responsive" style={{ maxWidth: 400 }} onSubmit={handleSubmit} autoComplete="off">
      <Input
        id="username"
        name="username"
        label="Username"
        hint="Enter your username"
        required
        status={status === 'error' && !!message.username ? 'error' : status === 'success' ? 'success' : 'default'}
        statusMessage={message.username}
        className="margin-responsive-b"
      />
      <Input
        id="password"
        name="password"
        label="Password"
        hint="Enter your password"
        type="password"
        required
        status={status === 'error' && !!message.password ? 'error' : status === 'success' ? 'success' : 'default'}
        statusMessage={message.password}
        className="margin-responsive-b"
      />
      <ComponentLevelNotification status={status} show={!!message.form} showIcon>
        {message.form}
      </ComponentLevelNotification>
      <Button variant="primary" type="submit" className="margin-responsive-t">
        Login
      </Button>
    </form>
  );
}
```

## Accessible Search Form (with validation)

```tsx
import React from 'react';
import { Input, Button, ComponentLevelNotification } from '@americanexpress/dls-react';

export function AccessibleSearchForm() {
  const [status, setStatus] = React.useState<'default' | 'error' | 'success'>('default');
  const [message, setMessage] = React.useState({ query: '', form: '' });

  function validate(form: HTMLFormElement) {
    const formData = new FormData(form);
    const query = formData.get('query')?.toString().trim();
    let newMessage = { query: '', form: '' };
    if (!query) {
      setStatus('error');
      newMessage.query = 'Search query is required.';
      newMessage.form = 'Search query is required.';
      setMessage(newMessage);
      return false;
    }
    setStatus('success');
    newMessage = {
      query: 'Looks good!',
      form: 'Search submitted!',
    };
    setMessage(newMessage);
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    validate(e.currentTarget);
  }

  return (
    <form className="flex flex-column pad-responsive margin-responsive" style={{ maxWidth: 400 }} onSubmit={handleSubmit} autoComplete="off">
      <Input
        id="query"
        name="query"
        label="Search"
        hint="Enter your search term"
        required
        status={status === 'error' && !!message.query ? 'error' : status === 'success' ? 'success' : 'default'}
        statusMessage={message.query}
        className="margin-responsive-b"
      />
      <ComponentLevelNotification status={status} show={!!message.form} showIcon>
        {message.form}
      </ComponentLevelNotification>
      <Button variant="primary" type="submit" className="margin-responsive-t">
        Search
      </Button>
    </form>
  );
}
```

## Accessible Multi-Step Form (pattern)

```tsx
import React from 'react';
import { Input, Button, MultiStepTracker, ComponentLevelNotification } from '@americanexpress/dls-react';

export function AccessibleMultiStepForm() {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<'default' | 'error' | 'success'>('default');
  const [message, setMessage] = React.useState({ step1: '', step2: '', form: '' });

  function validateStep1(form: HTMLFormElement) {
    const formData = new FormData(form);
    const firstName = formData.get('firstName')?.toString().trim();
    let newMessage = { step1: '', step2: '', form: '' };
    if (!firstName) {
      setStatus('error');
      newMessage.step1 = 'First name is required.';
      newMessage.form = 'First name is required.';
      setMessage(newMessage);
      return false;
    }
    setStatus('success');
    newMessage = { step1: 'Looks good!', step2: '', form: '' };
    setMessage(newMessage);
    return true;
  }

  function validateStep2(form: HTMLFormElement) {
    const formData = new FormData(form);
    const lastName = formData.get('lastName')?.toString().trim();
    let newMessage = { step1: '', step2: '', form: '' };
    if (!lastName) {
      setStatus('error');
      newMessage.step2 = 'Last name is required.';
      newMessage.form = 'Last name is required.';
      setMessage(newMessage);
      return false;
    }
    setStatus('success');
    newMessage = { step1: '', step2: 'Looks good!', form: 'Form completed!' };
    setMessage(newMessage);
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (step === 0) {
      if (validateStep1(e.currentTarget)) setStep(1);
    } else if (step === 1) {
      validateStep2(e.currentTarget);
    }
  }

  return (
    <form className="flex flex-column pad-responsive margin-responsive" style={{ maxWidth: 400 }} onSubmit={handleSubmit} autoComplete="off">
      <MultiStepTracker steps={[{ label: 'Step 1' }, { label: 'Step 2' }]} currentStep={step} />
      {step === 0 && (
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          hint="Enter your first name"
          required
          status={status === 'error' && !!message.step1 ? 'error' : status === 'success' ? 'success' : 'default'}
          statusMessage={message.step1}
          className="margin-responsive-b"
        />
      )}
      {step === 1 && (
        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          hint="Enter your last name"
          required
          status={status === 'error' && !!message.step2 ? 'error' : status === 'success' ? 'success' : 'default'}
          statusMessage={message.step2}
          className="margin-responsive-b"
        />
      )}
      <ComponentLevelNotification status={status} show={!!message.form} showIcon>
        {message.form}
      </ComponentLevelNotification>
      <Button variant="primary" type="submit" className="margin-responsive-t">
        {step === 0 ? 'Next' : 'Submit'}
      </Button>
    </form>
  );
}
```