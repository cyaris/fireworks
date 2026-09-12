import "svelte-lib/styles/app.css"
import "svelte-lib/styles/root.css"

import { mountEmbeddedRoot } from "svelte-lib/functions/dom"

import FireworkCanvas from "./lib/components/App.svelte"

new FireworkCanvas({ props: { id: "fireworks" }, target: mountEmbeddedRoot({ classes: ["fireworks"] }) })
