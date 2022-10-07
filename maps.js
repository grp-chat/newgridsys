class AllMatrixes {
    constructor() {

        this.area1 = {
            gridMatrix: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 23, 0, 1],
                [1, 0, 0, 0, 0, 20, 1],
                [1, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 0, 21, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 22, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
                title: "Area 1",
                    doors: [
                        { x: 1, y: 7, toArea: "area2", appearingCoords: { x: 1, y: 2 } },
                        { x: 5, y: 7, toArea: "area2", appearingCoords: { x: 1, y: 2 } }
                    ]

        },
        this.area2 = {
            gridMatrix: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 30, 29, 0, 1],
                [1, 0, 0, 1, 1, 0, 1],
                [1, 0, 0, 0, 27, 28, 1],
                [1, 0, 25, 26, 0, 0, 1],
                [1, 24, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
                title: "Area 2",
                    doors: [
                        { x: 1, y: 1, toArea: "area1", appearingCoords: { x: 2, y: 7 } }
                    ],
            }

    }


}

// const allMatrixes = {}

module.exports = {
    AllMatrixes,
}