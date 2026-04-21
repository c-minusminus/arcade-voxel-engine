namespace VoxelEngine.Features {
    export let gravity = false
    export let blockBreaking = false
    export let blockPlacing = false
    export let hitboxDetection = false
    export let render = false
    export let updatePlayer = false
    export let renderSelected = false
    export let enabled = false
}

namespace VoxelEngine {

    export function enableGravity(on: boolean) {
        Features.gravity = on
    }

    export function enableBlockBreaking(on: boolean) {
        Features.blockBreaking = on
    }

    export function enableBlockPlacing(on: boolean) {
        Features.blockPlacing = on
    }

    export function enablePlayerHitbox(on: boolean) {
        Features.hitboxDetection = on
    }

    export function enableRendering(on: boolean) {
        Features.render = on
    }

    export function enableRenderingSelected(on: boolean) {
        Features.renderSelected = on
    }

    export function enablePlayerUpdating(on: boolean) {
        Features.updatePlayer = on
    }

    export function enabled(on: boolean) {
        Features.enabled = on
    }
}
