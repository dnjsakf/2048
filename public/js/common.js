const root = document.querySelector("#root > .root-wrapper");

const status = document.getElementById("status").Status({
  mode: "4x4"
});

const board = document.getElementById("board").Board({
  screenSize: {
    width: root.offsetWidth,
    height: root.offsetHeight-50
  },
  insts: {
    status: status
  }
});