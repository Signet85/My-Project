const arr = [23, 44, 44];
let myfunc = a => {
    console.log(`too: ${a}`)
}
const arr2 = [...arr, 44, 123];
myfunc(arr2[1]);