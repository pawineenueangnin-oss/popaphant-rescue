// colours: 0 red=bomb/cut, 1 blue=water, 2 green=wind, 3 yellow=key/light, 4 purple=lift
// Each obstacle type is cleared ONLY by its own colour (see ACT in game.js), shown as an icon on the scene.
// threat = how many steps the rising danger needs to reach Somjeed (+1 per move, +1 every rt seconds)
const LEVELS = [
 {moves:19,threat:16,rt:18, theme:'day', colors:[0,3], obs:[{t:'gate',req:{3:14}}]},
 {moves:24,threat:21,rt:18, theme:'day', colors:[1,2,3], obs:[{t:'fire',req:{1:14}}]},
 {moves:24,threat:21,rt:17, theme:'day', colors:[0,1,3], lock:.10, obs:[{t:'saw',req:{0:12}},{t:'gate',req:{3:12}}]},
 {moves:25,threat:22,rt:16, theme:'cave', colors:[0,2,3], lock:.12, obs:[{t:'ghost',req:{3:16},danger:10}]},
 {moves:29,threat:26,rt:16, theme:'cave', colors:[0,1,2,3], bomb:.03, boss:true, obs:[{t:'boss',req:{0:12,1:12,3:12},danger:14}]},
 {moves:29,threat:26,rt:15, theme:'cave', colors:[0,1,3,4], rainbow:.03, obs:[{t:'spider',req:{0:14},danger:10},{t:'lift',req:{4:14}}]},
 {moves:29,threat:26,rt:15, theme:'cave', colors:[0,1,3,4], bomb:.04, lock:.1, obs:[{t:'rocks',req:{0:12},danger:13},{t:'lava',req:{1:14}},{t:'gate',req:{3:12}}]},
 {moves:34,threat:31,rt:14, theme:'storm', colors:[0,2,3,4], rainbow:.03, lock:.12, obs:[{t:'saw',req:{0:12}},{t:'smoke',req:{2:14},danger:12},{t:'lift',req:{4:12}}]},
 {moves:35,threat:32,rt:14, theme:'storm', colors:[0,1,2,3,4], lock:.18, obs:[{t:'ghost',req:{3:14},danger:19},{t:'lava',req:{1:14},danger:18},{t:'smoke',req:{2:10}}]},
 {moves:35,threat:32,rt:13, theme:'storm', colors:[0,1,2,3,4], bomb:.04, rainbow:.03, boss:true, obs:[{t:'boss',req:{0:12,1:12,3:12,4:10},danger:20}]},
 {moves:40,threat:37,rt:13, theme:'cave', colors:[0,1,2,3,4], lock:.15, bomb:.04, obs:[{t:'spider',req:{0:12},danger:19},{t:'smoke',req:{2:12}},{t:'fire',req:{1:12}},{t:'lift',req:{4:12}}]},
 {moves:34,threat:31,rt:13, theme:'storm', colors:[0,1,2,3,4], lock:.2, rainbow:.03, obs:[{t:'rocks',req:{0:12},danger:15},{t:'ghost',req:{3:12},danger:20},{t:'smoke',req:{2:10}},{t:'lava',req:{1:12}}]},
 {moves:40,threat:37,rt:12, theme:'cave', colors:[0,1,2,3,4], bomb:.05, lock:.15, obs:[{t:'smoke',req:{2:12},danger:15},{t:'saw',req:{0:12}},{t:'gate',req:{3:12}},{t:'lift',req:{4:12}}]},
 {moves:43,threat:40,rt:12, theme:'storm', colors:[0,1,2,3,4], lock:.2, bomb:.05, rainbow:.03, obs:[{t:'fire',req:{1:12}},{t:'ghost',req:{3:12},danger:24},{t:'lava',req:{1:10},danger:25},{t:'lift',req:{4:12}},{t:'rocks',req:{0:10},danger:22}]},
 {moves:42,threat:39,rt:12, theme:'storm', colors:[0,1,2,3,4], lock:.18, bomb:.05, rainbow:.03, boss:true, obs:[{t:'saw',req:{0:12}},{t:'boss',req:{0:12,1:12,2:12,4:12},danger:27}]},
];
