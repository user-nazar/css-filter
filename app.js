const filter = {
  blur: 0,
  invert: 0,
  sepia: 0,
  saturate: 100,
  hue: 0,
};

const filterDefault = {
  blur: 0,
  invert: 0,
  sepia: 0,
  saturate: 100,
  hue: 0,
};

const canvasWidth = 830;
const canvasRatio = 830 / 520;
const canvasDiagonal = Math.sqrt(830 ** 2 + 520 ** 2);

const image = new Image();
image.setAttribute("crossOrigin", "anonymous");

const imageController = {
  imgDir: "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/",
  lastDayTime: "day",
  imgNumber: 1,
  ratio: 1,
  width: 1,
  height: 1,

  init() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    image.src = "assets/img/img.jpg";
    image.onload = function() {
      imageController.fit();
      imageController.draw();
    }

    document.getElementById("reset").addEventListener("click", filterController.reset.bind(filterController));
    document.getElementById("next").addEventListener("click", this.next.bind(this));
    document.getElementById("load").addEventListener("change", this.load);
    document.getElementById("save").addEventListener("click", this.save.bind(this));
  },

  next() {
    let dayTime;
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      dayTime = "night";
    }
    if (hour >= 6 && hour < 12) {
      dayTime = "morning";
    }
    if (hour >= 12 && hour < 18) {
      dayTime = "day";
    }
    if (hour >= 18 && hour < 24) {
      dayTime = "evening";
    }

    if (dayTime === this.lastDayTime) {
      this.imgNumber += 1;
      if (this.imgNumber > 20) {
        this.imgNumber %= 20;
      }  
    } else {
      this.lastDayTime = dayTime;
      this.imgNumber = 1;
    }
    
    let imgNumStr = String(this.imgNumber);
    if (this.imgNumber < 10) {
      imgNumStr = "0" + imgNumStr;
    }

    const imgURL = `${this.imgDir}/${dayTime}/${imgNumStr}.jpg`;
    image.src = imgURL;
  },

  load(event) {

    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function () {
      image.src = this.result;
    }
    fileReader.readAsDataURL(file);

    event.target.value = "";
  },

  save() {
    const saveCanvas = document.createElement("canvas");
    saveCanvas.width = image.width;
    saveCanvas.height = image.height;

    const saveCtx = saveCanvas.getContext("2d");
    const ratio = Math.sqrt(image.width ** 2 + image.height ** 2) / canvasDiagonal;
    saveCtx.filter = `blur(${filter.blur * ratio}px) invert(${filter.invert}%) sepia(${filter.sepia}%) saturate(${filter.saturate}%) hue-rotate(${filter.hue}deg)`;
    saveCtx.drawImage(image, 0, 0);

    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = saveCanvas.toDataURL();
    link.click();
    link.delete;
  },

  draw() {
    this.ctx.filter = `blur(${filter.blur}px) invert(${filter.invert}%) sepia(${filter.sepia}%) saturate(${filter.saturate}%) hue-rotate(${filter.hue}deg)`;

    const x = (this.canvas.width - this.width) / 2;
    const y = (this.canvas.height - this.height) / 2;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, x, y, this.width, this.height);
  },

  fit() {
    this.ratio = image.width / image.height;

    if (image.width > this.canvas.width) {
      this.fitWidth();
    }
    if (image.height > this.canvas.height) {
      this.fitHeight();
    }
    if (image.width <= this.canvas.width && image.height <= this.canvas.height) {
      if (this.ratio <= canvasRatio) {
        this.fitHeight();
      } else {
        this.fitWidth();
      }
    }
  },

  fitWidth() {
    this.width = this.canvas.width;
    this.height = this.width / this.ratio;
  },

  fitHeight() {
    this.height = this.canvas.height;
    this.width = this.height * this.ratio;
  }
}

const filterController = {
  range: {},
  output: {},

  init() {
    for (let key in filter) {
      this.range[key] = document.querySelector(`input[name=${key}]`);
      this.range[key].addEventListener("input", this.update.bind(this));
    }
    for (let key in filter) {
      this.output[key] = document.querySelector(`output[name=${key}]`);
    }
    for (let key in filter) {
      filter[key] = Number(this.range[key].value);
      this.output[key].value = filter[key];
    }
  },

  update(event) {
    const filterName = event.target.name;
    filter[filterName] = event.target.value;
    this.output[filterName].value = event.target.value;

    imageController.draw();
  },

  reset() {
    for (let key in filter) {
      filter[key] = filterDefault[key];

      this.range[key].value = filter[key]
      this.output[key].value = filter[key];

      imageController.draw();
    }
  }
}

const fullscreen = {
  init() {
    document.getElementById("fullscreen").addEventListener("click", this.toggle);
  },

  toggle() {
    console.log("fullscreen test");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}

imageController.init();
filterController.init();
fullscreen.init();