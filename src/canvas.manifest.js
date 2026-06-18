export const manifest = {
  screens: {
    scr_z1px2r: { name: "Home", route: "/", position: { "x": 160, "y": 2200 } },
    scr_ktuuix: { name: "Register", route: "/register", position: { "x": 160, "y": 220 } },
    scr_uq0un4: { name: "Login", route: "/login", position: { "x": 1560, "y": 220 } },
    scr_cl7y3o: { name: "Pick Template", route: "/create", position: { "x": 1560, "y": 2200 } },
    scr_noctkw: { name: "Gallery", route: "/gallery", position: { "x": 2960, "y": 2200 } }
  },
  sections: {
    sec_hnsvcf: { name: "Authentication", x: 0, y: 0, width: 2920, height: 1180 },
    sec_f6eshw: { name: "Main App Flow", x: 0, y: 1980, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_hnsvcf", children: [
    { kind: "screen", id: "scr_ktuuix" },
    { kind: "screen", id: "scr_uq0un4" }]
  },
  { kind: "section", id: "sec_f6eshw", children: [
    { kind: "screen", id: "scr_z1px2r" },
    { kind: "screen", id: "scr_cl7y3o" },
    { kind: "screen", id: "scr_noctkw" }]
  }]

};