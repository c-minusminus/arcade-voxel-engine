//% color=#03AA74 weight=97 icon="\uf1b2"
//% block="Voxel Engine"
namespace VoxelEngine {
    //% group="Engine"
    //% block="init engine"
    export function init() {
        Vars.init()
        World.init()
        Player.init()

    }

    //% group="Engine"
    //% block="update engine"
    export function render() {
        if (VoxelEngine.Features.enabled && VoxelEngine.Features.render) {
            Player.computeBasis()

            const f = Player._fVec
            const r = Player._rVec
            const u = Player._uVec

            for (let py = 0; py < scene.screenHeight(); ++py) {
                for (let px = 0; px < scene.screenWidth(); ++px) {

                    // Compute ray direction (reuses rayDir buffer)
                    let sx = VoxelEngine.Vars.sxTable[px]
                    let sy = VoxelEngine.Vars.syTable[py]

                    sx *= VoxelEngine.Player._fov
                    sy *= VoxelEngine.Player._fov

                    // write into reusable buffer (no allocation)
                    const renderX = f[0] + r[0] * sx + u[0] * sy
                    const renderY = f[1] + r[1] * sx + u[1] * sy
                    const renderZ = f[2] + r[2] * sx + u[2] * sy

                    // Trace ray → [face, dist, u, v]
                    const hit = VoxelEngine.Ray.traceRay(
                        VoxelEngine.Player._x, VoxelEngine.Player._y, VoxelEngine.Player._z,
                        renderX, renderY, renderZ,
                        15
                    )


                    const face = hit[0]
                    if (face > -1) {
                        const dist = hit[1]
                        const uCoord = hit[2]
                        const vCoord = hit[3]
                        const voxel = hit[4]

                        const base = voxel * 6 + face
                        const texw = VoxelEngine.Textures.texW[base]
                        const texh = VoxelEngine.Textures.texH[base]

                        const tx = Math.min((uCoord * texw) | 0, texw - 1)
                        const ty = Math.min((vCoord * texh) | 0, texh - 1)


                        const col = VoxelEngine.Textures.texData[voxel][face][tx + ty * texw]


                        screen.setPixel(px, py, col)
                    }
                }
            }
            if (VoxelEngine.Features.renderSelected) {
                const base = VoxelEngine.Vars.selectedBlock * 6 + 3
                const w = VoxelEngine.Textures.texW[base] + 1
                const h = VoxelEngine.Textures.texH[base] + 1

                const data = VoxelEngine.Textures.texData[VoxelEngine.Vars.selectedBlock][VoxelEngine.Textures.texDisp[VoxelEngine.Vars.selectedBlock]]
                let i = 0
                for (let y = w - 1; y >= 0; y--) {
                    for (let x = 0; x < w; x++) {
                        screen.setPixel(x, y, data[i++])
                    }
                }
            }
        }
    }

    export function update(dt: number) {
        if (VoxelEngine.Features.enabled && VoxelEngine.Features.updatePlayer) {
            Player.update(dt)
        }
    }
}