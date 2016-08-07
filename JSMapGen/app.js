function ifundef(value, def) {
    return typeof(value) === 'undefined' ? def : value;
}

function makeRandArray(width, height, thresh) {
    thresh = ifundef(thresh, 0.5);
    var array = new Array(width);

    for (var i = 0; i < width; i++) {
        array[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            array[i][j] = Math.random() > thresh ? 1 : 0;
        }
    }
    
    return array;
}

function over2D(array, func, sub_width, sub_height, pad_size, pad_value) {
    sub_width = ifundef(sub_width, 3);
    sub_height = ifundef(sub_height, 3);
    pad_size = ifundef(pad_size, 0);
    pad_value = ifundef(pad_value, 0);

    for (var i = 0; i < array.length; i++) {
    }

    var arr_w = array.length;
    var arr_h = array[0].length;
    var res_w = arr_w - sub_width + pad_size*2 + 1;
    var res_h = arr_h - sub_height + pad_size*2 + 1;

    // Fill top and bottom padding.
    var res = new Array(res_w);
    for (var i = 0; i < pad_size; i++) {
        // Top padding.
        res[i] = new Array(res_h);
        res[i].fill(pad_value);

        // Bottom padding.
        res[res.length - i-1] = new Array(res_h);
        res[res.length - i-1].fill(pad_value);
    }

    var sub_arr = new Array(sub_width);

    for (var i = 0; i < arr_w-sub_height+1; i++) {
        res_idx = i + pad_size;
        res[res_idx] = new Array(res_h);
        // Fill left padding.
        res[res_idx].fill(pad_value, 0, pad_size);
        // File right padding.
        res[res_idx].fill(pad_value, res_h - pad_size);

        // Account for padding in result (-2xpad_size)
        for (var j = 0; j < arr_h-sub_width+1; j++) {
            res_jdx = j + pad_size;
            for (var k = 0; k < sub_width; k++) {
                sub_arr[k] = array[i + k].slice(j, j + sub_height);
            }
            res[res_idx][res_jdx] = func(sub_arr);
        }
    }

    return res;
}

function print2D(array) {
    array.forEach(function (curr) {
        curr.forEach(function (curr) { process.stdout.write(String(curr)) })
        process.stdout.write("\n");
    });
}

function sum(array) { return array.reduce(function (prev, cur) { return prev + cur }) };

function sum2D(array) {
    return array.reduce(function (prev, cur) { return prev + sum(cur) }, 0)
}

array = makeRandArray(50, 50, 0.3);
print2D(array);
console.log("");

processed = over2D(array, function (arr) { return arr[0][0] }, 1, 1)
print2D(processed);
console.log("");

processed = over2D(array, function (arr) { return sum2D(arr) > 6 ? 1 : 0 }, 3, 3, 1, 1)
print2D(processed);
console.log("");

processed = over2D(processed, function (arr) { return sum2D(arr) > 4 ? 1 : 0 }, 3, 3, 1, 1)
print2D(processed);
console.log("");