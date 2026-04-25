namespace VoxelEngine {
    export class Player {
        static _fVec = [0, 0, 0]
        static _rVec = [0, 0, 0]
        static _uVec = [0, 0, 0]


        static _x = -1
        static _y = -1
        static _z = -1

        static _yaw = 0
        static _pitch = 0
        static _fov = 1.0

        static _gravity = false
        static _vy = 0
        static _ay = 1
        static _onLand = false

        // Hitbox extents
        static _minW = 0.3
        static _minH = 1.1
        static _minL = 0.3
        static _maxW = 0.3
        static _maxH = 0.3
        static _maxL = 0.3

        static _moveSpeed = 4
        static _turnSpeed = 1.5

        static init() { }

        //% group="Player"
        //% block="calculate current direction into fVec, rVec, and uVec"
        static computeBasis() {
            const cp = Math.cos(Player._pitch)
            const sp = Math.sin(Player._pitch)
            const cy = Math.cos(Player._yaw)
            const sy = Math.sin(Player._yaw)

            // forward (normalized)
            Player._fVec[0] = cp * cy
            Player._fVec[1] = sp
            Player._fVec[2] = cp * sy

            // right (normalized, horizontal)
            Player._rVec[0] = -Player._fVec[2]
            Player._rVec[1] = 0
            Player._rVec[2] = Player._fVec[0]
            const rl = Math.sqrt(Player._rVec[0] * Player._rVec[0] + Player._rVec[2] * Player._rVec[2])
            Player._rVec[0] /= rl
            Player._rVec[2] /= rl

            // up = r × f (normalized automatically if r,f are)
            Player._uVec[0] = Player._rVec[1] * Player._fVec[2] - Player._rVec[2] * Player._fVec[1]
            Player._uVec[1] = Player._rVec[2] * Player._fVec[0] - Player._rVec[0] * Player._fVec[2]
            Player._uVec[2] = Player._rVec[0] * Player._fVec[1] - Player._rVec[1] * Player._fVec[0]
        }

        static update(dt: number) {
            const aX = Player._x - Player._minW
            const aY = Player._y - Player._minH
            const aZ = Player._z - Player._minL
            const bX = Player._x + Player._maxW
            const bY = Player._y + Player._maxH
            const bZ = Player._z + Player._maxL

            const f = Player._fVec
            const r = Player._rVec
            const u = Player._uVec

            // --- movement input ---
            const move = Player._moveSpeed * dt
            const turn = Player._turnSpeed * dt

            let dx = 0, dy = 0, dz = 0

            if (browserEvents.W.isPressed()) { dx += f[0]; dy += f[1]; dz += f[2] }
            if (browserEvents.S.isPressed()) { dx -= f[0]; dy -= f[1]; dz -= f[2] }
            if (browserEvents.A.isPressed()) { dx -= r[0]; dy -= r[1]; dz -= r[2] }
            if (browserEvents.D.isPressed()) { dx += r[0]; dy += r[1]; dz += r[2] }
            if (browserEvents.Space.isPressed() && Player._onLand) Player._vy = 1.8

            if (Player.gravity) {
                // normal gravity
                Player._vy -= Player._ay * move
                dy = Player._vy
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

                    Player._x = Player._x + t[0] * dx
                    Player._y = Player._y + t[1] * dy
                    Player._z = Player._z + t[2] * dz

                    // --- vertical collision handling ---
                    if (dy !== 0) {
                        if (t[3] & 2) {
                            if (dy < 0) Player._onLand = true
                            Player._vy = 0
                        } else
                            Player._onLand = false
                    }
                } else {
                    // no collision
                    Player._x += dx
                    Player._y += dy
                    Player._z += dz
                }
            }




            if (browserEvents.ArrowLeft.isPressed()) Player._yaw -= turn
            if (browserEvents.ArrowRight.isPressed()) Player._yaw += turn
            if (browserEvents.ArrowUp.isPressed()) Player._pitch += turn
            if (browserEvents.ArrowDown.isPressed()) Player._pitch -= turn

            if (Player._pitch > 1.5) Player._pitch = 1.5
            if (Player._pitch < -1.5) Player._pitch = -1.5

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
                Player._gravity = !Player._gravity
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
        static interactWithWorld(place: boolean, mx: number, my: number) {
            if (mx < 0 || my < 0 || mx >= scene.screenWidth() || my >= scene.screenHeight()) return

            // 1. Use the same basis as render()
            Player.computeBasis()
            const f = Player._fVec
            const r = Player._rVec
            const u = Player._uVec

            // 2. Use the SAME sx/sy as render()
            const sx = VoxelEngine.Vars.sxTable[mx] * Player._fov
            const sy = VoxelEngine.Vars.syTable[my] * Player._fov

            // 3. Ray direction
            const dx = f[0] + r[0] * sx + u[0] * sy
            const dy = f[1] + r[1] * sx + u[1] * sy
            const dz = f[2] + r[2] * sx + u[2] * sy

            // 4. Raycast
            const hit = VoxelEngine.Ray.traceRay(Player._x, Player._y, Player._z, dx, dy, dz, 50)
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
        static teleportPlayer(x: number, y: number, z: number) {
            Player._x = x
            Player._y = y
            Player._z = z
        }

        //% group="Player"
        //% block="block player is looking at"
        static getLookBlock(): number {
            const hit = Ray.traceRay(Player._x, Player._y, Player._z, Player._fVec[0], Player._fVec[1], Player._fVec[2], 50)
            return hit[0] < 0 ? -1 : hit[4]
        }






        //% group="Player"
        //% blockCombine block="fVec"
        static get fVec() { return this._fVec }
        //% group="Player"
        //% blockCombine block="rVec"
        static get rVec() { return this._rVec }
        //% group="Player"
        //% blockCombine block="uVec"
        static get uVec() { return this._uVec }

        //% group="Player"
        //% blockCombine block="x"
        static get x() { return this._x }
        //% group="Player"
        //% blockCombine block="x"
        //% v.defl=0
        static set x(v: number) { this._x = v }
        //% group="Player"
        //% blockCombine block="y"
        static get y() { return this._y }
        //% group="Player"
        //% blockCombine block="y"
        //% v.defl=0
        static set y(v: number) { this._y = v }
        //% group="Player"
        //% blockCombine block="z"
        static get z() { return this._z }
        //% group="Player"
        //% blockCombine block="z"
        //% v.defl=0
        static set z(v: number) { this._z = v }
        //% group="Player"
        //% blockCombine block="yaw"
        static get yaw() { return this._yaw }
        //% group="Player"
        //% blockCombine block="yaw"
        //% v.defl=0
        static set yaw(v: number) { this._yaw = v }
        //% group="Player"
        //% blockCombine block="pitch"
        static get pitch() { return this._pitch }
        //% group="Player"
        //% blockCombine block="pitch"
        //% v.defl=0
        static set pitch(v: number) { this._pitch = v }
        //% group="Player"
        //% blockCombine block="fov"
        static get fov() { return this._fov }
        //% group="Player"
        //% blockCombine block="fov"
        //% v.defl=0
        static set fov(v: number) { this._fov = v }
        //% group="Player"
        //% blockCombine block="gravity"
        static get gravity() { return this._gravity }
        //% group="Player"
        //% blockCombine block="gravity"
        //% v.shadow="toggleOnOff"
        static set gravity(v: boolean) { this._gravity = v }
        //% group="Player"
        //% blockCombine block="vy"
        static get vy() { return this._vy }
        //% group="Player"
        //% blockCombine block="vy"
        //% v.defl=0
        static set vy(v: number) { this._vy = v }
        //% group="Player"
        //% blockCombine block="ay"
        static get ay() { return this._ay }
        //% group="Player"
        //% blockCombine block="ay"
        //% v.defl=0
        static set ay(v: number) { this._ay = v }
        // onLand is read‑only
        //% group="Player"
        //% blockCombine block="on land"
        static get onLand() { return this._onLand }
        //% group="Player"
        //% blockCombine block="min width"
        static get minW() { return this._minW }
        //% group="Player"
        //% blockCombine block="min width"
        //% v.defl=0
        static set minW(v: number) { this._minW = v }
        //% group="Player"
        //% blockCombine block="min height"
        static get minH() { return this._minH }
        //% group="Player"
        //% blockCombine block="min height"
        //% v.defl=0
        static set minH(v: number) { this._minH = v }
        //% group="Player"
        //% blockCombine block="min length"
        static get minL() { return this._minL }
        //% group="Player"
        //% blockCombine block="min length"
        //% v.defl=0
        static set minL(v: number) { this._minL = v }
        //% group="Player"
        //% blockCombine block="max width"
        static get maxW() { return this._maxW }
        //% group="Player"
        //% blockCombine block="max width"
        //% v.defl=0
        static set maxW(v: number) { this._maxW = v }
        //% group="Player"
        //% blockCombine block="max height"
        static get maxH() { return this._maxH }
        //% group="Player"
        //% blockCombine block="max height"
        //% v.defl=0
        static set maxH(v: number) { this._maxH = v }
        //% group="Player"
        //% blockCombine block="max length"
        static get maxL() { return this._maxL }
        //% group="Player"
        //% blockCombine block="max length"
        //% v.defl=0
        static set maxL(v: number) { this._maxL = v }
        //% group="Player"
        //% blockCombine block="move speed"
        static get moveSpeed() { return this._moveSpeed }
        //% group="Player"
        //% blockCombine block="move speed"
        //% v.defl=0
        static set moveSpeed(v: number) { this._moveSpeed = v }
        //% group="Player"
        //% blockCombine block="turn speed"
        static get turnSpeed() { return this._turnSpeed }
        //% group="Player"
        //% blockCombine block="turn speed"
        //% v.defl=0
        static set turnSpeed(v: number) { this._turnSpeed = v }
    }
}
