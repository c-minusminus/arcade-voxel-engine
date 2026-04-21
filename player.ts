namespace VoxelEngine.Player {
    export let fVec = [0, 0, 0]
    export let rVec = [0, 0, 0]
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

    export function computeBasis() {
        const cp = Math.cos(pitch)
        const sp = Math.sin(pitch)
        const cy = Math.cos(yaw)
        const sy = Math.sin(yaw)

        // forward (normalized)
        fVec[0] = cp * cy
        fVec[1] = sp
        fVec[2] = cp * sy

        // right (normalized, horizontal)
        rVec[0] = -fVec[2]
        rVec[1] = 0
        rVec[2] = fVec[0]
        const rl = Math.sqrt(rVec[0] * rVec[0] + rVec[2] * rVec[2])
        rVec[0] /= rl
        rVec[2] /= rl

        // up = r × f (normalized automatically if r,f are)
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


        //onLand = isOnGround(ax, ay, az, bx, bz)
        // --- direction vectors ---
        const cf = Math.cos(pitch)
        const sf = Math.sin(pitch)


        const cy = Math.cos(yaw)
        const sy = Math.sin(yaw)

        let fx = cy
        let fz = sy



        // right = normalize(cross(forward, up(0,1,0)))
        let rx = -Math.sin(yaw)
        let rz = Math.cos(yaw)
        let ry = 10





        // --- movement input ---
        const move = moveSpeed * dt
        const turn = turnSpeed * dt

        let dx = 0, dy = 0, dz = 0

        if (browserEvents.W.isPressed()) { dx += fx; dz += fz }
        if (browserEvents.S.isPressed()) { dx -= fx; dz -= fz }
        if (browserEvents.A.isPressed()) { dx -= rx; dz -= rz }
        if (browserEvents.D.isPressed()) { dx += rx; dz += rz }
        if (browserEvents.Space.isPressed() && onLand) vy = 1.8

        if (VoxelEngine.Features.gravity) {
            // normal gravity
            vy -= ay * move
            dy = vy
        } else {
            // free-fly mode
            if (browserEvents.Q.isPressed()) dy += ry * move
            if (browserEvents.E.isPressed()) dy -= ry * move
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


        if (leftNow && !VoxelEngine.Vars.prevLeft && VoxelEngine.Features.blockPlacing) {
            interactWithWorld(true)
        }

        if (rightNow && !VoxelEngine.Vars.prevRight && VoxelEngine.Features.blockBreaking) {
            interactWithWorld(false)
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

    export function interactWithWorld(place: boolean) {

        const mx = browserEvents.mouseX() | 0
        const my = browserEvents.mouseY() | 0

        if (mx < 0 || my < 0 || mx >= scene.screenWidth() || my >= scene.screenHeight()) return

        // 1. Use the same basis as render()
        computeBasis()
        const f = fVec
        const r = rVec
        const u = uVec

        // 2. Use the SAME sx/sy as render()
        const sx = VoxelEngine.Vars.sxTable[mx] * fov
        const sy = VoxelEngine.Vars.syTable[my] * fov

        // 3. Ray direction
        const dx = f[0] + r[0] * sx + u[0] * sy
        const dy = f[1] + r[1] * sx + u[1] * sy
        const dz = f[2] + r[2] * sx + u[2] * sy

        // 4. Raycast
        const hit = VoxelEngine.Ray.traceRay(x, y, z, dx, dy, dz, 50)
        const face = hit[0]
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
            VoxelEngine.World.voxels[vx + vy * VoxelEngine.World.sizeX + vz * VoxelEngine.World.XY] = VoxelEngine.Vars.charToIndex["a".charCodeAt(0)]
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
}