# Sound-Bite

A web component for simply, performantly, and accessibly adding inline sound bites.

This web component was made using Lit. I was inspired by [Soundcite](https://soundcite.knightlab.com). My goal for this project was to create a version that could be self hosted, was more accessible, and used modern technologies.

This component was built using [Lit`](https://lit.dev).

## Usage

### Installation

```bash
pnpm add @jothsa/sound-bite
```

### Importing

Import the custom element.

```ts
import "sound-bite";
```

Or if you want to define it manually

```ts
import { SoundBite } from "sound-bite/soundBiteClass";

window.customElements.define("sound-bite", SoundBite);
```

### HTML Usage

```html
<sound-bite src="https://example.com/sound.mp3" name="Example Sound"></sound-bite>
```

For more details see the [HTML Attributes](#html-attributes) section.

## Accessibility

I have tried to make it accessible, however I am far from an expert. If you have any accessibility improvements or notice any problems, please open a GitHub issue!

## HTML Attributes

These are set on the `sound-bite` element.

src - The URL of the audio file to play.
name - The name of the sound bite. This will be used in the `aria-label` attribute of the button.
prefetchStrategy: "hover" | "intersection" | "load" (default: "intersection) - when to load the audio file. Either when the element is hovered over, when it is in view, or when the component is first connected to the dom. If the file is not loaded, clicking the button will have no effect.

audioState: "playing" | "paused" - The current state of the audio. This is a read-only attribute and should not be modified by the user.

## Slots

default - The content that will be displayed after the icon inside the button. By default this will be the name of the sound (the name attribute).

```html
<sound-bite src="https://example.com/sound.mp3" name="Crowd Noises">
  <span>the overwhelming crowd</span>
</sound-bite>
```

play-icon - The icon to be displayed to start playing the sound (it will be displayed when the sound is not playing). By default this is the play button emoji, ▶️.

```html
<sound-bite src="https://example.com/sound.mp3" name="Crowd Noises">
  <img src="/my-icon" slot="play-icon" alt="" />
</sound-bite>
```

pause-icon - The icon to be displayed to pause the sound (it will be displayed when the sound is playing). By default this is the pause button emoji, ⏸️.

```html
<sound-bite src="https://example.com/sound.mp3" name="Crowd Noises">
  <img src="/my-icon" slot="pause-icon" alt="" />
</sound-bite>
```

## Custom Properties

This web component exposes several custom properties to allow custom styling.

`--bg-block-offset` - the block offset of the background
`--bg-color` - the color of the background.
`--bg-height` - the height of the background
`--initial-bg-inline-size` - the initial background size
`--initial-padding` - the padding between the initial bg and the icon/text
`--focus-outline` - the focus outline
`--focus-outline-offset` - the focus outline offset

## Further Customization

I have tried to keep this component pretty simple. If you want to customize it further, feel free to fork the project!

## Compatibility

This component should work in all browsers that support web components and css nesting.

## Known Issues

This component doesn't handle line wrapping very well. Try to keep it on one life if possible.
