// i forget if this is executed or not, so i'l leave it like this for now
VoxelEngine.enableBlockPlacing(true)
VoxelEngine.enableBlockBreaking(true)

VoxelEngine.enableRendering(true)
VoxelEngine.enablePlayerUpdating(true)
VoxelEngine.enablePlayerHitbox(true)

VoxelEngine.enableRenderingSelected(true)

VoxelEngine.enabled(true)

VoxelEngine.init()
let lastTime: number = game.runtime()
game.onPaint(function () {
    const now: number = game.runtime()
    //console.log(now - lastTime)
    const dt: number = (now - lastTime) / 1000
    lastTime = now
    VoxelEngine.update(dt)
    VoxelEngine.render()
    //stats.setStat("x: " + VoxelEngine.World.sizeX)
})

VoxelEngine.Textures.addTexture([
    img`
        2
    `, img`
        5
    `, img`
        b c b
        c b c
        b c b
    `, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
        7 7 7 e 7 e e 7 7 e 7 7 e 7 e 7
        e 7 e e 7 e e e 7 e 7 e e 7 e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e e e e e
        e b e e e e e e e e e e e e e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e b e e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e e e e e
        e e e e e b e e e e e e e e e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e b e e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e e e e e
    `, img`
        ....eeeeeeeeeeeeeeeeeeeeeeee....
        ..eeeeeeeeeeeeeeeeeeeeeeeeeeee..
        .eeee4444444444444444444444eeee.
        eee41111144444444444444111114eee
        ee111fff1114444444444111fff111ee
        e111ff8ff11144444444111ff8ff111e
        44111fff1114444444444111fff11144
        44441111144444f44f44444111114444
        44444444444444f44f44444444444444
        44444444444444f44f44444444444444
        4444444444444f4444f4444444444444
        4444444444444f4444f4444444444444
        444444444444f444444f444444444444
        44444444444f44444444f44444444444
        44444444444f44ffff44f44444444444
        444444444444ff4444ff444444444444
        44444444444444444444444444444444
        44444444444444444444444444444444
        44442222444444444444444442222244
        44442222222444444444442222222224
        4444221122222222222222222211f224
        44442221f122222222222222f111f224
        4444422ff111f111f111f111f11f2224
        44444221f111f111f111f111fff22244
        44444422fffffffffffffffff2222444
        4444442221f111f111f111f222224444
        4444444222f111f111f1122222444444
        44444444222222222222222244444444
        .444444442222222222222444444444.
        ..4444444444444444444444444444..
        ...44444444444444444444444444...
        .....4444444444444444444444.....
    `, img`
        . 1 2 3
        4 5 6 7
        8 9 a b
        c d e f
    `
], 0)

browserEvents.C.onEvent(browserEvents.KeyEvent.Pressed, function() {
    VoxelEngine.World.resizeY(3)
})

browserEvents.V.onEvent(browserEvents.KeyEvent.Pressed, function () {
    VoxelEngine.World.resizeY(-3)
})/**/
