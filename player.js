class Player {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.lable = config.lable;
        this.id = config.id || "GS";
        this.startingSteps = 500;
        this.maxSteps = config.maxSteps || 500;
        this.steps = config.steps || this.startingSteps;
        this.area = config.area || "area1";
        this.color = config.color || "grey";
        this.defaultX = config.x;
        this.defaultY = config.y;
    }
}

module.exports = {
    Player,
}