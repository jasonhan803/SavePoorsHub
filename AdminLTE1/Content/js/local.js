function changeDecimalBuZero(number, bitNum) {
    /// <summary>
    /// 小数位不够，用0补足位数
    /// </summary>
    /// <param name="number">要处理的数字</param>
    /// <param name="bitNum">生成的小数位数</param>
    var f_x = parseFloat(number);
    if (isNaN(f_x)) {
        return 0;
    }
    var s_x = number.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + bitNum) {
        s_x += '0';
    }
    return s_x;
}

function nFormatter(num, digits) {
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: " K" },
        { value: 1E6, symbol: " M" },
        { value: 1E9, symbol: " G" },
        { value: 1E12, symbol: " T" },
        { value: 1E15, symbol: " P" },
        { value: 1E18, symbol: " E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function nFormatterCpu(num, digits) {
    const si = [
        { value: 1, symbol: " us" },
        { value: 1E3, symbol: " ms" },
        { value: 1E6, symbol: " s" }
        //{ value: 1E9, symbol: "G" },
        //{ value: 1E12, symbol: "T" },
        //{ value: 1E15, symbol: "P" },
        //{ value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function detectScatterExtension(extensionId, callback) {
   
    var imgurl = "chrome-extension://ammjpmhgckkpcamddpolhchgomcojkle/inject.js";
    $.ajax(imgurl, {
        type: 'get',
        timeout: 1000,
        success: function () {
            callback(true);
        },
        error: function () {
            callback(false);
        }
    });
}

function pad(num, n) {
    return Array(n > num ? (n - ('' + num).length + 1) : 0).join(0) + num;
}

//table sort
function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index) { return $(row).children('td').eq(index).text() }
