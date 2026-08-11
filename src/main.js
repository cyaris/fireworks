import "svelte-lib/styles/app.css"
import "svelte-lib/styles/root.css"

import { mountEmbeddedRoot } from "svelte-lib/functions"

import { FireworkCanvas } from "./lib/components"

let div = mountEmbeddedRoot({ classes: ["fireworks"] })

new FireworkCanvas({ target: div })
