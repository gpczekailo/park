
/**
 * Generic handler fetch errors
 * @param {string} url The fetch url
 * @param {object} opts Additional fetch options
 */
export async function fetchAPI(url, opts = {}){
    return new Promise((resolve, reject) => {
        const language = localStorage.getItem("i18nextLng") ? localStorage.getItem("i18nextLng") : navigator.language;
        if (isString(url) === false) reject('no url was provided for fetching')
        const disableRedirect = opts.disableUnauthorizedRedirection === true;
        const options = {
            method: isString(opts.method) === true ? opts.method : 'GET',
            headers: Object.assign({'Content-Type': opts.contentType ? opts.contentType : 'application/json', 'Accept-Language' : `${language}`}, opts.headers),
            body: isObject(opts.body) === true ? JSON.stringify(opts.body) : opts.body
        }
        opts.isFormData === true && delete options.headers['Content-Type'];
        fetch(url, options)
        .then(async (response) => {
            // response code 412 is being used to highlight specific errors in the UI
            if (response.status===200 || response.status===202 || response.status===412) {
                resolve(response);
            } else {
                reject(await handleFetchError(response, disableRedirect))
            }
        })
        .catch(error => {
            console.log(error)
            reject((error && error.message) || 'Error loading data')
        })
    })
}

/**
 * Check if the given variable is a string.
 * @param {any} v - The variable to check if it is a string.
 * @returns {boolean} - True if the type of the variable is a string.
 */
export function isString (v) {
    return varType(v) === VarType.string;
}

/**
 * Check if the given variable is an object.
 * @param {any} v - The variable to check if it is an object.
 * @returns {boolean} - True if the type of the variable is an object.
 */
export function isObject (v) {
    return varType(v) === VarType.object;
}

/**
 * Generic handler fetch errors
 * @param {} response The fetch response object
 */
async function handleFetchError(response, disableRedirect){
    const data = await response.json();
    let error = (data && data.message) || 'Error loading data';

    if(response.status===401){
        if (!response.url.match("auth/login") && disableRedirect === false) {
            setTimeout(() => {
                window.location = `${window.location.origin}`;
            }, 1000);
        }
        error = (data && data.message) || 'Not authorized';
    }else if(response.status===404){
        error = (data && data.message) || 'Not found';
    }
    return error;
}

/**
 * Returns the readable type of a variable.
 * @param {any} v - The variable from which to get the type.
 * @returns {VarType} - The type of the variable.
 */
function varType (v) {
    return TYPES[Object.prototype.toString.call(v)];
}

/**
 * Holds the readable value of possible variable types.
 */
const VarType = Object.freeze({
    number: 'number',
    boolean: 'boolean',
    string: 'string',
    undefined: 'undefined',
    null: 'null',
    function: 'function',
    array: 'array',
    object: 'object',
    date: 'date',
    regexp: 'regexp',
    buffer: 'buffer'
});

/**
 * Holds the javascript representation of possible variable types.
 */
const TYPES = Object.freeze({
    '[object Number]': VarType.number,
    '[object Boolean]': VarType.boolean,
    '[object String]': VarType.string,
    '[object Undefined]': VarType.undefined,
    '[object Null]': VarType.null,
    '[object Function]': VarType.function,
    '[object Array]': VarType.array,
    '[object Object]': VarType.object,
    '[object Date]': VarType.date,
    '[object RegExp]': VarType.regexp,
    '[object Uint8Array]': VarType.buffer
});
