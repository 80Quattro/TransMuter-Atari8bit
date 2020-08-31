function ChevyEngine() {

    var that = this;
    var requestAnimationFrameID;
    var lastFrameTime = new Date().getTime();
    this.deltaTime = 0;
    var isStarting = false;
    var canvas, context;
    var clearRepeating = false;
    var parentObj; // The object in which Chevy was called
    this.camera = {};
    this.camera.viewRange = {};

    this.initCanvas = function (parent, width, height, color, clearing) {
        if (arguments[0] == undefined || typeof arguments[0] != "object") console.error("#Chevy err: I dont't have a parent for canvas element");
        else {
            width = (arguments[1] == undefined) ? 1024 : arguments[1];
            height = (arguments[2] == undefined) ? 720 : arguments[2];
            color = (arguments[3] == undefined) ? "#000" : arguments[3];
            clearRepeating = (arguments[4] == undefined) ? true : arguments[4];
            
            that.camera.resolution = { x: width, y: height };
            that.camera.position = { x: width / 2, y: height / 2};
            that.camera.viewRange = { fromX: this.camera.position.x - this.camera.resolution.x / 2, toX: this.camera.position.x + this.camera.resolution.x / 2, fromY: this.camera.position.y - this.camera.resolution.y / 2, toY: this.camera.position.y + this.camera.resolution.y /2 };

            var canvasObj = document.createElement("canvas");
            canvasObj.width = width;
            canvasObj.height = height;
            canvasObj.style.background = color;

            parent.appendChild(canvasObj);

            canvas = parent.lastChild;
            context = canvas.getContext("2d");
            return canvas;
        }
    }

    this.start = function () {
        if(arguments[0]) parentObj = arguments[0];
        requestAnimationFrameID = requestAnimationFrame(animate);
        isStarting = true;
    }

    this.stop = function () {
        cancelAnimationFrame(requestAnimationFrameID);
        isStarting = false;
    }

    function animate() {
        var currentFrameTime = new Date().getTime();
        that.deltaTime = currentFrameTime - lastFrameTime;
        lastFrameTime = currentFrameTime;

        // cyclic cleaning of the scene (canvas)
        if (clearRepeating) context.clearRect(0, 0, canvas.width, canvas.height);

        if(parentObj) parentObj.animateScene();
        requestAnimationFrameID = requestAnimationFrame(animate);
    }

    this.getFPS = function () {
        return Math.round(1000 / that.deltaTime);
    }

    this.getIsStarting = function () {
        return isStarting;
    }

    this.getContext = function () {
        return context;
    }
    
    this.cameraScroll = function ( scrollX, scrollY ) {
        that.camera.position.x += scrollX * that.deltaTime;
        that.camera.position.y += scrollY * that.deltaTime;
        that.camera.viewRange.fromX = that.camera.position.x - that.camera.resolution.x / 2; 
        that.camera.viewRange.toX = that.camera.position.x + that.camera.resolution.x / 2;
        that.camera.viewRange.fromY = that.camera.position.y - that.camera.resolution.y / 2;
        that.camera.viewRange.toY = that.camera.position.y + that.camera.resolution.y / 2;
    }
    
    this.isPointSeenByCamera = function ( x, y ) {
        if( x >= that.camera.viewRange.fromX && x <= that.camera.viewRange.toX && y >= that.camera.viewRange.fromY && y <= that.camera.viewRange.toY )
            return true;
        return false;
    }

}