const root = document.querySelector("#root > .root-wrapper");

const status = document.getElementById("status").Status({
  mode: "4x4",
  datas: {
    screen: {
      width: root.offsetWidth,
      height: root.offsetHeight-50
    },
    margin: 5+3
  }
});

const board = document.getElementById("board").Board({
  insts: {
    status: status
  }
});