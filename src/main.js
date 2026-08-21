import "svelte-lib/styles/app.css"
import "svelte-lib/styles/root.css"

import { mountEmbeddedRoot } from "svelte-lib/functions"

import { FireworkCanvas } from "./lib/components"

new FireworkCanvas({ target: mountEmbeddedRoot({ classes: ["fireworks"] }) })
