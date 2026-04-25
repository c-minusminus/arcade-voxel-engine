namespace VoxelEngine.Features {
    export let blockBreaking = false
    export let blockPlacing = false
    export let hitboxDetection = false
    export let render = false
    export let updatePlayer = false
    export let renderSelected = false
    export let enabled = false
}

namespace VoxelEngine {
    //% group="Features"
    //% block="enable block breaking %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enableBlockBreaking(on: boolean) {
        Features.blockBreaking = on
    }

    //% group="Features"
    //% block="enable block placing %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enableBlockPlacing(on: boolean) {
        Features.blockPlacing = on
    }

    //% group="Features"
    //% block="enable player hitbox %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enablePlayerHitbox(on: boolean) {
        Features.hitboxDetection = on
    }

    //% group="Features"
    //% block="enable rendering %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enableRendering(on: boolean) {
        Features.render = on
    }

    //% group="Features"
    //% block="enable rendering selected block %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enableRenderingSelected(on: boolean) {
        Features.renderSelected = on
    }

    //% group="Features"
    //% block="enable player updating %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enablePlayerUpdating(on: boolean) {
        Features.updatePlayer = on
    }

    //% group="Features"
    //% block="enable engine %on"
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enabled(on: boolean) {
        Features.enabled = on
    }
}
