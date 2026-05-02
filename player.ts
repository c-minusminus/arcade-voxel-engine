enum PlayerNumbers {
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


    export let x = 0
    export let y = 0
    export let z = 0

    export let yaw = 0
    export let pitch = 0
    export let fov = 1

    export let gravity = false
    export let vy = 0
    export let ay = 0
    export let onLand = false

    // Hitbox extents
    export let minW = 1
    export let minH = 1
    export let minL = 1
    export let maxW = 1
    export let maxH = 1
    export let maxL = 1

    export let moveSpeed = 0
    export let turnSpeed = 0

    export function init() { }

    //% group="Player"
    //% block="calculate current direction into fVec, rVec, and uVec"
    export function computeBasis() {
        const cp = Math.cos(Player.pitch)
        const sp = Math.sin(Player.pitch)
        const cy = Math.cos(Player.yaw)
        const sy = Math.sin(Player.yaw)

        // forward (full 3D)
        fVec[0] = cp * cy
        fVec[1] = sp
        fVec[2] = cp * sy

        // right (horizontal only)
        rVec[0] = -sy
        rVec[1] = 0
        rVec[2] = cy

        // up = cross(right, forward)
        uVec[0] = rVec[1] * fVec[2] - rVec[2] * fVec[1]
        uVec[1] = rVec[2] * fVec[0] - rVec[0] * fVec[2]
        uVec[2] = rVec[0] * fVec[1] - rVec[1] * fVec[0]
    }


    export function update(dt: number) {
        const aX = x - minW
        const aY = y - minH
        const aZ = z - minL
        const bX = x + maxW
        const bY = y + maxH
        const bZ = z + maxL

        const f = fVec
        const r = rVec
        const u = uVec

        // --- movement input ---
        const move = moveSpeed * dt
        const turn = turnSpeed * dt



        const cy = Math.cos(Player.yaw)
        const sy = Math.sin(Player.yaw)
        const fx = cy
        const fz = sy
        const rx = -sy
        const rz = cy

        let dx = 0, dy = 0, dz = 0

        // --- movement input ---
        if (browserEvents.W.isPressed()) { dx += fx; dz += fz }
        if (browserEvents.S.isPressed()) { dx -= fx; dz -= fz }
        if (browserEvents.A.isPressed()) { dx -= rx; dz -= rz }
        if (browserEvents.D.isPressed()) { dx += rx; dz += rz }

        // --- vertical movement ---
        if (!Player.gravity) {
            if (browserEvents.Q.isPressed()) dy += 1
            if (browserEvents.E.isPressed()) dy -= 1
        } else {
            Player.vy -= Player.ay * dt
            dy = Player.vy
        }

        // normalize movement so diagonal isn't faster
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (len > 0) {
            dx /= len
            dy /= len
            dz /= len
        }

        // apply speed
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

                x = x + t[0] * dx
                y = y + t[1] * dy
                z = z + t[2] * dz

                // --- vertical collision handling ---
                if (dy !== 0) {
                    if (t[3] & 2) {
                        if (dy < 0) onLand = true
                        vy = 0
                    } else
                        onLand = false
                }
            } else {
                // no collision
                x += dx
                y += dy
                z += dz

            }
        }




        if (browserEvents.ArrowLeft.isPressed()) yaw -= turn
        if (browserEvents.ArrowRight.isPressed()) yaw += turn
        if (browserEvents.ArrowUp.isPressed()) pitch += turn
        if (browserEvents.ArrowDown.isPressed()) pitch -= turn

        if (pitch > 1.5) pitch = 1.5
        if (pitch < -1.5) pitch = -1.5

        const leftNow = browserEvents.MouseLeft.isPressed()
        const rightNow = browserEvents.MouseRight.isPressed()

        const mx = browserEvents.mouseX()
        const my = browserEvents.mouseY()

        if (leftNow && !VoxelEngine.Vars.prevLeft && VoxelEngine.Features.blockPlacing) {
            interactWithWorld(true, mx, my)
        }

        if (rightNow && !VoxelEngine.Vars.prevRight && VoxelEngine.Features.blockBreaking) {
            interactWithWorld(false, mx, my)
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
            gravity = !gravity
        }

        VoxelEngine.Vars.prevZ = zNow
        VoxelEngine.Vars.prevX = xNow
        VoxelEngine.Vars.prevG = gNow
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
        computeBasis()
        const f = fVec
        const r = rVec
        const u = uVec

        // 2. Use the SAME sx/sy as render()
        const sx = VoxelEngine.Vars.sxTable[mx|0] * fov
        const sy = VoxelEngine.Vars.syTable[my|0] * fov

        // 3. Ray direction
        const dx = f[0] + r[0] * sx + u[0] * sy
        const dy = f[1] + r[1] * sx + u[1] * sy
        const dz = f[2] + r[2] * sx + u[2] * sy

        // 4. Raycast
        const hit = VoxelEngine.Ray.traceRay(x, y, z, dx, dy, dz, 50)
        const face = hit[0]

        if (face < 0) return

        // ITS NEVER GETTING HERE

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
        x = x
        y = y
        z = z
    }

    //% group="Player"
    //% block="block player is looking at"
    export function getLookBlock(): number {
        const hit = Ray.traceRay(x, y, z, fVec[0], fVec[1], fVec[2], 50)
        return hit[0] < 0 ? -1 : hit[4]
    }



    //% group="Player"
    //% block="get %v"
    export function getVar(v: PlayerNumbers): number {
        switch (v) {
            case PlayerNumbers.x: return x
            case PlayerNumbers.y: return y
            case PlayerNumbers.z: return z

            case PlayerNumbers.yaw: return yaw
            case PlayerNumbers.pitch: return pitch
            case PlayerNumbers.fov: return fov

            case PlayerNumbers.vy: return vy
            case PlayerNumbers.ay: return ay

            case PlayerNumbers.minW: return minW
            case PlayerNumbers.minH: return minH
            case PlayerNumbers.minL: return minL
            case PlayerNumbers.maxW: return maxW
            case PlayerNumbers.maxH: return maxH
            case PlayerNumbers.maxL: return maxL

            case PlayerNumbers.moveSpeed: return moveSpeed
            case PlayerNumbers.turnSpeed: return turnSpeed

            case PlayerNumbers.gravity: return gravity ? 1 : 0
            case PlayerNumbers.onLand: return onLand ? 1 : 0
        }
        return 0
    }

    //% group="Player"
    //% block="set %v to %amount"
    export function setVar(v: PlayerNumbers, value: number) {
        switch (v) {
            case PlayerNumbers.x: x = value; break
            case PlayerNumbers.y: y = value; break
            case PlayerNumbers.z: z = value; break

            case PlayerNumbers.yaw: yaw = value; break
            case PlayerNumbers.pitch: pitch = value; break
            case PlayerNumbers.fov: fov = value; break

            case PlayerNumbers.vy: vy = value; break
            case PlayerNumbers.ay: ay = value; break

            case PlayerNumbers.minW: minW = value; break
            case PlayerNumbers.minH: minH = value; break
            case PlayerNumbers.minL: minL = value; break
            case PlayerNumbers.maxW: maxW = value; break
            case PlayerNumbers.maxH: maxH = value; break
            case PlayerNumbers.maxL: maxL = value; break

            case PlayerNumbers.moveSpeed: moveSpeed = value; break
            case PlayerNumbers.turnSpeed: turnSpeed = value; break

            case PlayerNumbers.gravity: gravity = (value==1); break
            case PlayerNumbers.onLand: onLand = (value==1); break
        }
    }

    //% group="Player"
    //% block="change %v by %amount"
    export function changeVar(v: PlayerNumbers, amount: number) {
        switch (v) {
            case PlayerNumbers.x: x += amount; break
            case PlayerNumbers.y: y += amount; break
            case PlayerNumbers.z: z += amount; break

            case PlayerNumbers.yaw: yaw += amount; break
            case PlayerNumbers.pitch: pitch += amount; break
            case PlayerNumbers.fov: fov += amount; break

            case PlayerNumbers.vy: vy += amount; break
            case PlayerNumbers.ay: ay += amount; break

            case PlayerNumbers.minW: minW += amount; break
            case PlayerNumbers.minH: minH += amount; break
            case PlayerNumbers.minL: minL += amount; break
            case PlayerNumbers.maxW: maxW += amount; break
            case PlayerNumbers.maxH: maxH += amount; break
            case PlayerNumbers.maxL: maxL += amount; break

            case PlayerNumbers.moveSpeed: moveSpeed += amount; break
            case PlayerNumbers.turnSpeed: turnSpeed += amount; break

            case PlayerNumbers.gravity: gravity !== (amount==1); break
            case PlayerNumbers.onLand: onLand !== (amount == 1); break
        }
    }

    //% group="Player"
    //% block="get fowards, up, and right"
    export function getDirections() {
        return [fVec, uVec, rVec]
    }
}