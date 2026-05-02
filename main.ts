VoxelEngine.init()
VoxelEngine.Player.teleportPlayer(3, 3, 3)
//VoxelEngine.World.fillWorld(0)
VoxelEngine.enableBlockBreaking(true)
VoxelEngine.enableBlockPlacing(true)
VoxelEngine.enablePlayerHitbox(false)
VoxelEngine.enableRendering(true)
VoxelEngine.enableRenderingSelected(true)
VoxelEngine.enablePlayerUpdating(true)
VoxelEngine.enabled(true)
VoxelEngine.Player.gravity = false
stats.turnStats(true)


VoxelEngine.Player.setVar(PlayerVars.x, 3)
VoxelEngine.Player.setVar(PlayerVars.y, 3)
VoxelEngine.Player.setVar(PlayerVars.z, -1)

VoxelEngine.Player.setVar(PlayerVars.yaw, 0)
VoxelEngine.Player.setVar(PlayerVars.pitch, 0)
VoxelEngine.Player.setVar(PlayerVars.fov, 1)

VoxelEngine.Player.setVar(PlayerVars.gravity, false)
VoxelEngine.Player.setVar(PlayerVars.vy, 0)
VoxelEngine.Player.setVar(PlayerVars.ay, 1)
VoxelEngine.Player.setVar(PlayerVars.onLand, false)

// Hitbox extents
VoxelEngine.Player.setVar(PlayerVars.minW, 0.3)
VoxelEngine.Player.setVar(PlayerVars.minH, 1.1)
VoxelEngine.Player.setVar(PlayerVars.minL, 0.3)
VoxelEngine.Player.setVar(PlayerVars.maxW, 0.3)
VoxelEngine.Player.setVar(PlayerVars.maxH, 0.3)
VoxelEngine.Player.setVar(PlayerVars.maxL, 0.3)

VoxelEngine.Player.setVar(PlayerVars.moveSpeed, 4)
VoxelEngine.Player.setVar(PlayerVars.turnSpeed, 1.5)

VoxelEngine.Textures.addSimpleTexture(img`
    1 1 1 1 1 1 1 f 1 1 1 1 1 1 1
    1 1 1 1 1 1 1 f 1 1 1 1 1 1 1
    1 1 1 1 1 f f f f f 1 1 1 1 1
    1 1 1 1 f 1 1 1 1 1 f 1 1 1 1
    1 1 1 f f 1 1 1 1 1 f f 1 1 1
    1 1 f 1 1 f 1 1 1 f 1 1 f 1 1
    1 1 f 1 1 1 f 1 f 1 1 1 f 1 1
    f f f 1 1 1 1 f 1 1 1 1 f f f
    1 1 f 1 1 1 f 1 f 1 1 1 f 1 1
    1 1 f 1 1 f 1 1 1 f 1 1 f 1 1
    1 1 1 f f 1 1 1 1 1 f f 1 1 1
    1 1 1 1 f 1 1 1 1 1 f 1 1 1 1
    1 1 1 1 1 f f f f f 1 1 1 1 1
    1 1 1 1 1 1 1 f 1 1 1 1 1 1 1
    1 1 1 1 1 1 1 f 1 1 1 1 1 1 1
`)