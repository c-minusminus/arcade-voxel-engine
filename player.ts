enum PlayerNumbers {
    //% block="fVec"
    fVec,
    //% block="rVec"
    rVec,
    //% block="uVec"
    uVec,

    //% block="x"
    x,
    //% block="y"
    y,
    //% block="z"
    z,

    //% block="yaw"
    yaw,
    //% block="pitch"
    pitch,
    //% block="fov"
    fov,

    //% block="gravity"
    gravity,
    //% block="vy"
    vy,
    //% block="ay"
    ay,
    //% block="onLand"
    onLand,

    //% block="minW"
    minW,
    //% block="minH"
    minH,
    //% block="minL"
    minL,
    //% block="maxW"
    maxW,
    //% block="maxH"
    maxH,
    //% block="maxL"
    maxL,

    //% block="moveSpeed"
    moveSpeed,
    //% block="turnSpeed"
    turnSpeed,
}

namespace VoxelEngine.Player {
    export let rVec = [0, 0, 0]
    export let fVec = [0, 0, 0]
    export let uVec = [0, 0, 0]


    export let x = -1
    export let y = -1
    export let z = -1

    export let yaw = 0
    export let pitch = 0
    export let fov = 1.0

    export let gravity = false
    export let vy = 0
    export let ay = 1
    export let onLand = false

    // Hitbox extents
    export let minW = 0.3
    export let minH = 1.1
    export let minL = 0.3
    export let maxW = 0.3
    export let maxH = 0.3
    export let maxL = 0.3

    export let moveSpeed = 4
    export let turnSpeed = 1.5

    export function init() { }

    //% group="Player"
    //% block="calculate current direction into fVec, rVec, and uVec"
    export function computeBasis() {
        const cp = Math.cos(Player.pitch)
        const sp = Math.sin(Player.pitch)
        const cy = Math.cos(Player.yaw)
        const sy = Math.sin(Player.yaw)

        // forward (normalized)
        Player.fVec[0] = cp * cy
        Player.fVec[1] = sp
        Player.fVec[2] = cp * sy

        // right (normalized, horizontal)
        Player.rVec[0] = -Player.fVec[2]
        Player.rVec[1] = 0
        Player.rVec[2] = Player.fVec[0]
        const rl = Math.sqrt(Player.rVec[0] * Player.rVec[0] + Player.rVec[2] * Player.rVec[2])
        Player.rVec[0] /= rl
        Player.rVec[2] /= rl

        // up = r × f (normalized automatically if r,f are)
        Player.uVec[0] = Player.rVec[1] * Player.fVec[2] - Player.rVec[2] * Player.fVec[1]
        Player.uVec[1] = Player.rVec[2] * Player.fVec[0] - Player.rVec[0] * Player.fVec[2]
        Player.uVec[2] = Player.rVec[0] * Player.fVec[1] - Player.rVec[1] * Player.fVec[0]
    }

    export function update(dt: number) {
        const aX = Player.x - Player.minW
        const aY = Player.y - Player.minH
        const aZ = Player.z - Player.minL
        const bX = Player.x + Player.maxW
        const bY = Player.y + Player.maxH
        const bZ = Player.z + Player.maxL

        const f = Player.fVec
        const r = Player.rVec
        const u = Player.uVec

        // --- movement input ---
        const move = Player.moveSpeed * dt
        const turn = Player.turnSpeed * dt

        let dx = 0, dy = 0, dz = 0

        if (browserEvents.W.isPressed()) { dx += f[0]; dy += f[1]; dz += f[2] }
        if (browserEvents.S.isPressed()) { dx -= f[0]; dy -= f[1]; dz -= f[2] }
        if (browserEvents.A.isPressed()) { dx -= r[0]; dy -= r[1]; dz -= r[2] }
        if (browserEvents.D.isPressed()) { dx += r[0]; dy += r[1]; dz += r[2] }
        if (browserEvents.Space.isPressed() && Player.onLand) Player.vy = 1.8

        if (Player.gravity) {
            // normal gravity
            Player.vy -= Player.ay * move
            dy = Player.vy
        } else {
            // free-fly mode
            if (browserEvents.Q.isPressed()) { dx += u[0]; dy += u[1]; dz += u[2] }
            if (browserEvents.E.isPressed()) { dx -= u[0]; dy -= u[1]; dz -= u[2] }
        }



        dx *= move
        dy *= move
        dz *= move




        // no movement -> early out
        if (!(dx === 0 && dy === 0 && dz === 0)) {
            if (VoxelEngine.Features.hitboxDetection) {
                const t = VoxelEngine.Collision.hitboxDirT(
                    aX, aY, aZ,
                    bX, bY, bZ,
                    dx, dy, dz
                )

                Player.x = Player.x + t[0] * dx
                Player.y = Player.y + t[1] * dy
                Player.z = Player.z + t[2] * dz

                // --- vertical collision handling ---
                if (dy !== 0) {
                    if (t[3] & 2) {
                        if (dy < 0) Player.onLand = true
                        Player.vy = 0
                    } else
                        Player.onLand = false
                }
            } else {
                // no collision
                Player.x += dx
                Player.y += dy
                Player.z += dz

            }




            if (browserEvents.ArrowLeft.isPressed()) Player.yaw -= turn
            if (browserEvents.ArrowRight.isPressed()) Player.yaw += turn
            if (browserEvents.ArrowUp.isPressed()) Player.pitch += turn
            if (browserEvents.ArrowDown.isPressed()) Player.pitch -= turn

            if (Player.pitch > 1.5) Player.pitch = 1.5
            if (Player.pitch < -1.5) Player.pitch = -1.5

            const leftNow = browserEvents.MouseLeft.isPressed()
            const rightNow = browserEvents.MouseRight.isPressed()

            const mx = browserEvents.mouseX()
            const my = browserEvents.mouseY()

            if (leftNow && !VoxelEngine.Vars.prevLeft && VoxelEngine.Features.blockPlacing) {
                Player.interactWithWorld(true, mx, my)
            }

            if (rightNow && !VoxelEngine.Vars.prevRight && VoxelEngine.Features.blockBreaking) {
                Player.interactWithWorld(false, mx, my)
            }

            VoxelEngine.Vars.prevLeft = leftNow
            VoxelEngine.Vars.prevRight = rightNow



            let zNow = browserEvents.Z.isPressed()
            let xNow = browserEvents.X.isPressed()
            let gNow = browserEvents.G.isPressed()

            if (zNow && !VoxelEngine.Vars.prevZ) {
                VoxelEngine.Vars.selectedBlock--
                if (VoxelEngine.Vars.selectedBlock < 0) VoxelEngine.Vars.selectedBlock = VoxelEngine.Vars.blockCount - 1
            }

            if (xNow && !VoxelEngine.Vars.prevX) {
                VoxelEngine.Vars.selectedBlock++
                if (VoxelEngine.Vars.selectedBlock >= VoxelEngine.Vars.blockCount) VoxelEngine.Vars.selectedBlock = 0
            }

            if (gNow && !VoxelEngine.Vars.prevG) {
                Player.gravity = !Player.gravity
            }

            VoxelEngine.Vars.prevZ = zNow
            VoxelEngine.Vars.prevX = xNow
            VoxelEngine.Vars.prevG = gNow
        }
    }

    //% group="Player"
    //% block="trace ray at x %mx y %my, place/break % place"
    //% place.shadow="toggleOnOff"
    //% place.defl=true
    //% mx.defl=0
    //% my.defl=0
    export function interactWithWorld(place: boolean, mx: number, my: number) {
        if (mx < 0 || my < 0 || mx >= scene.screenWidth() || my >= scene.screenHeight()) return

        // 1. Use the same basis as render()
        Player.computeBasis()
        const f = Player.fVec
        const r = Player.rVec
        const u = Player.uVec

        // 2. Use the SAME sx/sy as render()
        const sx = VoxelEngine.Vars.sxTable[mx] * Player.fov
        const sy = VoxelEngine.Vars.syTable[my] * Player.fov

        // 3. Ray direction
        const dx = f[0] + r[0] * sx + u[0] * sy
        const dy = f[1] + r[1] * sx + u[1] * sy
        const dz = f[2] + r[2] * sx + u[2] * sy

        // 4. Raycast
        const hit = VoxelEngine.Ray.traceRay(Player.x, Player.y, Player.z, dx, dy, dz, 50)
        const face = hit[0]
        stats.setStat("" + face)
        if (face < 0) return

        const dist = hit[1]

        // 5. Hit point
        const hx = hit[5]
        const hy = hit[6]
        const hz = hit[7]

        // 6. Convert to voxel coords
        let vx = hx | 0
        let vy = hy | 0
        let vz = hz | 0

        // 7. Destroy block
        if (!place) {
            VoxelEngine.World.voxels[vx + vy * VoxelEngine.World.sizeX + vz * VoxelEngine.World.XY] = 0
            return
        }

        // 8. Place block: move outward along face
        if (face === 0) vx++
        if (face === 1) vx--
        if (face === 2) vy++
        if (face === 3) vy--
        if (face === 4) vz++
        if (face === 5) vz--

        if (vx < 0 || vy < 0 || vz < 0 ||
            vx >= VoxelEngine.World.sizeX || vy >= VoxelEngine.World.sizeY || vz >= VoxelEngine.World.sizeZ) return

        VoxelEngine.World.voxels[vx + vy * VoxelEngine.World.sizeX + vz * VoxelEngine.World.XY] = VoxelEngine.Vars.selectedBlock
    }

    //% group="Player"
    //% block="teleport player to x %x y %y z %z"
    //% x.defl=0
    //% y.defl=0
    //% z.defl=0
    export function teleportPlayer(x: number, y: number, z: number) {
        Player.x = x
        Player.y = y
        Player.z = z
    }

    //% group="Player"
    //% block="block player is looking at"
    export function getLookBlock(): number {
        const hit = Ray.traceRay(Player.x, Player.y, Player.z, Player.fVec[0], Player.fVec[1], Player.fVec[2], 50)
        return hit[0] < 0 ? -1 : hit[4]
    }



    //% group="Player"
    //% block="get %v"
    export function getVar(v: PlayerNumbers): any {
        switch (v) {
            case PlayerNumbers.fVec: return Player.fVec
            case PlayerNumbers.rVec: return Player.rVec
            case PlayerNumbers.uVec: return Player.uVec

            case PlayerNumbers.x: return Player.x
            case PlayerNumbers.y: return Player.y
            case PlayerNumbers.z: return Player.z

            case PlayerNumbers.yaw: return Player.yaw
            case PlayerNumbers.pitch: return Player.pitch
            case PlayerNumbers.fov: return Player.fov

            case PlayerNumbers.vy: return Player.vy
            case PlayerNumbers.ay: return Player.ay

            case PlayerNumbers.minW: return Player.minW
            case PlayerNumbers.minH: return Player.minH
            case PlayerNumbers.minL: return Player.minL
            case PlayerNumbers.maxW: return Player.maxW
            case PlayerNumbers.maxH: return Player.maxH
            case PlayerNumbers.maxL: return Player.maxL

            case PlayerNumbers.moveSpeed: return Player.moveSpeed
            case PlayerNumbers.turnSpeed: return Player.turnSpeed

            case PlayerNumbers.gravity: return Player.gravity
            case PlayerNumbers.onLand: return Player.onLand
        }
        return 0
    }

    //% group="Player"
    //% block="set %v to %amount"
    export function setVar(v: PlayerNumbers, value: any) {
        switch (v) {
            case PlayerNumbers.fVec: Player.fVec = value; break
            case PlayerNumbers.rVec: Player.rVec = value; break
            case PlayerNumbers.uVec: Player.uVec = value; break

            case PlayerNumbers.x: Player.x = value; break
            case PlayerNumbers.y: Player.y = value; break
            case PlayerNumbers.z: Player.z = value; break

            case PlayerNumbers.yaw: Player.yaw = value; break
            case PlayerNumbers.pitch: Player.pitch = value; break
            case PlayerNumbers.fov: Player.fov = value; break

            case PlayerNumbers.vy: Player.vy = value; break
            case PlayerNumbers.ay: Player.ay = value; break

            case PlayerNumbers.minW: Player.minW = value; break
            case PlayerNumbers.minH: Player.minH = value; break
            case PlayerNumbers.minL: Player.minL = value; break
            case PlayerNumbers.maxW: Player.maxW = value; break
            case PlayerNumbers.maxH: Player.maxH = value; break
            case PlayerNumbers.maxL: Player.maxL = value; break

            case PlayerNumbers.moveSpeed: Player.moveSpeed = value; break
            case PlayerNumbers.turnSpeed: Player.turnSpeed = value; break

            case PlayerNumbers.gravity: Player.gravity = value; break
            case PlayerNumbers.onLand: Player.onLand = value; break
        }
    }

    //% group="Player"
    //% block="change %v by %amount"
    export function changeVar(v: PlayerNumbers, amount: any) {
        switch (v) {
            case PlayerNumbers.fVec: Player.fVec += amount; break
            case PlayerNumbers.rVec: Player.rVec += amount; break
            case PlayerNumbers.uVec: Player.uVec += amount; break

            case PlayerNumbers.x: Player.x += amount; break
            case PlayerNumbers.y: Player.y += amount; break
            case PlayerNumbers.z: Player.z += amount; break

            case PlayerNumbers.yaw: Player.yaw += amount; break
            case PlayerNumbers.pitch: Player.pitch += amount; break
            case PlayerNumbers.fov: Player.fov += amount; break

            case PlayerNumbers.vy: Player.vy += amount; break
            case PlayerNumbers.ay: Player.ay += amount; break

            case PlayerNumbers.minW: Player.minW += amount; break
            case PlayerNumbers.minH: Player.minH += amount; break
            case PlayerNumbers.minL: Player.minL += amount; break
            case PlayerNumbers.maxW: Player.maxW += amount; break
            case PlayerNumbers.maxH: Player.maxH += amount; break
            case PlayerNumbers.maxL: Player.maxL += amount; break

            case PlayerNumbers.moveSpeed: Player.moveSpeed += amount; break
            case PlayerNumbers.turnSpeed: Player.turnSpeed += amount; break

            case PlayerNumbers.gravity: Player.gravity += amount; break
            case PlayerNumbers.onLand: Player.onLand += amount; break
        }
    }
}
