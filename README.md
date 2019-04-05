# klopptions
A simple, module for flexible command line option parsing.

## Installation

Install using npm:

```
npm install "@locomote.sh/klopptions"
```

## Basic usage

The most basic example using default options will read all command line arguments into a var named `args`:

```
    const klopptions = require('@locomote.sh/klopptions');

    const { args } = klopptions();
```

Specifically, what _klopptions_ is doing here is discarding the first two items in `process.argv` and reading whats left into a var named `args`.

## Terminology and argument types

_klopptions_ uses the following terminology and supports the following command line argument types:

* A _flag_ is any argument starting with one or two hyphens;
* An _option_ is a named value returned after parsing;
* Options can be specified directly on the command line by prefixing the option name wih two hyphes `--`, and following the name with a value; (unless its a switch, see below);
* Short flags are usually single characters with a hyphen prefix, and are used as short forms of full option names. When used, flags must be mapped to option names in the _klopptions_ setup configuration (see below).
* Options can also be defined as switches. Switches don't require a value following the flag on the comamnd line; instead, the switch value is provided in the setup configuration (see below).
* _Positional arguments_ are non-flag arguments which are assigned a name based on their position in the argument list.
* _Varargs_ are positional arguments that appear last and which are allocated all trailing values from the argument list.

## Setup configuration

The `klopptions()` function can be configured by passing a setup object as its sole argument.
The setup object takes the following properties:

* `args`: The arguments to be processed. Defaults to `process.argv`.
* `argv`: A synonym for `args`.
* `offset`: The offset into the argument list to start processing from. Defaults to 2 (i.e. assumes the leading arguments are `node <script name>`).
* `flags`: An object mapping flag names to option names (see _Flags_ below).
* `switches`: An object mapping option names to values (see _Switches_ below).
* `positional`: A list of positional argument names (see _Positionals_ below).
* `values`: A set of default option values (see _Options_ below).

## Options

Options are what _klopptions_ reads from the command line and returns as a map of option names to value.
When using _klopptions_ in its default setup, options can be specified on the command line using double hyphens, e.g. the command line:

```
    node klopptions --color red --size large
```

Would return the values:
```json
    { "color": "red", "size": "large" }
```

## Flags

Flags are basically short-hand for options, and are typically defined as a single character prefixed with a hyphen.
Flags are defined using the `flags` setup option, by mapping the flag symbol to its corresponding option name.
So for example, the command line:

```
    node klopptions -c red -s large
```

Can be parsed using the following setup:

```js
    const flags = { '-c': 'red', '-s': 'size' };
    const { color, size } = klopptions({ flags });
    // color == 'red'
    // size == 'large'
```

## Switches

Switches are flags or options which don't require a value on the command line.
Instead, the option name is associated with one or more values in the `switches` setup option, and these values are copied into the result.
This makes switches quite powerful as they can be used to configure multiple values in the result.
For example, the command line:

```
    node klopptions -L
```

Can be parsed using the following setup:

```js
    const flags = { '-L', 'large' };
    const switches = { 'large': { size: 'large' } };
    const { size } = klopptions({ flags, switches });
    // size == 'large'
```

## Positionals

Positionals are arguments which are assigned a name based on their position on the command line, excluding any flags, switches or options and their associated values.
Positional names are supplied using the `positional` setup option.
For example, the command line:

```
    node klopptions red large
```

Can be parsed using the following setup:

```js
    const positionals = ['color','size'];
    const { color, size } = klopptions({ positionals });
    // color == 'red'
    // size == 'large'
```

Varargs which capture all trailing arguments can be defined using a positional name prefixed with `...`.
This should be the last name in the positional list:

```js
    const positionals = ['color','size','...players'];
    const { color, size, players } = klopptions({ positionals });

    // 'players' is an array of values:
    for( const player of players ) {
        ...
    }
```

