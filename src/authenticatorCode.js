const jsSHA = require('./SHA');

function getCode(existingMFAKey, fetchForTime) {
    let key = base32tohex(existingMFAKey)
    let epoch = Math.round(fetchForTime / 1000.0)
    let time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0")
    let shaObj = new jsSHA("SHA-1", "HEX")

    shaObj.setHMACKey(key, "HEX");
    shaObj.update(time)

    let hmac = shaObj.getHMAC("HEX")
    let offset = hex2dec(hmac.substring(hmac.length - 1))
    let otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + ""

    otp = otp.substr(otp.length - 6, 6);

    return otp;
}

function base32tohex(existingMFAKey) {
    let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let bits = ""
    let hex = ""

    for (let i = 0; i < existingMFAKey.length; i++) {
        let val = base32chars.indexOf(existingMFAKey.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, "0");
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        let chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
    }

    return hex;
}

function dec2hex(s) {
    return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function hex2dec(s) {
    return parseInt(s, 16);
}

function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
    }
    
    return str;
}

module.exports = getCode