/*!
 * PasswordStrengthCalculator.js
 * based on http://www.passwordmeter.com/
 * Returns the strength of a password
 */
;(function() {
    String.prototype.strReverse = function() {
        var newstring = "";
        for (var s=0; s < this.length; s++) {
            newstring = this.charAt(s) + newstring;
        }
        return newstring;
        //strOrig = ' teststring ';
        //strReversed = strOrig.revstring();
        //output: gnirtstset
    };

    // Find nearest parrent with given selector
    var findParent = function (el, selector) {
        while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, selector)));
        return el;
    }

    var extend = function () {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    var defaults = {
        fieldParentSelector: '.form__entry',
        strengthElementClass: 'password-strength',
        tier : {
            "Too Short"   : "Too Short",
            "Very Weak"   : "Very Weak",
            "Weak"        : "Weak",
            "Good"        : "Ok",
            "Strong"      : "Strong",
            "Very Strong" : "Very Strong"
        }
    }

    function PasswordStrengthCalculator(password, options) {
        this.options = extend( {}, defaults, options );

        if ( options && options.tier ) {
            this.options.tier = extend( {}, defaults.tier, options.tier );
        }

        var strength = this.getStrength(password.value, options);
    }

    PasswordStrengthCalculator.prototype.getStrength = function (pwd, options) {
        var nScore=0, nLength=0, nAlphaUC=0, nAlphaLC=0, nNumber=0, nSymbol=0, nMidChar=0, nRequirements=0, nAlphasOnly=0, nNumbersOnly=0, nUnqChar=0, nRepChar=0, nRepInc=0, nConsecAlphaUC=0, nConsecAlphaLC=0, nConsecNumber=0, nConsecSymbol=0, nConsecCharType=0, nSeqAlpha=0, nSeqNumber=0, nSeqSymbol=0, nSeqChar=0, nReqChar=0, nMultConsecCharType=0;
        var nMultMidChar=2, nMultConsecAlphaUC=2, nMultConsecAlphaLC=2, nMultConsecNumber=2;
        var nMultSeqAlpha=3, nMultSeqNumber=3, nMultSeqSymbol=3;
        var nMultLength=4, nMultNumber=4;
        var nMultSymbol=6;
        var nTmpAlphaUC="", nTmpAlphaLC="", nTmpNumber="", nTmpSymbol="";
        var sAlphaUC="0", sAlphaLC="0", sNumber="0", sSymbol="0", sMidChar="0", sRequirements="0", sAlphasOnly="0", sNumbersOnly="0", sRepChar="0", sConsecAlphaUC="0", sConsecAlphaLC="0", sConsecNumber="0", sSeqAlpha="0", sSeqNumber="0", sSeqSymbol="0";
        var sAlphas = "abcdefghijklmnopqrstuvwxyz";
        var sNumerics = "01234567890";
        var sSymbols = ")!@#$%^&*()";
        var nMinPwdLen = 6;

        nScore = parseInt(pwd.length * nMultLength);
        nLength = pwd.length;

        var arrPwd = pwd.replace(/\s+/g,"").split(/\s*/);
        var arrPwdLen = arrPwd.length;

        /* Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches */
        for (var a=0; a < arrPwdLen; a++) {
            if (arrPwd[a].match(/[A-Z]/g)) {
                if (nTmpAlphaUC !== "") {
                    if ((nTmpAlphaUC + 1) == a) {
                        nConsecAlphaUC++; nConsecCharType++;
                    }
                }
                nTmpAlphaUC = a;
                nAlphaUC++;
            } else if (arrPwd[a].match(/[a-z]/g)) {
                if (nTmpAlphaLC !== "") {
                    if ((nTmpAlphaLC + 1) == a) {
                        nConsecAlphaLC++; nConsecCharType++;
                    }
                }
                nTmpAlphaLC = a;
                nAlphaLC++;
            } else if (arrPwd[a].match(/[0-9]/g)) {
                if (a > 0 && a < (arrPwdLen - 1)) {
                    nMidChar++;
                }
                if (nTmpNumber !== "") {
                    if ((nTmpNumber + 1) == a) {
                        nConsecNumber++; nConsecCharType++;
                    }
                }
                nTmpNumber = a;
                nNumber++;
            } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
                if (a > 0 && a < (arrPwdLen - 1)) {
                     nMidChar++;
                }
                if (nTmpSymbol !== "") {
                    if ((nTmpSymbol + 1) == a) {
                        nConsecSymbol++; nConsecCharType++;
                    }
                }
                nTmpSymbol = a;
                nSymbol++;
            }

            /* Internal loop through password to check for repeat characters */
            var bCharExists = false;
            for (var b=0; b < arrPwdLen; b++) {
                if (arrPwd[a] == arrPwd[b] && a != b) { /* repeat character exists */
                    bCharExists = true;
                    /*
                    Calculate icrement deduction based on proximity to identical characters
                    Deduction is incremented each time a new match is discovered
                    Deduction amount is based on total password length divided by the
                    difference of distance between currently selected match
                    */
                    nRepInc += Math.abs(arrPwdLen/(b-a));
                }
            }

            if (bCharExists) {
                nRepChar++;
                nUnqChar = arrPwdLen-nRepChar;
                nRepInc = (nUnqChar) ? Math.ceil(nRepInc/nUnqChar) : Math.ceil(nRepInc);
            }
        }

        /* Check for sequential alpha string patterns (forward and reverse) */
        for (var s=0; s < 23; s++) {
            var sFwd = sAlphas.substring(s,parseInt(s+3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqAlpha++;
                nSeqChar++;
            }
        }

        /* Check for sequential numeric string patterns (forward and reverse) */
        for (var s=0; s < 8; s++) {
            var sFwd = sNumerics.substring(s,parseInt(s+3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqNumber++;
                nSeqChar++;
            }
        }

        /* Check for sequential symbol string patterns (forward and reverse) */
        for (var s=0; s < 8; s++) {
            var sFwd = sSymbols.substring(s,parseInt(s+3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqSymbol++;
                nSeqChar++;
            }
        }

        /* Modify overall score value based on usage vs requirements */

        /* General point assignment */
        if (nAlphaUC > 0 && nAlphaUC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaUC) * 2));
            sAlphaUC = "+ " + parseInt((nLength - nAlphaUC) * 2);
        }

        if (nAlphaLC > 0 && nAlphaLC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaLC) * 2));
            sAlphaLC = "+ " + parseInt((nLength - nAlphaLC) * 2);
        }

        if (nNumber > 0 && nNumber < nLength) {
            nScore = parseInt(nScore + (nNumber * nMultNumber));
            sNumber = "+ " + parseInt(nNumber * nMultNumber);
        }

        if (nSymbol > 0) {
            nScore = parseInt(nScore + (nSymbol * nMultSymbol));
            sSymbol = "+ " + parseInt(nSymbol * nMultSymbol);
        }

        if (nMidChar > 0) {
            nScore = parseInt(nScore + (nMidChar * nMultMidChar));
            sMidChar = "+ " + parseInt(nMidChar * nMultMidChar);
        }

        /* Point deductions for poor practices */
        if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {  // Only Letters
            nScore = parseInt(nScore - nLength);
            nAlphasOnly = nLength;
            sAlphasOnly = "- " + nLength;
        }

        if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {  // Only Numbers
            nScore = parseInt(nScore - nLength);
            nNumbersOnly = nLength;
            sNumbersOnly = "- " + nLength;
        }

        if (nRepChar > 0) {  // Same character exists more than once
            nScore = parseInt(nScore - nRepInc);
            sRepChar = "- " + nRepInc;
        }

        if (nConsecAlphaUC > 0) {  // Consecutive Uppercase Letters exist
            nScore = parseInt(nScore - (nConsecAlphaUC * nMultConsecAlphaUC));
            sConsecAlphaUC = "- " + parseInt(nConsecAlphaUC * nMultConsecAlphaUC);
        }

        if (nConsecAlphaLC > 0) {  // Consecutive Lowercase Letters exist
            nScore = parseInt(nScore - (nConsecAlphaLC * nMultConsecAlphaLC));
            sConsecAlphaLC = "- " + parseInt(nConsecAlphaLC * nMultConsecAlphaLC);
        }

        if (nConsecNumber > 0) {  // Consecutive Numbers exist
            nScore = parseInt(nScore - (nConsecNumber * nMultConsecNumber));
            sConsecNumber = "- " + parseInt(nConsecNumber * nMultConsecNumber);
        }

        if (nSeqAlpha > 0) {  // Sequential alpha strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqAlpha * nMultSeqAlpha));
            sSeqAlpha = "- " + parseInt(nSeqAlpha * nMultSeqAlpha);
        }

        if (nSeqNumber > 0) {  // Sequential numeric strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqNumber * nMultSeqNumber));
            sSeqNumber = "- " + parseInt(nSeqNumber * nMultSeqNumber);
        }

        if (nSeqSymbol > 0) {  // Sequential symbol strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqSymbol * nMultSeqSymbol));
            sSeqSymbol = "- " + parseInt(nSeqSymbol * nMultSeqSymbol);
        }


        nRequirements = nReqChar;

        if (pwd.length >= nMinPwdLen) {
            var nMinReqChars = 3;
        } else {
            var nMinReqChars = 4;
        }

        if (nRequirements > nMinReqChars) {  // One or more required characters exist
            nScore = parseInt(nScore + (nRequirements * 2));
            sRequirements = "+ " + parseInt(nRequirements * 2);
        }

        /* Determine complexity based on overall score */
        if (nScore > 100) {
            nScore = 100;
        } else if (nScore < 0) {
            nScore = 0;
        }

        if (nScore >= 0 && nScore < 20) {
            return this.options.tier["Very Weak"];
        } else if (nScore >= 20 && nScore < 40) {
            return this.options.tier["Weak"];
        } else if (nScore >= 40 && nScore < 60) {
            return this.options.tier["Good"];
        } else if (nScore >= 60 && nScore < 80) {
            return this.options.tier["Strong"];
        } else if (nScore >= 80 && nScore <= 100) {
            return this.options.tier["Very Strong"];
        }

        return this.options.tier["Too Short"];
    }

    PasswordStrengthCalculator.prototype.showStrength = function(element) {
        var parent = findParent(element, this.options.fieldParentSelector),
            strengthElement;

        // Find the strengthElement
        strengthElement = parent.querySelector('.' + this.options.strengthElementClass);

        // Check if there is already an error message in the DOM
        if(!strengthElement) {
            strengthElement = document.createElement("span");
            strengthElement.className = this.options.strengthElementClass;
            parent.appendChild(strengthElement);
        }
    };

    // Pass this object to the window
    window.PasswordStrengthCalculator = PasswordStrengthCalculator;
})();
