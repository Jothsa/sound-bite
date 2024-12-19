# Sound-Bite

A web component for simply, performantly, and accessibly adding inline sound bites.

This web component was made using Lit. I was inspired by [Soundcite](https://soundcite.knightlab.com). My goal for this project was to create a version that could be self hosted, was more accessible, and used modern technologies.

This component was built using [Lit](https://lit.dev).

## Usage

### Installation

```bash
pnpm add @jothsa/sound-bite
```

### Importing

Import the custom element.

```ts
import "@jothsa/sound-bite";
```

```html
<script src="@jothsa/sound-bite"></script>
```

Or if you want to define it manually

```ts
import { SoundBite } from "@jothsa/sound-bite";

window.customElements.define("my-named-sound-bite", SoundBite);
```

### HTML Usage

```html
<sound-bite
  src="https://example.com/sound.mp3"
  name="Example Sound"
></sound-bite>
```

See the complete component docs (generated using [web-component-analyzer](https://github.com/runem/web-component-analyzer)) [here](./docs.md).

## Accessibility

I have tried to make it accessible, however I am far from an expert. If you have any accessibility improvements or notice any problems, please open a GitHub issue!

## Further Customization

I have tried to keep this component pretty simple. If you want to customize it further, feel free to fork the project!

## Compatibility

This component should work in all browsers that support web components and css nesting. Javascript is required. However, if web components are not supported or js is not enabled, the component will not render which is not the end of the world. However, to provide a better fallback, add the name of the sound in the default slot of the component.

## Known Issues

This component doesn't handle line wrapping very well. Try to keep it on one line if possible. It also acts weird if the user manually seeks the audio.
