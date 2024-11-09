function create2DArrayWithFill(dim, fillValue = 0) {

    let arr = [];
    for (let row = 0; row < dim; row++) {
        let rowData = [];
        for (let column = 0; column < dim; column++) {
            rowData.push(fillValue)
        }
        arr.push(rowData);
    }

    return arr;
}

export { create2DArrayWithFill }