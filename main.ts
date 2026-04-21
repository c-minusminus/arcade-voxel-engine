VoxelEngine.enableGravity(false)

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
})