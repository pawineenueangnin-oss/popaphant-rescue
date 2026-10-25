// colours: 0 red,1 blue,2 green,3 yellow,4 purple
// obstacle types: gate, lava, smoke, fire, lift, saw, ghost, spider, rocks, boss
// req = {colour:count}; danger = moves before the hazard reaches Somjeed
// themes: day, cave, storm. lock/bomb/rainbow = spawn chances of special bubbles
const LEVELS = [
 {moves:18, theme:'day', colors:[0,1], obs:[{t:'gate',req:{0:14}}]},
 {moves:20, theme:'day', colors:[0,1,2], obs:[{t:'lava',req:{1:14}}]},
 {moves:21, theme:'day', colors:[0,1,2], lock:.10, obs:[{t:'saw',req:{2:12}},{t:'gate',req:{0:12}}]},
 {moves:19, theme:'cave', colors:[0,1,2], lock:.12, obs:[{t:'ghost',req:{2:16},danger:8}]},
 {moves:22, theme:'cave', colors:[0,1,2,3], bomb:.03, boss:true, obs:[{t:'boss',req:{0:12,1:12,3:12},danger:11}]},
 {moves:25, theme:'cave', colors:[0,1,2,3], rainbow:.03, obs:[{t:'spider',req:{2:14},danger:10},{t:'lift',req:{3:14}}]},
 {moves:26, theme:'cave', colors:[0,1,2,3], bomb:.04, lock:.1, obs:[{t:'rocks',req:{1:12},danger:13},{t:'fire',req:{0:14}},{t:'gate',req:{3:12}}]},
 {moves:28, theme:'storm', colors:[0,1,2,3], rainbow:.03, lock:.12, obs:[{t:'saw',req:{0:12}},{t:'smoke',req:{2:14},danger:12},{t:'lift',req:{3:12}}]},
 {moves:31, theme:"storm", colors:[0,1,2,3,4], lock:.18, obs:[{t:'ghost',req:{3:14},danger:19},{t:'lava',req:{1:14},danger:18},{t:'gate',req:{4:10}}]},
 {moves:31, theme:'storm', colors:[0,1,2,3,4], bomb:.04, rainbow:.03, boss:true, obs:[{t:'boss',req:{0:12,1:12,3:12,4:10},danger:20}]},
 {moves:31, theme:"cave", colors:[0,1,2,3,4], lock:.15, bomb:.04, obs:[{t:'spider',req:{4:12},danger:16},{t:'saw',req:{1:12}},{t:'fire',req:{0:12}},{t:'lift',req:{3:12}}]},
 {moves:29, theme:"storm", colors:[0,1,2,3,4], lock:.2, rainbow:.03, obs:[{t:'rocks',req:{2:12},danger:13},{t:'ghost',req:{3:12},danger:20},{t:'gate',req:{4:10,0:8}},{t:'lava',req:{1:12}}]},
 {moves:33, theme:'cave', colors:[0,1,2,3,4], bomb:.05, lock:.15, obs:[{t:'smoke',req:{2:12},danger:15},{t:'saw',req:{0:12}},{t:'spider',req:{4:12},danger:22},{t:'lift',req:{3:12}}]},
 {moves:33, theme:"storm", colors:[0,1,2,3,4], lock:.2, bomb:.05, rainbow:.03, obs:[{t:'fire',req:{0:12}},{t:'ghost',req:{3:12},danger:20},{t:'lava',req:{1:12},danger:22},{t:'gate',req:{4:12}},{t:'rocks',req:{2:10},danger:22}]},
 {moves:36, theme:'storm', colors:[0,1,2,3,4], lock:.18, bomb:.05, rainbow:.03, boss:true, obs:[{t:'saw',req:{2:12}},{t:'boss',req:{0:12,1:12,3:12,4:12},danger:25}]},
];
