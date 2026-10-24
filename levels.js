// colours: 0 red,1 blue,2 green,3 yellow,4 purple
// obstacle types: gate, lava, smoke, fire, lift. need = bubbles to fill. danger = moves before hazard reaches Chaba
const LEVELS = [
 {moves:20, colors:[0,1], obs:[{t:'gate',c:0,need:10}]},
 {moves:20, colors:[0,1,2], obs:[{t:'lava',c:1,need:12}]},
 {moves:22, colors:[0,1,2], obs:[{t:'gate',c:2,need:10},{t:'lava',c:1,need:12}]},
 {moves:20, colors:[0,1,2], obs:[{t:'smoke',c:2,need:14,danger:16}]},
 {moves:24, colors:[0,1,2,3], obs:[{t:'gate',c:0,need:10},{t:'lift',c:3,need:14}]},
 {moves:26, colors:[0,1,2,3], obs:[{t:'fire',c:1,need:14},{t:'lava',c:3,need:12}]},
 {moves:28, colors:[0,1,2,3], obs:[{t:'smoke',c:2,need:12,danger:18},{t:'gate',c:0,need:12},{t:'lift',c:3,need:12}]},
 {moves:28, colors:[0,1,2,3], obs:[{t:'lava',c:1,need:14,danger:20},{t:'fire',c:0,need:14},{t:'gate',c:3,need:12}]},
 {moves:32, colors:[0,1,2,3,4], obs:[{t:'gate',c:4,need:10},{t:'smoke',c:2,need:12,danger:22},{t:'lift',c:3,need:12},{t:'fire',c:0,need:12}]},
 {moves:36, colors:[0,1,2,3,4], obs:[{t:'fire',c:0,need:12},{t:'lava',c:1,need:12,danger:26},{t:'gate',c:4,need:12},{t:'lift',c:3,need:12},{t:'smoke',c:2,need:10}]},
];
