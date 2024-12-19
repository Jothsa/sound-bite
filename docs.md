# sound-bite

A simple inline audio component. This uses an HTML Audio element internally, so the audio element events should bubble up through this component. It doesn't handle wrapping well. It is designed for shorter audio clips.

## Properties

| Property           | Attribute          | Type                                  | Default        | Description                                      |
|--------------------|--------------------|---------------------------------------|----------------|--------------------------------------------------|
| `audioState`       | `audioState`       | `"playing" \| "paused"`               | "paused"       | Don't give audioState a default value. (If it is manually set to "playing", the css anim tries to run  when the sound isn't loaded which causes issues.) |
| `name`             | `name`             | `string`                              | ""             | The name of the sound. This will be used as the default content of the element as well as the aria-label. |
| `prefetchStrategy` | `prefetchStrategy` | `"hover" \| "intersection" \| "load"` | "intersection" | When to load the audio file. If the file is not loaded, clicking will have no effect. Hover will load the audio when the user hovers over the element (this could be risky if the sound is large and can't be loaded before clicked). Intersection will load the audio when the element is 50% visible in the viewport. Load will load the audio as soon as the element is connected. Defaults to intersection. |
| `src`              | `src`              | `string`                              | ""             | the audio file source. This is required.         |

## Slots

| Name         | Description                                      |
|--------------|--------------------------------------------------|
|              | The default slot has the name of the sound by default (from the name attribute). |
| `pause-icon` | This slot will be shown when the sound is playing. Defaults to the pause emoji, ⏸️. |
| `play-icon`  | This slot will be shown when the sound is paused. Defaults to the play emoji, ▶️. |

## CSS Custom Properties

| Property                   | Default                  | Description                                      |
|----------------------------|--------------------------|--------------------------------------------------|
| `--bg-block-offset`        | "0lh"                    | The block offset of the background.              |
| `--bg-color`               | "grey"                   | The background color of the soundbite.           |
| `--bg-height`              | "1lh"                    | The height of the background.                    |
| `--focus-outline`          | "2px solid currentColor" | The focus outline.                               |
| `--focus-outline-offset`   | "2px"                    | The focus outline offset.                        |
| `--initial-bg-block-size`  | "var(--bg-height)"       | The initial background block size.               |
| `--initial-bg-inline-size` | "0.5ch"                  | The initial background inline size.              |
| `--initial-padding`        | "0.3ch"                  | The padding between the initial background and the icon/text. |
