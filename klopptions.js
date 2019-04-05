/*
   Copyright 2019 Locomote.sh

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Parse command line arguments and return an object containing resolved
 * names and values.
 * @param setup Function configuration options; any or all of the following:
 *              - args          A list of arguments; defaults to process.argv.slice( 2 ).
 *              - flags         A map of flags to option names.
 *              - switches      A map of switch names to values.
 *              - positional    A list of positional argument names.
 *              - values        An optional map of default value names.
 */
function klopptions( setup = {} ) { 

    const {
        argv,       // Allow argv to be used as a synonym for args.
        offset      = 2,
        args        = argv || process.argv.slice( offset ),
        flags       = {},
        switches    = {},
        positional  = ['...args'],
        values      = {}
    } = setup;

    let opt = false;

    args.forEach( arg => {

        if( opt ) {
            // Argument following an option flag.
            values[opt] = arg;
            opt = false;
        }
        else if( arg.startsWith('--') ) {
            // Full option name specified.
            // e.g. --teamName
            opt = arg.substring( 2 );
        }
        else if( arg.startsWith('-') ) {
            // Abbreviated option flag.
            // e.g. -t liverpool
            // Full option name should appear in flags.
            opt = flags[arg];
            if( !opt ) {
                throw new Error('Unrecognized flag:'+arg );
            }
        }
        else if( positional.length > 0 ) {
            let name = positional.shift();
            // Allow varargs to be specified using an argument
            // name prefixed with ...;
            if( name.startsWith('...') ) {
                // Return name to args list.
                positional.unshift( name );
                // Extract value name.
                name = name.substring( 3 );
                // Add value to list.
                let value = values[name];
                if( !Array.isArray( value ) ) {
                    values[name] = value = [];
                }
                value.push( arg );
            }
            else values[name] = arg;
        }
        else throw new Error('Unexpected argument: ', arg );

        // Check for a switch option. Switches are standalone flags
        // which don't have a follow-on argument value; instead, they
        // define a set of values to apply to the result.
        if( opt ) {
            const overlay = switches[opt];
            if( overlay ) {
                Object.assign( values, overlay );
                opt = false;
            }
        }
    });

    // Check there are no unhandled options.
    if( opt ) {
        throw new Error('Missing option value: ', opt );
    }

    return values;
}

module.exports = klopptions;

if( require.main === module ) {
    console.log('%j', klopptions() );
}
